import { describe, expect, it } from 'vitest';
import { createInitialNibi, createInitialState, advanceTime, type GameState } from '../core/state/GameState';
import { loadGame, readSave, serializeSave } from './save';
import type { SaveAdapter } from './SaveAdapter';
const clock = { now: () => 1000 };
const random = { next: () => 0 };
const noRandom = { next: (): number => { throw new Error('Unexpected RNG'); } };
const initial = createInitialState(clock, random);
const resident: GameState = { ...initial, nibiPhase: 'resident', nibi: createInitialNibi(clock, random), relations: { momoNibi: 3 } };
const adapter = (raw: string): SaveAdapter => ({ read: () => raw, write: () => {} });

describe('targeted schema 3 to 4 migration and safe parsing', () => {
  it('preserves original timestamp, Momo, resources, bowl and acknowledged M2 report without RNG', () => {
    const state = { momo: initial.momo, resources: { berries: 7 }, bowl: 'berry', latestReport: {
      generatedAt: 900, elapsedMs: 300000, berriesGained: 0, eventIds: ['bowl_nap'], acknowledged: true,
    } };
    const migrated = readSave(adapter(JSON.stringify({ schemaVersion: 3, savedAt: 1200, state })), clock, noRandom);
    expect(migrated).toEqual({ schemaVersion: 4, savedAt: 1200, state: { ...state,
      nibiPhase: 'unseen', nibi: null, relations: { momoNibi: 0 } } });
  });
  it.each(['unseen', 'traces'] as const)('round-trips %s with null Nibi', (nibiPhase) => {
    const state = { ...initial, nibiPhase };
    expect(loadGame(adapter(serializeSave(state, clock)), clock, noRandom)).toEqual(state);
  });
  it('round-trips settled and moving resident Nibi and relationship', () => {
    expect(loadGame(adapter(serializeSave(resident, clock)), clock, noRandom)).toEqual(resident);
    const moved = advanceTime(resident, { now: () => 4000 }, random);
    expect(loadGame(adapter(serializeSave(moved, { now: () => 4500 })), { now: () => 5000 }, noRandom)).toEqual(moved);
  });
  it('round-trips arrival report with no recurring events and traces report with ordinary events', () => {
    const report = { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, acknowledged: false };
    const arrival: GameState = { ...resident, latestReport: { ...report, discoveryId: 'nibi_arrival', eventIds: [] } };
    const tracks: GameState = { ...initial, nibiPhase: 'traces', latestReport: { ...report, discoveryId: 'nibi_tracks', eventIds: ['root_nap'] } };
    for (const state of [arrival, tracks]) expect(loadGame(adapter(serializeSave(state, clock)), clock, noRandom)).toEqual(state);
  });
  it.each([
    { ...initial, nibiPhase: 'unknown' }, { ...initial, nibi: resident.nibi },
    { ...resident, nibi: null }, { ...resident, nibi: { ...resident.nibi, currentActivityId: 'doze_tree' } },
    { ...resident, nibi: { ...resident.nibi, currentAnchor: 'stream' } },
    { ...resident, nibi: { ...resident.nibi, deadline: 999999 } },
    { ...resident, nibi: { ...resident.nibi, phaseStartedAt: 1001, deadline: 4001 } },
    { ...resident, relations: { momoNibi: -1 } }, { ...resident, relations: { momoNibi: 6 } },
    { ...resident, relations: { momoNibi: 0.5 } }, { ...resident, relations: null },
    { ...initial, relations: { momoNibi: 1 } },
    { ...initial, latestReport: { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, acknowledged: false, eventIds: ['pair_root_squeeze'] } },
    { ...initial, latestReport: { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, acknowledged: false, discoveryId: 'nibi_arrival', eventIds: [] } },
    { ...initial, latestReport: { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, acknowledged: false, eventIds: [] } },
    { ...resident, latestReport: { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, acknowledged: false, discoveryId: 'unknown', eventIds: [] } },
    { ...resident, latestReport: { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, acknowledged: false, discoveryId: 'nibi_arrival', eventIds: ['bowl_nap'] } },
    { ...resident, latestReport: { generatedAt: 1000, elapsedMs: 1800000, berriesGained: 0, acknowledged: false, eventIds: ['pair_root_squeeze', 'pair_cautious_circle'] } },
  ])('rejects corrupt/inconsistent M3 fields safely', (state) => {
    expect(loadGame(adapter(JSON.stringify({ schemaVersion: 4, savedAt: 1000, state })), clock, random)).toEqual(initial);
  });
  it('rebases resident Nibi and Momo together on a backward-clock reload', () => {
    const state = loadGame(adapter(serializeSave(resident, { now: () => 2000 })), { now: () => 0 }, noRandom);
    expect(state.nibi?.phaseStartedAt).toBe(0);
    expect(state.nibi?.deadline).toBe(3000);
    expect(state.momo.deadline).toBe(8000);
    expect(state.relations.momoNibi).toBe(3);
  });
});

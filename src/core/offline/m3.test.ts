import { describe, expect, it } from 'vitest';
import { createInitialNibi, createInitialState, type GameState } from '../state/GameState';
import { offlineEvents, isReturnReport } from './ReturnReport';
import { reconcileOffline } from './reconcile';
const random = { next: () => 0 };
const savedAt = 1000;
const initial = createInitialState({ now: () => savedAt }, random);
const resident: GameState = { ...initial, nibiPhase: 'resident', nibi: createInitialNibi({ now: () => savedAt }, random) };
const run = (state: GameState, elapsed = 300000, roll = 0) =>
  reconcileOffline(state, savedAt, { now: () => savedAt + elapsed }, { next: () => roll });
const sharedIds = offlineEvents.filter((event) => event.kind === 'shared').map((event) => event.id);

describe('M3 discovery and bounded recurring priorities', () => {
  it('under five minutes leaves unseen untouched without draws', () => {
    expect(reconcileOffline(initial, savedAt, { now: () => 300999 }, { next: (): number => { throw new Error('RNG'); } }))
      .toEqual({ state: initial, report: null });
  });
  it('first valid return discovers only traces, alongside an ordinary M2 event', () => {
    const result = run(initial);
    expect(result.state.nibiPhase).toBe('traces');
    expect(result.state.nibi).toBeNull();
    expect(result.state.bowl).toBe('empty');
    expect(result.state.resources).toEqual(initial.resources);
    expect(result.report).toMatchObject({ discoveryId: 'nibi_tracks', eventIds: ['root_nap'] });
    expect(isReturnReport(result.report)).toBe(true);
    const again = run(result.state);
    expect(again.report?.discoveryId).toBeUndefined();
    expect(again.state.nibiPhase).toBe('traces');
  });
  it('traces with empty bowl do not arrive', () => {
    expect(run({ ...initial, nibiPhase: 'traces' }).state.nibi).toBeNull();
  });
  it('tracks do not consume a berry themselves; ordinary bowl event still applies', () => {
    const result = run({ ...initial, bowl: 'berry' });
    expect(result.report).toMatchObject({ discoveryId: 'nibi_tracks', eventIds: ['bowl_crumbs'] });
    expect(result.state.nibiPhase).toBe('traces');
    expect(result.state.bowl).toBe('empty');
  });
  it.each([300000, 1800000, 86400000])('arrival suppresses every recurring event, preserves common gain (%s)', (elapsed) => {
    let draws = 0;
    const result = reconcileOffline({ ...initial, nibiPhase: 'traces', bowl: 'berry' }, savedAt,
      { now: () => savedAt + elapsed }, { next: () => { draws++; return 0; } });
    expect(draws).toBe(1); // Initial Nibi duration only, no event selection.
    expect(result.state).toMatchObject({ nibiPhase: 'resident', bowl: 'empty', relations: { momoNibi: 0 },
      nibi: { phase: 'settled', currentActivityId: 'visit_tree', currentAnchor: 'tree' } });
    expect(result.report).toMatchObject({ discoveryId: 'nibi_arrival', eventIds: [],
      berriesGained: Math.min(8, Math.floor(elapsed / 900000)) });
    expect(isReturnReport(result.report)).toBe(true);
  });
  it.each([
    [300000, 'empty', ['pair_cautious_circle'], 1],
    [300000, 'berry', ['bowl_crumbs'], 0],
    [1800000, 'berry', ['bowl_crumbs', 'pair_cautious_circle'], 1],
    [1800000, 'empty', ['pair_cautious_circle', 'root_nap'], 1],
  ] as const)('keeps priority and slot limits: %s ms, %s bowl', (elapsed, bowl, ids, relation) => {
    const result = run({ ...resident, bowl }, elapsed);
    expect(result.report?.eventIds).toEqual(ids);
    expect(result.state.relations.momoNibi).toBe(relation);
    expect(result.report?.discoveryId).toBeUndefined();
    expect(result.report!.eventIds.filter((id) => sharedIds.includes(id)).length).toBeLessThanOrEqual(1);
    expect(result.report!.eventIds.length).toBeLessThanOrEqual(elapsed < 1800000 ? 1 : 2);
    expect(result.report?.berriesGained).toBe(Math.floor(elapsed / 900000));
  });
  it.each([0, 1, 2, 3, 4, 5])('only selects the correct shared set at relation %s', (relation) => {
    const state = { ...resident, relations: { momoNibi: relation } };
    const seen = new Set<string>();
    for (let roll = 0; roll < 1; roll += 0.01) seen.add(run(state, 300000, roll).report!.eventIds[0]);
    const expected = [
      ['pair_cautious_circle', 'pair_root_squeeze'],
      ['pair_cautious_circle', 'pair_root_squeeze', 'pair_stream_follow', 'pair_grass_chase'],
      ['pair_root_squeeze', 'pair_stream_follow', 'pair_grass_chase', 'pair_leaf_mess'],
      ['pair_root_squeeze', 'pair_stream_follow', 'pair_grass_chase', 'pair_leaf_mess', 'pair_shared_nap'],
      ['pair_stream_follow', 'pair_grass_chase', 'pair_leaf_mess', 'pair_shared_nap'],
      ['pair_stream_follow', 'pair_grass_chase', 'pair_leaf_mess', 'pair_shared_nap'],
    ][relation];
    expect([...seen].sort()).toEqual(expected.sort());
  });
  it('clamps negative at zero, positive at five, and avoids previous shared event', () => {
    const negative = run(resident, 300000, 0.999999);
    expect(negative.report?.eventIds).toEqual(['pair_root_squeeze']);
    expect(negative.state.relations.momoNibi).toBe(0);
    const positive = run(negative.state, 300000, 0.999999);
    expect(positive.report?.eventIds).toEqual(['pair_cautious_circle']);
    expect(positive.state.relations.momoNibi).toBe(1);
    expect(run({ ...resident, relations: { momoNibi: 5 } }).state.relations.momoNibi).toBe(5);
  });
  it('never selects more than one shared event even across long absences or relation values', () => {
    for (const relation of [0, 1, 3, 5]) for (const elapsed of [300000, 1800000, 31536000000]) {
      const result = run({ ...resident, relations: { momoNibi: relation } }, elapsed, 0.9);
      expect(result.report!.eventIds.filter((id) => sharedIds.includes(id))).toHaveLength(1);
      expect(result.report!.eventIds.length).toBeLessThanOrEqual(elapsed < 1800000 ? 1 : 2);
    }
  });
  it('all six shared events are authored data with no resource effects', () => {
    const shared = offlineEvents.filter((event) => event.kind === 'shared');
    expect(shared).toHaveLength(6);
    expect(shared.map((event) => [event.weight, event.minRelation, event.maxRelation, event.relationshipDelta]))
      .toEqual([[4, 0, 1, 1], [2, 0, 3, -1], [3, 1, 5, 1], [3, 1, 5, 1], [2, 2, 5, 1], [2, 3, 5, 1]]);
    expect(shared.every((event) => event.effects === undefined)).toBe(true);
  });
});

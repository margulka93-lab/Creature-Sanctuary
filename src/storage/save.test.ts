import { describe, expect, it } from 'vitest';
import { advanceTime, createInitialState } from '../core/state/GameState';
import { LocalStorageSaveAdapter, SAVE_KEY } from './LocalStorageSaveAdapter';
import type { SaveAdapter } from './SaveAdapter';
import { loadGame, readSave, saveGame, serializeSave } from './save';

function memoryAdapter(raw: string | null = null): SaveAdapter {
  return { read: () => raw, write: (save) => { raw = save; } };
}
const clock = { now: () => 1000 };
const random = { next: () => 0 };
const noRandom = { next: (): number => { throw new Error('Unexpected RNG consumption'); } };
const initial = createInitialState(clock, random);
const moving = advanceTime(initial, { now: () => initial.momo.deadline }, random);
const envelope = (state: unknown, schemaVersion = 3) => JSON.stringify({ schemaVersion, savedAt: 1000, state });

describe('M2 versioned save with M1 resume regression', () => {
  it('serializes schema 3, timestamp and state', () => {
    expect(JSON.parse(serializeSave(initial, clock))).toEqual({ schemaVersion: 3, savedAt: 1000, state: initial });
  });

  it('round-trips an in-progress settled phase without drawing new randomness', () => {
    const adapter = memoryAdapter();
    expect(saveGame(adapter, initial, clock)).toBe(true);
    expect(loadGame(adapter, { now: () => 2000 }, noRandom)).toEqual(initial);
  });

  it('round-trips an in-progress movement, including its chosen activity duration', () => {
    const adapter = memoryAdapter(serializeSave(moving, { now: () => 9500 }));
    expect(loadGame(adapter, { now: () => 10000 }, noRandom)).toEqual(moving);
  });

  it('resumes a long-expired settled phase with only one transition', () => {
    let draws = 0;
    const loaded = loadGame(memoryAdapter(serializeSave(initial, clock)), { now: () => 1_000_000 }, {
      next: () => { draws++; return 0; },
    });
    expect(draws).toBe(2);
    expect(loaded.momo.phase).toBe('moving');
    expect(loaded.momo.deadline).toBe(1_003_000);
  });

  it('resumes a long-expired movement into the intended activity from now', () => {
    const loaded = loadGame(memoryAdapter(serializeSave(moving, { now: () => 9500 })), { now: () => 1_000_000 }, noRandom);
    expect(loaded.momo).toEqual({ phase: 'settled', currentAnchor: 'stream', currentActivityId: 'watch_stream',
      phaseStartedAt: 1_000_000, deadline: 1_005_000 });
  });

  it('rebases a backward clock on reload and keeps a bounded valid phase', () => {
    const adapter = memoryAdapter(serializeSave(moving, { now: () => 10000 }));
    const loaded = loadGame(adapter, { now: () => 5000 }, noRandom);
    expect(loaded.momo.phaseStartedAt).toBe(4000);
    expect(loaded.momo.deadline).toBe(7000);
    expect(loadGame(memoryAdapter(serializeSave(initial, { now: () => 2000 })), { now: () => 0 }, noRandom).momo.deadline).toBe(8000);
  });

  it('explicitly resets a valid M0.5 save to initial M1 activity', () => {
    const legacy = envelope({ momo: { currentAnchor: 'stream', move: null } }, 1);
    expect(loadGame(memoryAdapter(legacy), clock, random)).toEqual(initial);
  });

  it.each([
    null, '', '{broken', 'null', '[]', '{}', envelope(initial, 99),
    envelope({ momo: { ...initial.momo, currentAnchor: 'unknown' } }),
    envelope({ momo: { ...initial.momo, currentActivityId: 'unknown' } }),
    envelope({ momo: { ...initial.momo, currentAnchor: 'stream' } }),
    envelope({ momo: { ...initial.momo, phase: 'invalid' } }),
    envelope({ momo: { ...initial.momo, deadline: -1 } }),
    envelope({ momo: { ...initial.momo, deadline: 1000 } }),
    envelope({ momo: { ...moving.momo, activityDurationMs: 1 } }),
    envelope({ momo: { ...moving.momo, targetActivityId: 'doze_tree' } }),
    envelope({ momo: { ...moving.momo, deadline: null } }),
    JSON.stringify({ schemaVersion: 3, savedAt: -1, state: initial }),
    JSON.stringify({ schemaVersion: 3, savedAt: 1000.5, state: initial }),
    JSON.stringify({ schemaVersion: 3, savedAt: 0, state: initial }),
  ])('falls back safely for missing/invalid save: %s', (raw) => {
    expect(loadGame(memoryAdapter(raw), clock, random)).toEqual(initial);
  });

  it('handles blocked storage and quota failures', () => {
    const adapter = new LocalStorageSaveAdapter(() => { throw new Error('Storage blocked'); });
    expect(loadGame(adapter, clock, random)).toEqual(initial);
    expect(saveGame(adapter, initial, clock)).toBe(false);
    expect(saveGame({ read: () => null, write: () => { throw new Error('Quota'); } }, initial, clock)).toBe(false);
  });

  it('keeps the existing localStorage key', () => {
    const values = new Map<string, string>();
    const adapter = new LocalStorageSaveAdapter(() => ({
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => { values.set(key, value); },
    }));
    saveGame(adapter, initial, clock);
    expect(values.has(SAVE_KEY)).toBe(true);
    expect(loadGame(adapter, clock, noRandom)).toEqual(initial);
  });

  it('migrates a valid schema 2 save preserving Momo and initializes only M2 fields', () => {
    const legacy = JSON.stringify({ schemaVersion: 2, savedAt: 9500, state: { momo: moving.momo } });
    const migrated = readSave(memoryAdapter(legacy), { now: () => 10000 }, noRandom);
    expect(migrated).toEqual({ schemaVersion: 3, savedAt: 9500, state: {
      momo: moving.momo, resources: { berries: 1 }, bowl: 'empty', latestReport: null,
    } });
  });

  it('round-trips schema 3 resources, filled bowl and acknowledged latest report', () => {
    const state = { ...initial, resources: { berries: 7 }, bowl: 'berry' as const, latestReport: {
      generatedAt: 1000, elapsedMs: 900000, berriesGained: 2, eventIds: ['berry_under_root'], acknowledged: true,
    } };
    expect(loadGame(memoryAdapter(serializeSave(state, clock)), clock, noRandom)).toEqual(state);
  });

  it.each([
    { ...initial, resources: { berries: -1 } },
    { ...initial, resources: { berries: 1.5 } },
    { ...initial, bowl: 'invalid' },
    { ...initial, latestReport: { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, eventIds: ['unknown'], acknowledged: false } },
    { ...initial, latestReport: { generatedAt: 1000, elapsedMs: 300000, berriesGained: 0, eventIds: ['root_nap', 'root_nap'], acknowledged: false } },
  ])('rejects invalid M2 fields', (state) => {
    expect(loadGame(memoryAdapter(envelope(state)), clock, random)).toEqual(initial);
  });
});

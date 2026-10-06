import { describe, expect, it } from 'vitest';
import { createInitialState, startMove } from '../core/state/GameState';
import { LocalStorageSaveAdapter, SAVE_KEY } from './LocalStorageSaveAdapter';
import type { SaveAdapter } from './SaveAdapter';
import { loadGame, saveGame, serializeSave } from './save';

function memoryAdapter(raw: string | null = null): SaveAdapter {
  return { read: () => raw, write: (save) => { raw = save; } };
}
const clock = { now: () => 1000 };

describe('versioned save', () => {
  it('serializes the version, timestamp and minimal state', () => {
    const state = createInitialState();
    expect(JSON.parse(serializeSave(state, clock))).toEqual({ schemaVersion: 1, savedAt: 1000, state });
  });

  it('round-trips a valid saved position', () => {
    const adapter = memoryAdapter();
    const state = { momo: { currentAnchor: 'stream' as const, move: null } };
    expect(saveGame(adapter, state, clock)).toBe(true);
    expect(loadGame(adapter, clock)).toEqual(state);
  });

  it('restores a pending timer and finishes it once its deadline has passed', () => {
    const state = startMove(createInitialState(), 'stream', clock);
    const adapter = memoryAdapter(serializeSave(state, clock));
    expect(loadGame(adapter, { now: () => 2000 })).toEqual(state);
    expect(loadGame(adapter, { now: () => 4000 }).momo).toEqual({ currentAnchor: 'stream', move: null });
  });

  it('preserves remaining duration if the clock went backwards since saving', () => {
    const state = startMove(createInitialState(), 'stream', clock);
    const adapter = memoryAdapter(serializeSave(state, { now: () => 2000 }));
    expect(loadGame(adapter, { now: () => 500 }).momo.move?.completesAt).toBe(2500);
  });

  it.each([
    null, '', '{broken', 'null', '[]', '{}',
    JSON.stringify({ schemaVersion: 2, savedAt: 1000, state: createInitialState() }),
    JSON.stringify({ schemaVersion: 1, savedAt: -1, state: createInitialState() }),
    JSON.stringify({ schemaVersion: 1, savedAt: 1000, state: { momo: { currentAnchor: 'unknown', move: null } } }),
    JSON.stringify({ schemaVersion: 1, savedAt: 1000, state: { momo: { currentAnchor: 'tree', move: {} } } }),
    JSON.stringify({ schemaVersion: 1, savedAt: 1000, state: { momo: { currentAnchor: 'tree', move: { targetAnchor: 'stream', completesAt: null } } } }),
  ])('falls back safely for missing/invalid save: %s', (raw) => {
    expect(loadGame(memoryAdapter(raw), clock)).toEqual(createInitialState());
  });

  it('handles unavailable storage and write failures', () => {
    const adapter = new LocalStorageSaveAdapter(() => { throw new Error('Storage blocked'); });
    expect(loadGame(adapter, clock)).toEqual(createInitialState());
    expect(saveGame(adapter, createInitialState(), clock)).toBe(false);
    const full = { read: () => null, write: () => { throw new Error('Quota exceeded'); } };
    expect(saveGame(full, createInitialState(), clock)).toBe(false);
  });

  it('uses the localStorage adapter key for read/write', () => {
    const values = new Map<string, string>();
    const adapter = new LocalStorageSaveAdapter(() => ({
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => { values.set(key, value); },
    }));
    saveGame(adapter, createInitialState(), clock);
    expect(values.has(SAVE_KEY)).toBe(true);
    expect(loadGame(adapter, clock)).toEqual(createInitialState());
  });
});

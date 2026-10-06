import { advanceTime, createInitialState, isGameState, type GameState } from '../core/state/GameState';
import type { Clock } from '../core/time/Clock';
import type { SaveAdapter } from './SaveAdapter';

export interface SaveEnvelope {
  schemaVersion: 1;
  savedAt: number;
  state: GameState;
}

export function serializeSave(state: GameState, clock: Clock): string {
  const envelope: SaveEnvelope = { schemaVersion: 1, savedAt: clock.now(), state };
  return JSON.stringify(envelope);
}

export function loadGame(adapter: SaveAdapter, clock: Clock): GameState {
  try {
    const raw = adapter.read();
    if (raw === null) return createInitialState();
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('schemaVersion' in value) || value.schemaVersion !== 1 ||
        !('savedAt' in value) || typeof value.savedAt !== 'number' || !Number.isFinite(value.savedAt) || value.savedAt < 0 ||
        !('state' in value) || !isGameState(value.state)) return createInitialState();
    let state = value.state;
    const now = clock.now();
    if (now < value.savedAt && state.momo.move) {
      state = { momo: { ...state.momo, move: {
        ...state.momo.move,
        completesAt: now + Math.max(0, state.momo.move.completesAt - value.savedAt),
      } } };
    }
    // Only finish an already requested move; no offline simulation or rewards.
    return advanceTime(state, { now: () => now });
  } catch {
    return createInitialState();
  }
}

export function saveGame(adapter: SaveAdapter, state: GameState, clock: Clock): boolean {
  try {
    adapter.write(serializeSave(state, clock));
    return true;
  } catch {
    return false;
  }
}

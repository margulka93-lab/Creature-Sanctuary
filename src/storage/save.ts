import { advanceTime, createInitialState, isGameState, type GameState } from '../core/state/GameState';
import type { Clock } from '../core/time/Clock';
import type { RandomSource } from '../core/random/RandomSource';
import type { SaveAdapter } from './SaveAdapter';

export interface SaveEnvelope {
  schemaVersion: 2;
  savedAt: number;
  state: GameState;
}

export function serializeSave(state: GameState, clock: Clock): string {
  const envelope: SaveEnvelope = { schemaVersion: 2, savedAt: clock.now(), state };
  return JSON.stringify(envelope);
}

export function loadGame(adapter: SaveAdapter, clock: Clock, random: RandomSource): GameState {
  try {
    const raw = adapter.read();
    if (raw === null) return createInitialState(clock, random);
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('schemaVersion' in value) || value.schemaVersion !== 2 ||
        !('savedAt' in value) || typeof value.savedAt !== 'number' || !Number.isSafeInteger(value.savedAt) || value.savedAt < 0 ||
        !('state' in value) || !isGameState(value.state) || value.savedAt < value.state.momo.phaseStartedAt) return createInitialState(clock, random);
    let state = value.state;
    const now = clock.now();
    if (now < value.savedAt) {
      const offset = value.savedAt - now;
      const duration = state.momo.deadline - state.momo.phaseStartedAt;
      const start = Math.max(0, state.momo.phaseStartedAt - offset);
      state = { momo: { ...state.momo, phaseStartedAt: start, deadline: start + duration } };
    }
    return advanceTime(state, { now: () => now }, random);
  } catch {
    return createInitialState(clock, random);
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

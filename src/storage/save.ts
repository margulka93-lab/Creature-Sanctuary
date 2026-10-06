import { addM2State, advanceTime, createInitialState, isGameState, isMomoState, type GameState } from '../core/state/GameState';
import type { Clock } from '../core/time/Clock';
import type { RandomSource } from '../core/random/RandomSource';
import type { SaveAdapter } from './SaveAdapter';

export interface SaveEnvelope {
  schemaVersion: 3;
  savedAt: number;
  state: GameState;
}

export function serializeSave(state: GameState, clock: Clock): string {
  const envelope: SaveEnvelope = { schemaVersion: 3, savedAt: clock.now(), state };
  return JSON.stringify(envelope);
}

export function readSave(adapter: SaveAdapter, clock: Clock, random: RandomSource): SaveEnvelope {
  const fresh = (): SaveEnvelope => ({ schemaVersion: 3, savedAt: clock.now(), state: createInitialState(clock, random) });
  try {
    const raw = adapter.read();
    if (raw === null) return fresh();
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('schemaVersion' in value) || (value.schemaVersion !== 2 && value.schemaVersion !== 3) ||
        !('savedAt' in value) || typeof value.savedAt !== 'number' || !Number.isSafeInteger(value.savedAt) || value.savedAt < 0 ||
        !('state' in value) || !isMomoState(value.state) || value.savedAt < value.state.momo.phaseStartedAt) return fresh();
    const state = value.schemaVersion === 2 ? addM2State({ momo: value.state.momo }) : value.state;
    if (!isGameState(state)) return fresh();
    return { schemaVersion: 3, savedAt: value.savedAt, state };
  } catch {
    return fresh();
  }
}

export function resumeMomo(save: SaveEnvelope, clock: Clock, random: RandomSource): GameState {
  let state = save.state;
  const now = clock.now();
  if (now < save.savedAt) {
    const offset = save.savedAt - now;
    const duration = state.momo.deadline - state.momo.phaseStartedAt;
    const start = Math.max(0, state.momo.phaseStartedAt - offset);
    state = { ...state, momo: { ...state.momo, phaseStartedAt: start, deadline: start + duration } };
  }
  return advanceTime(state, { now: () => now }, random);
}

/** Read/migrate/resume only; offline rewards are exclusively orchestrated by startGame. */
export function loadGame(adapter: SaveAdapter, clock: Clock, random: RandomSource): GameState {
  return resumeMomo(readSave(adapter, clock, random), clock, random);
}

export function saveGame(adapter: SaveAdapter, state: GameState, clock: Clock): boolean {
  try {
    adapter.write(serializeSave(state, clock));
    return true;
  } catch {
    return false;
  }
}

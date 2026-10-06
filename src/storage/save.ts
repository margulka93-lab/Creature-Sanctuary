import { addM2State, addM3State, advanceTime, createInitialState, isGameState, isM2State, isMomoState, type GameState } from '../core/state/GameState';
import { rebaseBehavior } from '../core/state/behavior';
import { offlineEvents } from '../core/offline/ReturnReport';
import type { Clock } from '../core/time/Clock';
import type { RandomSource } from '../core/random/RandomSource';
import type { SaveAdapter } from './SaveAdapter';

export interface SaveEnvelope {
  schemaVersion: 4;
  savedAt: number;
  state: GameState;
}

export function serializeSave(state: GameState, clock: Clock): string {
  const envelope: SaveEnvelope = { schemaVersion: 4, savedAt: clock.now(), state };
  return JSON.stringify(envelope);
}

export function readSave(adapter: SaveAdapter, clock: Clock, random: RandomSource): SaveEnvelope {
  const fresh = (): SaveEnvelope => ({ schemaVersion: 4, savedAt: clock.now(), state: createInitialState(clock, random) });
  try {
    const raw = adapter.read();
    if (raw === null) return fresh();
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('schemaVersion' in value) || ![2, 3, 4].includes(value.schemaVersion as number) ||
        !('savedAt' in value) || typeof value.savedAt !== 'number' || !Number.isSafeInteger(value.savedAt) || value.savedAt < 0 ||
        !('state' in value) || !isMomoState(value.state) || value.savedAt < value.state.momo.phaseStartedAt) return fresh();
    let state: unknown = value.state;
    if (value.schemaVersion === 2) state = addM3State(addM2State({ momo: value.state.momo }));
    if (value.schemaVersion === 3) {
      if (!isM2State(state) || (state.latestReport && (state.latestReport.discoveryId ||
        state.latestReport.eventIds.some((id) => offlineEvents.find((event) => event.id === id)?.kind === 'shared')))) return fresh();
      state = addM3State({ momo: state.momo, resources: state.resources, bowl: state.bowl, latestReport: state.latestReport });
    }
    if (!isGameState(state)) return fresh();
    if (state.nibi && value.savedAt < state.nibi.phaseStartedAt) return fresh();
    return { schemaVersion: 4, savedAt: value.savedAt, state };
  } catch {
    return fresh();
  }
}

export function resumeCreatures(save: SaveEnvelope, clock: Clock, random: RandomSource): GameState {
  let state = save.state;
  const now = clock.now();
  if (now < save.savedAt) {
    const offset = save.savedAt - now;
    state = { ...state, momo: rebaseBehavior(state.momo, offset),
      nibi: state.nibi ? rebaseBehavior(state.nibi, offset) : null };
  }
  return advanceTime(state, { now: () => now }, random);
}

/** Read/migrate/resume only; offline rewards are exclusively orchestrated by startGame. */
export function loadGame(adapter: SaveAdapter, clock: Clock, random: RandomSource): GameState {
  return resumeCreatures(readSave(adapter, clock, random), clock, random);
}

export function saveGame(adapter: SaveAdapter, state: GameState, clock: Clock): boolean {
  try {
    adapter.write(serializeSave(state, clock));
    return true;
  } catch {
    return false;
  }
}

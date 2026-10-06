import type { Clock } from '../core/time/Clock';
import type { RandomSource } from '../core/random/RandomSource';
import { reconcileOffline } from '../core/offline/reconcile';
import type { SaveAdapter } from '../storage/SaveAdapter';
import { readSave, resumeCreatures, saveGame } from '../storage/save';

/** Called once in main.tsx, before React/StrictMode mounts. Never from a component or hook. */
export function startGame(adapter: SaveAdapter, clock: Clock, random: RandomSource) {
  const now = clock.now();
  const startupClock = { now: () => now };
  const save = readSave(adapter, startupClock, random);
  const resumed = resumeCreatures(save, startupClock, random);
  const { state } = reconcileOffline(resumed, save.savedAt, startupClock, random);
  const saveAvailable = saveGame(adapter, state, startupClock);
  return { state, saveAvailable };
}

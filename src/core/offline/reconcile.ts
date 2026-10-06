import type { GameState } from '../state/GameState';
import type { Clock } from '../time/Clock';
import type { RandomSource } from '../random/RandomSource';
import { offlineConfig, offlineEvents, type OfflineEvent, type ReturnReport } from './ReturnReport';

function choose(candidates: readonly OfflineEvent[], previous: readonly string[], random: RandomSource): OfflineEvent | undefined {
  const alternatives = candidates.filter((event) => !previous.includes(event.id));
  const pool = alternatives.length ? alternatives : candidates;
  if (!pool.length) return undefined;
  let roll = random.next() * pool.reduce((sum, event) => sum + event.weight, 0);
  for (const event of pool) {
    roll -= event.weight;
    if (roll < 0) return event;
  }
  return pool[pool.length - 1];
}

/** M2 only: bounded event slots, no simulation of creature activities. Caller persists the new baseline. */
export function reconcileOffline(state: GameState, savedAt: number, clock: Clock, random: RandomSource,
  config = offlineConfig, events: readonly OfflineEvent[] = offlineEvents): { state: GameState; report: ReturnReport | null } {
  const now = clock.now();
  const elapsed = Math.max(0, now - savedAt);
  if (elapsed < config.thresholdMs) return { state, report: null };
  const commonGain = Math.min(config.commonBerryCap, Math.floor(elapsed / config.berryIntervalMs));
  const slots = elapsed < config.twoEventThresholdMs ? 1 : 2;
  const previous = state.latestReport?.eventIds ?? [];
  const eligible = events.filter((event) => event.minElapsedMs <= elapsed && event.weight > 0);
  const selected: OfflineEvent[] = [];
  if (state.bowl === 'berry') {
    const bowlEvent = choose(eligible.filter((event) => event.requiresBowlFilled), previous, random);
    if (bowlEvent) selected.push(bowlEvent);
  }
  for (let slot = selected.length; slot < slots; slot++) {
    const event = choose(eligible.filter((event) => !event.requiresBowlFilled && !selected.some((chosen) => chosen.id === event.id)), previous, random);
    if (!event) break;
    selected.push(event);
  }
  const berriesGained = commonGain + selected.reduce((sum, event) => sum + (event.effects?.berriesDelta ?? 0), 0);
  const report: ReturnReport = { generatedAt: now, elapsedMs: elapsed, berriesGained,
    eventIds: selected.map((event) => event.id), acknowledged: false };
  return { state: { ...state, resources: { berries: state.resources.berries + berriesGained },
    bowl: selected.some((event) => event.effects?.consumeBowl) ? 'empty' : state.bowl, latestReport: report }, report };
}

import { createInitialNibi, type GameState } from '../state/GameState';
import { applyRelationshipDelta } from '../state/relationship';
import type { Clock } from '../time/Clock';
import type { RandomSource } from '../random/RandomSource';
import { offlineConfig, offlineEvents, type DiscoveryId, type OfflineEvent, type ReturnReport } from './ReturnReport';

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

/** Bounded M2/M3 return, no activity simulation. Caller persists the new baseline. */
export function reconcileOffline(state: GameState, savedAt: number, clock: Clock, random: RandomSource,
  config = offlineConfig, events: readonly OfflineEvent[] = offlineEvents): { state: GameState; report: ReturnReport | null } {
  const now = clock.now();
  const elapsed = Math.max(0, now - savedAt);
  if (elapsed < config.thresholdMs) return { state, report: null };
  const commonGain = Math.min(config.commonBerryCap, Math.floor(elapsed / config.berryIntervalMs));
  const slots = elapsed < config.twoEventThresholdMs ? 1 : 2;
  let discoveryId: DiscoveryId | undefined;
  let discovered = state;
  if (state.nibiPhase === 'unseen') {
    discoveryId = 'nibi_tracks';
    discovered = { ...state, nibiPhase: 'traces' };
  } else if (state.nibiPhase === 'traces' && state.bowl === 'berry') {
    discoveryId = 'nibi_arrival';
    discovered = { ...state, nibiPhase: 'resident', bowl: 'empty',
      nibi: createInitialNibi({ now: () => now }, random), relations: { momoNibi: 0 } };
  }
  const previous = state.latestReport?.eventIds ?? [];
  const eligible = events.filter((event) => event.minElapsedMs <= elapsed && event.weight > 0);
  const selected: OfflineEvent[] = [];
  const isBowl = (event: OfflineEvent) => event.kind === 'bowl' || event.requiresBowlFilled;
  if (discoveryId !== 'nibi_arrival' && state.bowl === 'berry') {
    const bowlEvent = choose(eligible.filter(isBowl), previous, random);
    if (bowlEvent) selected.push(bowlEvent);
  }
  if (discoveryId !== 'nibi_arrival' && state.nibiPhase === 'resident' && selected.length < slots) {
    const shared = choose(eligible.filter((event) => event.kind === 'shared' &&
      state.relations.momoNibi >= (event.minRelation ?? 0) && state.relations.momoNibi <= (event.maxRelation ?? 5)), previous, random);
    if (shared) selected.push(shared);
  }
  for (let slot = selected.length; discoveryId !== 'nibi_arrival' && slot < slots; slot++) {
    const event = choose(eligible.filter((event) => !isBowl(event) && event.kind !== 'shared' && !selected.some((chosen) => chosen.id === event.id)), previous, random);
    if (!event) break;
    selected.push(event);
  }
  const berriesGained = commonGain + selected.reduce((sum, event) => sum + (event.effects?.berriesDelta ?? 0), 0);
  const report: ReturnReport = { generatedAt: now, elapsedMs: elapsed, berriesGained,
    eventIds: selected.map((event) => event.id), ...(discoveryId ? { discoveryId } : {}), acknowledged: false };
  const delta = selected.reduce((sum, event) => sum + (event.relationshipDelta ?? 0), 0);
  return { state: { ...discovered, resources: { berries: state.resources.berries + berriesGained },
    relations: { momoNibi: applyRelationshipDelta(discovered.relations.momoNibi, delta) },
    bowl: selected.some((event) => event.effects?.consumeBowl) ? 'empty' : discovered.bowl, latestReport: report }, report };
}

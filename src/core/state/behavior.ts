import type { RandomSource } from '../random/RandomSource';

export type AnchorId = 'tree' | 'stream' | 'tall_grass';
export interface ActivityDefinition<Id extends string> {
  id: Id;
  label: string;
  anchor: AnchorId;
  weight: number;
  minDurationMs: number;
  maxDurationMs: number;
  symbol: string;
}
interface PhaseState<Id extends string> {
  currentAnchor: AnchorId;
  currentActivityId: Id;
  phaseStartedAt: number;
  deadline: number;
}
export type BehaviorState<Id extends string> = (PhaseState<Id> & { phase: 'settled' }) |
  (PhaseState<Id> & { phase: 'moving'; targetActivityId: Id; activityDurationMs: number });

export function selectActivity<Id extends string>(previous: Id, random: RandomSource,
  activities: readonly ActivityDefinition<Id>[]): ActivityDefinition<Id> {
  const alternatives = activities.filter((entry) => entry.id !== previous && entry.weight > 0);
  const candidates = alternatives.length ? alternatives : activities.filter((entry) => entry.weight > 0);
  let roll = random.next() * candidates.reduce((sum, entry) => sum + entry.weight, 0);
  for (const entry of candidates) {
    roll -= entry.weight;
    if (roll < 0) return entry;
  }
  return candidates[candidates.length - 1];
}

export function selectDuration(activity: ActivityDefinition<string>, random: RandomSource): number {
  return activity.minDurationMs + Math.floor(random.next() * (activity.maxDurationMs - activity.minDurationMs + 1));
}

export function settled<Id extends string>(activity: ActivityDefinition<Id>, duration: number, now: number): BehaviorState<Id> {
  return { phase: 'settled', currentAnchor: activity.anchor, currentActivityId: activity.id,
    phaseStartedAt: now, deadline: now + duration };
}

/** At most one phase per creature; no catch-up simulation. */
export function advanceBehavior<Id extends string>(current: BehaviorState<Id>, now: number, random: RandomSource,
  activities: readonly ActivityDefinition<Id>[], moveDurationMs: number): BehaviorState<Id> {
  if (now < current.phaseStartedAt) return { ...current, phaseStartedAt: now,
    deadline: now + current.deadline - current.phaseStartedAt };
  if (now < current.deadline) return current;
  const byId = (id: Id) => activities.find((entry) => entry.id === id)!;
  if (current.phase === 'moving') return settled(byId(current.targetActivityId), current.activityDurationMs, now);
  const next = selectActivity(current.currentActivityId, random, activities);
  const duration = selectDuration(next, random);
  if (next.anchor === current.currentAnchor) return settled(next, duration, now);
  return { ...current, phase: 'moving', targetActivityId: next.id, activityDurationMs: duration,
    phaseStartedAt: now, deadline: now + moveDurationMs };
}

const isTimestamp = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
export function isBehavior<Id extends string>(value: unknown, activities: readonly ActivityDefinition<Id>[],
  moveDurationMs: number): value is BehaviorState<Id> {
  if (!value || typeof value !== 'object') return false;
  const current = value as Record<string, unknown>;
  const activity = activities.find((entry) => entry.id === current.currentActivityId);
  if (!activity || current.currentAnchor !== activity.anchor || !isTimestamp(current.phaseStartedAt) ||
    !isTimestamp(current.deadline) || current.deadline <= current.phaseStartedAt) return false;
  const duration = current.deadline - current.phaseStartedAt;
  if (current.phase === 'settled') return duration >= activity.minDurationMs && duration <= activity.maxDurationMs;
  const target = activities.find((entry) => entry.id === current.targetActivityId);
  return current.phase === 'moving' && !!target && target.id !== activity.id && target.anchor !== activity.anchor &&
    duration === moveDurationMs && isTimestamp(current.activityDurationMs) &&
    current.activityDurationMs >= target.minDurationMs && current.activityDurationMs <= target.maxDurationMs;
}

export function rebaseBehavior<Id extends string>(current: BehaviorState<Id>, offset: number): BehaviorState<Id> {
  const start = Math.max(0, current.phaseStartedAt - offset);
  return { ...current, phaseStartedAt: start, deadline: start + current.deadline - current.phaseStartedAt };
}

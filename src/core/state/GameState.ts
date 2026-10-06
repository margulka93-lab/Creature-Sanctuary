import radura from '../../content/radura.json';
import momo from '../../content/momo.json';
import type { Clock } from '../time/Clock';
import type { RandomSource } from '../random/RandomSource';

export type AnchorId = 'tree' | 'stream' | 'tall_grass';
export type ActivityId = 'doze_tree' | 'watch_stream' | 'explore_grass';
export interface ActivityDefinition {
  id: ActivityId;
  label: string;
  anchor: AnchorId;
  weight: number;
  minDurationMs: number;
  maxDurationMs: number;
  symbol: string;
}
export const activities = momo.activities as ActivityDefinition[];
export const activityById = (id: ActivityId) => activities.find((entry) => entry.id === id)!;

interface PhaseState {
  currentAnchor: AnchorId;
  currentActivityId: ActivityId;
  phaseStartedAt: number;
  deadline: number;
}
export interface GameState {
  momo: (PhaseState & { phase: 'settled' }) | (PhaseState & {
    phase: 'moving';
    targetActivityId: ActivityId;
    activityDurationMs: number;
  });
}

export function selectActivity(previous: ActivityId, random: RandomSource): ActivityDefinition {
  const alternatives = activities.filter((entry) => entry.id !== previous && entry.weight > 0);
  const candidates = alternatives.length ? alternatives : activities.filter((entry) => entry.weight > 0);
  let roll = random.next() * candidates.reduce((sum, entry) => sum + entry.weight, 0);
  for (const entry of candidates) {
    roll -= entry.weight;
    if (roll < 0) return entry;
  }
  return candidates[candidates.length - 1];
}

export function selectDuration(activity: ActivityDefinition, random: RandomSource): number {
  return activity.minDurationMs + Math.floor(random.next() * (activity.maxDurationMs - activity.minDurationMs + 1));
}

function settled(activity: ActivityDefinition, duration: number, now: number): GameState {
  return { momo: { phase: 'settled', currentAnchor: activity.anchor, currentActivityId: activity.id,
    phaseStartedAt: now, deadline: now + duration } };
}

export function createInitialState(clock: Clock, random: RandomSource): GameState {
  const activity = activityById('doze_tree');
  return settled(activity, selectDuration(activity, random), clock.now());
}

/** Resolve at most one phase and start the next from now, including after a long pause. */
export function advanceTime(state: GameState, clock: Clock, random: RandomSource): GameState {
  const now = clock.now();
  const current = state.momo;
  if (now < current.phaseStartedAt) {
    return { momo: { ...current, phaseStartedAt: now, deadline: now + (current.deadline - current.phaseStartedAt) } };
  }
  if (now < current.deadline) return state;
  if (current.phase === 'moving') {
    return settled(activityById(current.targetActivityId), current.activityDurationMs, now);
  }
  const next = selectActivity(current.currentActivityId, random);
  const duration = selectDuration(next, random);
  if (next.anchor === current.currentAnchor) return settled(next, duration, now);
  return { momo: { ...current, phase: 'moving', targetActivityId: next.id, activityDurationMs: duration,
    phaseStartedAt: now, deadline: now + radura.moveDurationMs } };
}

const isTimestamp = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const isActivity = (value: unknown): value is ActivityId => activities.some((entry) => entry.id === value);

export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object' || !('momo' in value)) return false;
  const current = value.momo;
  if (!current || typeof current !== 'object' || !('currentActivityId' in current) ||
      !isActivity(current.currentActivityId) || !('currentAnchor' in current) ||
      current.currentAnchor !== activityById(current.currentActivityId).anchor ||
      !('phaseStartedAt' in current) || !isTimestamp(current.phaseStartedAt) ||
      !('deadline' in current) || !isTimestamp(current.deadline) || current.deadline <= current.phaseStartedAt ||
      !('phase' in current)) return false;
  if (current.phase === 'settled') {
    const activity = activityById(current.currentActivityId);
    const duration = current.deadline - current.phaseStartedAt;
    return duration >= activity.minDurationMs && duration <= activity.maxDurationMs;
  }
  if (current.phase !== 'moving' || !('targetActivityId' in current) || !isActivity(current.targetActivityId) ||
      current.targetActivityId === current.currentActivityId ||
      current.deadline - current.phaseStartedAt !== radura.moveDurationMs ||
      !('activityDurationMs' in current) || !isTimestamp(current.activityDurationMs)) return false;
  const target = activityById(current.targetActivityId);
  return target.anchor !== current.currentAnchor && current.activityDurationMs >= target.minDurationMs &&
    current.activityDurationMs <= target.maxDurationMs;
}

import radura from '../../content/radura.json';
import momo from '../../content/momo.json';
import nibi from '../../content/nibi.json';
import type { Clock } from '../time/Clock';
import type { RandomSource } from '../random/RandomSource';
import { isReturnReport, offlineEvents, type ReturnReport } from '../offline/ReturnReport';
import { advanceBehavior, isBehavior, settled, selectActivity as chooseActivity, selectDuration,
  type ActivityDefinition as Definition, type BehaviorState } from './behavior';
export type { AnchorId } from './behavior';
export { selectDuration } from './behavior';

export type ActivityId = 'doze_tree' | 'watch_stream' | 'explore_grass';
export type NibiActivityId = 'rustle_grass' | 'splash_stream' | 'visit_tree';
export type ActivityDefinition = Definition<ActivityId>;
export const activities = momo.activities as ActivityDefinition[];
export const nibiActivities = nibi.activities as Definition<NibiActivityId>[];
export const nibiMoveDurationMs = nibi.moveDurationMs;
export const activityById = (id: ActivityId) => activities.find((entry) => entry.id === id)!;
export const nibiActivityById = (id: NibiActivityId) => nibiActivities.find((entry) => entry.id === id)!;
export const selectActivity = (previous: ActivityId, random: RandomSource) => chooseActivity(previous, random, activities);
export const selectNibiActivity = (previous: NibiActivityId, random: RandomSource) => chooseActivity(previous, random, nibiActivities);
export interface MomoState { momo: BehaviorState<ActivityId> }
export interface M2State extends MomoState {
  resources: { berries: number };
  bowl: 'empty' | 'berry';
  latestReport: ReturnReport | null;
}
export interface GameState extends M2State {
  nibiPhase: 'unseen' | 'traces' | 'resident';
  nibi: BehaviorState<NibiActivityId> | null;
  relations: { momoNibi: number };
}
export function addM3State(state: M2State): GameState {
  return { ...state, nibiPhase: 'unseen', nibi: null, relations: { momoNibi: 0 } };
}
export function addM2State(state: MomoState): M2State {
  return { ...state, resources: { berries: 1 }, bowl: 'empty', latestReport: null };
}
export function createInitialNibi(clock: Clock, random: RandomSource): BehaviorState<NibiActivityId> {
  const activity = nibiActivityById('visit_tree');
  return settled(activity, selectDuration(activity, random), clock.now());
}
export function createInitialState(clock: Clock, random: RandomSource): GameState {
  const activity = activityById('doze_tree');
  return addM3State(addM2State({ momo: settled(activity, selectDuration(activity, random), clock.now()) }));
}
/** Each resident independently resolves at most one phase from the present. */
export function advanceTime(state: GameState, clock: Clock, random: RandomSource): GameState {
  const now = clock.now();
  const momo = advanceBehavior(state.momo, now, random, activities, radura.moveDurationMs);
  const nibi = state.nibiPhase === 'resident' && state.nibi
    ? advanceBehavior(state.nibi, now, random, nibiActivities, nibiMoveDurationMs) : state.nibi;
  return momo === state.momo && nibi === state.nibi ? state : { ...state, momo, nibi };
}
export function isMomoState(value: unknown): value is MomoState {
  return !!value && typeof value === 'object' && 'momo' in value && isBehavior(value.momo, activities, radura.moveDurationMs);
}
export function isM2State(value: unknown): value is M2State {
  if (!isMomoState(value) || !('resources' in value) || !value.resources || typeof value.resources !== 'object' ||
      !('berries' in value.resources) || typeof value.resources.berries !== 'number' ||
      !Number.isSafeInteger(value.resources.berries) || value.resources.berries < 0 ||
      !('bowl' in value) || (value.bowl !== 'empty' && value.bowl !== 'berry') || !('latestReport' in value)) return false;
  return value.latestReport === null || isReturnReport(value.latestReport);
}
export function isGameState(value: unknown): value is GameState {
  if (!isM2State(value) || !('nibiPhase' in value) || !('nibi' in value) || !('relations' in value) ||
    !value.relations || typeof value.relations !== 'object' || !('momoNibi' in value.relations) ||
    typeof value.relations.momoNibi !== 'number' || !Number.isInteger(value.relations.momoNibi) ||
    value.relations.momoNibi < 0 || value.relations.momoNibi > 5) return false;
  const report = value.latestReport;
  if (report?.discoveryId === 'nibi_tracks' && value.nibiPhase !== 'traces') return false;
  if (report?.discoveryId === 'nibi_arrival' && value.nibiPhase !== 'resident') return false;
  if (value.nibiPhase !== 'resident' && report?.eventIds.some((id) =>
    offlineEvents.find((event) => event.id === id)?.kind === 'shared')) return false;
  if (value.nibiPhase === 'resident') return isBehavior(value.nibi, nibiActivities, nibiMoveDurationMs);
  return (value.nibiPhase === 'unseen' || value.nibiPhase === 'traces') && value.nibi === null && value.relations.momoNibi === 0;
}

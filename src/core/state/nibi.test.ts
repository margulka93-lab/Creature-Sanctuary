import { describe, expect, it } from 'vitest';
import { advanceTime, createInitialNibi, createInitialState, isGameState, nibiActivities, selectDuration,
  selectNibiActivity, type GameState } from './GameState';
import { applyRelationshipDelta, relationshipLabel } from './relationship';
const clock = { now: () => 1000 };
const random = { next: () => 0 };
const noRandom = { next: (): number => { throw new Error('Unexpected RNG'); } };
const initial = createInitialState(clock, random);
const resident: GameState = { ...initial, nibiPhase: 'resident', nibi: createInitialNibi(clock, random) };

describe('Nibi independent pure scheduler', () => {
  it.each(['unseen', 'traces'] as const)('has no timer or RNG before resident (%s)', (nibiPhase) => {
    const state = { ...initial, nibiPhase };
    expect(advanceTime(state, { now: () => 3999 }, noRandom)).toBe(state);
    expect(state.nibi).toBeNull();
    let draws = 0;
    const advanced = advanceTime(state, { now: () => 9000 }, { next: () => { draws++; return 0; } });
    expect(draws).toBe(2); // Only Momo.
    expect(advanced.nibi).toBeNull();
  });
  it('initializes at visit_tree with authored minimum duration', () => {
    expect(resident.nibi).toEqual({ phase: 'settled', currentAnchor: 'tree', currentActivityId: 'visit_tree',
      phaseStartedAt: 1000, deadline: 4000 });
  });
  it('selects controlled weighted destinations and moves for exactly two seconds', () => {
    expect(selectNibiActivity('visit_tree', { next: () => 4 / 7 - 0.00001 }).id).toBe('rustle_grass');
    expect(selectNibiActivity('visit_tree', { next: () => 4 / 7 }).id).toBe('splash_stream');
    const moved = advanceTime(resident, { now: () => 4000 }, { next: () => 0.9 });
    expect(moved.momo).toBe(resident.momo);
    expect(moved.nibi).toMatchObject({ phase: 'moving', targetActivityId: 'splash_stream', deadline: 6000 });
    expect(isGameState(moved)).toBe(true);
    expect(advanceTime(moved, { now: () => 5999 }, noRandom)).toBe(moved);
    const arrived = advanceTime(moved, { now: () => 6000 }, noRandom);
    expect(arrived.nibi).toMatchObject({ phase: 'settled', currentActivityId: 'splash_stream', currentAnchor: 'stream' });
    expect(isGameState(arrived)).toBe(true);
  });
  it.each(nibiActivities)('bounds duration and avoids repetition of $id', (activity) => {
    expect(selectDuration(activity, random)).toBe(activity.minDurationMs);
    expect(selectDuration(activity, { next: () => 0.999999 })).toBe(activity.maxDurationMs);
    for (const roll of [0, 0.2, 0.5, 0.8, 0.999999]) {
      expect(selectNibiActivity(activity.id, { next: () => roll }).id).not.toBe(activity.id);
    }
  });
  it('advances Momo while Nibi remains pending; large absence advances each at most once', () => {
    const state = { ...resident, nibi: createInitialNibi({ now: () => 8500 }, random) };
    const next = advanceTime(state, { now: () => 9000 }, random);
    expect(next.momo.phase).toBe('moving');
    expect(next.nibi).toBe(state.nibi);
    let draws = 0;
    const late = advanceTime(resident, { now: () => 999999 }, { next: () => { draws++; return 0; } });
    expect(draws).toBe(4);
    expect(late.momo.deadline).toBe(1002999);
    expect(late.nibi?.deadline).toBe(1001999);
    expect(advanceTime(late, { now: () => 999999 }, noRandom)).toBe(late);
  });
  it('rebases both on a backward clock without draws', () => {
    const state = advanceTime(resident, { now: () => 0 }, noRandom);
    expect(state.nibi?.deadline).toBe(3000);
    expect(state.momo.deadline).toBe(8000);
    expect(isGameState(state)).toBe(true);
  });
  it('preserves exact Nibi authored parameters', () => {
    expect(nibiActivities.map(({ id, anchor, weight, minDurationMs, maxDurationMs }) =>
      [id, anchor, weight, minDurationMs, maxDurationMs])).toEqual([
      ['rustle_grass', 'tall_grass', 4, 3000, 6000], ['splash_stream', 'stream', 3, 4000, 7000],
      ['visit_tree', 'tree', 3, 3000, 5000],
    ]);
  });
});
describe('single shared relationship', () => {
  it.each([[0, -1, 0], [5, 1, 5], [2, -1, 1], [2, 1, 3]])('clamps %s + %s to %s', (value, delta, expected) => {
    expect(applyRelationshipDelta(value, delta)).toBe(expected);
  });
  it.each([[0, 'Si stanno studiando'], [1, 'Si stanno abituando'], [2, 'Si stanno abituando'],
    [3, 'Si cercano'], [4, 'Si cercano'], [5, 'Amici']])('maps %s to %s', (value, label) => {
    expect(relationshipLabel(value as number)).toBe(label);
  });
});

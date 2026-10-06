import { describe, expect, it } from 'vitest';
import { activities, activityById, advanceTime, createInitialState, isGameState, selectActivity, selectDuration } from './GameState';
import type { RandomSource } from '../random/RandomSource';

function sequence(...values: number[]): RandomSource {
  return { next: () => {
    const next = values.shift();
    if (next === undefined) throw new Error('Unexpected RNG consumption');
    return next;
  } };
}
const clock = { now: () => 1000 };
const noRandom = sequence();

describe('autonomous Momo (pure Node core)', () => {
  it('starts dozing under the tree with a deterministic duration', () => {
    expect(createInitialState(clock, sequence(0)).momo).toEqual({
      phase: 'settled', currentAnchor: 'tree', currentActivityId: 'doze_tree', phaseStartedAt: 1000, deadline: 9000,
    });
  });

  it('does not change or consume randomness before deadline', () => {
    const initial = createInitialState(clock, sequence(0));
    expect(advanceTime(initial, { now: () => 8999 }, noRandom)).toBe(initial);
  });

  it('selects the expected destination at deadline and completes movement into the chosen activity', () => {
    const initial = createInitialState(clock, sequence(0));
    const moving = advanceTime(initial, { now: () => 9000 }, sequence(0.7, 0.5));
    expect(moving.momo).toEqual({
      currentAnchor: 'tree', currentActivityId: 'doze_tree', phase: 'moving',
      phaseStartedAt: 9000, deadline: 12000, targetActivityId: 'explore_grass', activityDurationMs: 5500,
    });
    expect(initial.momo.phase).toBe('settled');
    expect(advanceTime(moving, { now: () => 11999 }, noRandom)).toBe(moving);
    const arrived = advanceTime(moving, { now: () => 12000 }, noRandom);
    expect(arrived.momo).toEqual({ phase: 'settled', currentAnchor: 'tall_grass', currentActivityId: 'explore_grass',
      phaseStartedAt: 12000, deadline: 17500 });
    expect(isGameState(moving)).toBe(true);
    expect(isGameState(arrived)).toBe(true);
  });

  it.each(activities)('never immediately repeats $id', (activity) => {
    for (const roll of [0, 0.2, 0.5, 0.8, 0.999999]) {
      expect(selectActivity(activity.id, sequence(roll)).id).not.toBe(activity.id);
    }
  });

  it('respects the exact weighted boundaries after excluding the previous activity', () => {
    // After dozing: stream 3 / grass 2.
    expect(selectActivity('doze_tree', sequence(0.599999)).id).toBe('watch_stream');
    expect(selectActivity('doze_tree', sequence(0.6)).id).toBe('explore_grass');
    // After stream: tree 5 / grass 2.
    expect(selectActivity('watch_stream', sequence(5 / 7 - 0.000001)).id).toBe('doze_tree');
    expect(selectActivity('watch_stream', sequence(5 / 7)).id).toBe('explore_grass');
    // After grass: tree 5 / stream 3.
    expect(selectActivity('explore_grass', sequence(0.624999)).id).toBe('doze_tree');
    expect(selectActivity('explore_grass', sequence(0.625)).id).toBe('watch_stream');
  });

  it.each(activities)('selects deterministic durations within inclusive limits for $id', (activity) => {
    expect(selectDuration(activity, sequence(0))).toBe(activity.minDurationMs);
    expect(selectDuration(activity, sequence(0.999999))).toBe(activity.maxDurationMs);
    expect(selectDuration(activity, sequence(0.5))).toBe(activity.minDurationMs + Math.floor((activity.maxDurationMs - activity.minDurationMs + 1) / 2));
  });

  it('resolves only one phase after a large clock jump and rebases the next deadline on now', () => {
    const initial = createInitialState(clock, sequence(0));
    const late = advanceTime(initial, { now: () => 1_000_000 }, sequence(0, 0));
    expect(late.momo.phase).toBe('moving');
    expect(late.momo.deadline).toBe(1_003_000);
    expect(advanceTime(late, { now: () => 1_000_000 }, noRandom)).toBe(late);
    const arrived = advanceTime(late, { now: () => 2_000_000 }, noRandom);
    expect(arrived.momo.currentActivityId).toBe('watch_stream');
    expect(arrived.momo.deadline).toBe(2_005_000);
  });

  it('handles backward clock jumps without negative deadlines or loops', () => {
    const initial = createInitialState(clock, sequence(0));
    const rebased = advanceTime(initial, { now: () => 0 }, noRandom);
    expect(rebased.momo.phaseStartedAt).toBe(0);
    expect(rebased.momo.deadline).toBe(8000);
    expect(isGameState(rebased)).toBe(true);
    expect(advanceTime(rebased, { now: () => 0 }, noRandom)).toBe(rebased);
  });

  it('retains the authored prototype pacing', () => {
    expect(activities.map(({ id, anchor, weight, minDurationMs, maxDurationMs }) =>
      [id, anchor, weight, minDurationMs, maxDurationMs])).toEqual([
      ['doze_tree', 'tree', 5, 8000, 14000], ['watch_stream', 'stream', 3, 5000, 9000],
      ['explore_grass', 'tall_grass', 2, 4000, 7000],
    ]);
    expect(activityById('doze_tree').anchor).toBe('tree');
  });
});

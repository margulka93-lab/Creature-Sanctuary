import { describe, expect, it } from 'vitest';
import { createInitialState, advanceTime } from '../state/GameState';
import { acknowledgeReport, canLeaveBerry, leaveBerry } from '../state/actions';
import { offlineConfig, offlineEvents } from './ReturnReport';
import { reconcileOffline } from './reconcile';

const minute = 60000;
const savedAt = 1000;
const random = { next: () => 0 };
const state = createInitialState({ now: () => savedAt }, random);
const clockAfter = (elapsed: number) => ({ now: () => savedAt + elapsed });
const reconcile = (elapsed: number) => reconcileOffline(state, savedAt, clockAfter(elapsed), random);

describe('M2 bounded return reconciliation', () => {
  it('fresh state has exactly one berry, empty bowl and no report', () => {
    expect(state.resources.berries).toBe(1);
    expect(state.bowl).toBe('empty');
    expect(state.latestReport).toBeNull();
  });

  it.each([0, 1, 5 * minute - 1])('below threshold leaves berries, filled bowl and latest report untouched (%s ms)', (elapsed) => {
    const filled = leaveBerry(state);
    const noRandom = { next: (): number => { throw new Error('No RNG expected'); } };
    const result = reconcileOffline(filled, savedAt, clockAfter(elapsed), noRandom);
    expect(result.state).toBe(filled);
    expect(result.report).toBeNull();
    expect(result.state.bowl).toBe('berry');
    expect(result.state.resources.berries).toBe(0);
  });

  it.each([
    [5 * minute, 0, 1], [15 * minute - 1, 0, 1], [15 * minute, 1, 1],
    [30 * minute - 1, 1, 1], [30 * minute, 2, 2], [120 * minute, 8, 2],
    [1440 * minute, 8, 2], [365 * 1440 * minute, 8, 2],
  ])('applies exact common gain and bounded slots at elapsed %s', (elapsed, gain, count) => {
    const result = reconcile(elapsed);
    expect(result.report?.berriesGained).toBe(gain);
    expect(result.state.resources.berries).toBe(1 + gain);
    expect(result.report?.eventIds).toHaveLength(count);
    expect(new Set(result.report?.eventIds).size).toBe(count);
    expect(result.report?.acknowledged).toBe(false);
    expect(result.state.momo).toBe(state.momo); // Reconciler never simulates Momo.
  });

  it.each([5 * minute, 30 * minute, 1440 * minute])('prioritizes exactly one bowl event and consumes only the already placed berry (%s ms)', (elapsed) => {
    const filled = leaveBerry(state);
    const result = reconcileOffline(filled, savedAt, clockAfter(elapsed), random);
    const events = result.report!.eventIds.map((id) => offlineEvents.find((event) => event.id === id)!);
    expect(events[0].id).toBe('bowl_crumbs');
    expect(events.filter((event) => event.requiresBowlFilled)).toHaveLength(1);
    expect(result.state.bowl).toBe('empty');
    expect(result.state.resources.berries).toBe(Math.min(8, Math.floor(elapsed / (15 * minute))));
    expect(filled.bowl).toBe('berry'); // Pure and immutable.
  });

  it('weighted event selection respects controlled RNG boundaries', () => {
    const pick = (roll: number) => reconcileOffline(state, savedAt, clockAfter(5 * minute), { next: () => roll }).report!.eventIds[0];
    // General weights eligible at 5 min: 4, 3, 3, 2, 2 = 14.
    expect(pick(4 / 14 - 0.00001)).toBe('root_nap');
    expect(pick(4 / 14)).toBe('stream_watch');
    expect(pick(0.999999)).toBe('leaf_hat');
    const filled = leaveBerry(state);
    expect(reconcileOffline(filled, savedAt, clockAfter(5 * minute), { next: () => 0.5 }).report!.eventIds).toEqual(['bowl_shifted']);
  });

  it('minimum elapsed gates bonus events and applies a selected +1 effect only once', () => {
    const pick = (elapsed: number) => reconcileOffline(state, savedAt, clockAfter(elapsed), { next: () => 0.999999 });
    expect(pick(15 * minute - 1).report?.eventIds).toEqual(['leaf_hat']);
    const at15 = pick(15 * minute);
    expect(at15.report?.eventIds).toEqual(['berry_under_root']);
    expect(at15.state.resources.berries).toBe(3); // initial 1 + common 1 + event 1.
    const at30 = pick(30 * minute);
    expect(at30.report?.eventIds).toEqual(['berry_trail', 'berry_under_root']);
    expect(at30.state.resources.berries).toBe(5); // initial 1 + common 2 + two unique bonuses.
    expect(at30.report?.berriesGained).toBe(4);
  });

  it('excludes immediately previous event IDs when eligible alternatives exist', () => {
    const previous = reconcile(30 * minute).state;
    expect(previous.latestReport?.eventIds).toEqual(['root_nap', 'stream_watch']);
    const next = reconcileOffline(previous, savedAt, clockAfter(30 * minute), random);
    expect(next.report?.eventIds).toEqual(['grass_tunnel', 'false_start']);
    const bowlFirst = reconcileOffline(leaveBerry(state), savedAt, clockAfter(5 * minute), random).state;
    const bowlAgain = reconcileOffline(leaveBerry({ ...bowlFirst, resources: { berries: 1 } }), savedAt, clockAfter(5 * minute), random);
    expect(bowlAgain.report?.eventIds).toEqual(['bowl_shifted']);
  });

  it('allows a repeated event only when no eligible alternative remains', () => {
    const prior = reconcile(5 * minute).state;
    const events = offlineEvents.filter((event) => event.id === 'root_nap');
    expect(reconcileOffline(prior, savedAt, clockAfter(5 * minute), random, offlineConfig, events).report?.eventIds).toEqual(['root_nap']);
  });

  it('backward clock produces no negative elapsed, reward or report', () => {
    const filled = leaveBerry(state);
    expect(reconcileOffline(filled, savedAt, { now: () => 0 }, random)).toEqual({ state: filled, report: null });
  });

  it('only valid bowl actions spend exactly one berry', () => {
    expect(canLeaveBerry(state)).toBe(true);
    const filled = leaveBerry(state);
    expect(filled.resources.berries).toBe(0);
    expect(canLeaveBerry(filled)).toBe(false);
    expect(leaveBerry(filled)).toBe(filled);
    const emptyWithZero = { ...filled, bowl: 'empty' as const };
    expect(canLeaveBerry(emptyWithZero)).toBe(false);
    expect(leaveBerry(emptyWithZero)).toBe(emptyWithZero);
  });

  it('acknowledgement changes no rewards and M1 transitions preserve all M2 fields', () => {
    const returned = reconcile(30 * minute).state;
    const acknowledged = acknowledgeReport(returned);
    expect(acknowledged.latestReport?.acknowledged).toBe(true);
    expect(acknowledged.resources).toBe(returned.resources);
    expect(acknowledgeReport(acknowledged)).toBe(acknowledged);
    const advanced = advanceTime(acknowledged, clockAfter(31 * minute), random);
    expect(advanced.resources).toBe(acknowledged.resources);
    expect(advanced.latestReport).toBe(acknowledged.latestReport);
    expect(advanced.bowl).toBe(acknowledged.bowl);
    expect(acknowledgeReport(state)).toBe(state);
  });
});

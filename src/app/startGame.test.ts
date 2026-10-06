import { describe, expect, it } from 'vitest';
import { createElement, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { startGame } from './startGame';
import { createInitialNibi, createInitialState, type GameState } from '../core/state/GameState';
import { acknowledgeReport, leaveBerry } from '../core/state/actions';
import { serializeSave, saveGame } from '../storage/save';
import type { SaveAdapter } from '../storage/SaveAdapter';

const initialClock = { now: () => 1000 };
const random = { next: () => 0 };

function memoryAdapter(raw: string): SaveAdapter {
  return { read: () => raw, write: (value) => { raw = value; } };
}

describe('startup outside React: exactly once and immediate baseline', () => {
  it('persists the reconciled snapshot before returning and immediate startup grants no duplicate', () => {
    const initial = leaveBerry(createInitialState(initialClock, random));
    const adapter = memoryAdapter(serializeSave(initial, initialClock));
    const clock = { now: () => 1801000 };
    const first = startGame(adapter, clock, random);
    expect(first.saveAvailable).toBe(true);
    expect(first.state.resources.berries).toBe(2);
    expect(first.state.latestReport?.eventIds).toEqual(['bowl_crumbs', 'root_nap']);
    const persisted = JSON.parse(adapter.read()!);
    expect(persisted.schemaVersion).toBe(4);
    expect(persisted.savedAt).toBe(clock.now());
    expect(persisted.state).toEqual(first.state);
    const noRandom = { next: (): number => { throw new Error('Unexpected second reconciliation'); } };
    const second = startGame(adapter, clock, noRandom);
    expect(second.state).toEqual(first.state);
  });

  it('React repeated rendering with StrictMode never reads storage, reconciles, chooses events or grants rewards', () => {
    let draws = 0;
    let writes = 0;
    let reads = 0;
    let raw = serializeSave(createInitialState(initialClock, random), initialClock);
    const adapter = { read: () => { reads++; return raw; }, write: (value: string) => { writes++; raw = value; } };
    const clock = { now: () => 901000 };
    const rng = { next: () => { draws++; return 0; } };
    const initial = startGame(adapter, clock, rng);
    const before = { reads, writes, draws };
    const app = createElement(StrictMode, null, createElement(App, { initial, adapter, clock, random: rng }));
    const html = renderToString(app);
    renderToString(app);
    expect({ reads, writes, draws }).toEqual(before);
    expect(initial.state.resources.berries).toBe(2);
    expect(html).toContain('Mentre eri via');
    expect(html).toContain('Momo ha passato buona parte del tempo');
    expect(html).not.toContain('root_nap');
    expect(html).not.toContain('schemaVersion');
  });

  it('closing a report survives immediate reload and the same report remains available', () => {
    const adapter = memoryAdapter(serializeSave(createInitialState(initialClock, random), initialClock));
    const clock = { now: () => 301000 };
    const returned = startGame(adapter, clock, random);
    const closed = acknowledgeReport(returned.state);
    saveGame(adapter, closed, clock);
    const reloaded = startGame(adapter, clock, random);
    expect(reloaded.state.latestReport).toEqual(closed.latestReport);
    expect(reloaded.state.latestReport?.acknowledged).toBe(true);
    expect(reloaded.state.resources).toEqual(closed.resources);
  });

  it('reports unavailable persistence while keeping a usable initial session', () => {
    const adapter = { read: () => { throw new Error('Blocked'); }, write: () => { throw new Error('Blocked'); } };
    expect(startGame(adapter, initialClock, random).saveAvailable).toBe(false);
  });

  it('tracks, arrival and subsequent relationship delta persist once before repeated StrictMode rendering', () => {
    const adapter = memoryAdapter(serializeSave(createInitialState(initialClock, random), initialClock));
    let now = 301000;
    const clock = { now: () => now };
    const noRandom = { next: (): number => { throw new Error('Duplicate reconciliation'); } };
    const tracks = startGame(adapter, clock, random);
    expect(tracks.state.nibiPhase).toBe('traces');
    expect(tracks.state.latestReport?.discoveryId).toBe('nibi_tracks');
    expect(startGame(adapter, clock, noRandom).state).toEqual(tracks.state);
    saveGame(adapter, leaveBerry(acknowledgeReport(tracks.state)), clock);
    now += 300000;
    const arrival = startGame(adapter, clock, random);
    expect(arrival.state.nibiPhase).toBe('resident');
    expect(arrival.state.latestReport?.discoveryId).toBe('nibi_arrival');
    expect(arrival.state.bowl).toBe('empty');
    expect(arrival.state.latestReport?.eventIds).toEqual([]);
    expect(startGame(adapter, clock, noRandom).state).toEqual(arrival.state);
    saveGame(adapter, acknowledgeReport(arrival.state), clock);
    now += 300000;
    const shared = startGame(adapter, clock, random);
    expect(shared.state.latestReport?.eventIds).toEqual(['pair_cautious_circle']);
    expect(shared.state.relations.momoNibi).toBe(1);
    expect(startGame(adapter, clock, noRandom).state).toEqual(shared.state);
    const stored = adapter.read();
    const app = createElement(StrictMode, null, createElement(App, { initial: shared, adapter, clock, random: noRandom }));
    const html = renderToString(app);
    expect(renderToString(app)).toBe(html);
    expect(adapter.read()).toBe(stored);
    expect(html).toContain('Legame Momo–Nibi:');
    expect(html).toContain('Si stanno abituando');
    expect(html).not.toContain('momoNibi');
    expect(html).not.toContain('pair_cautious_circle');
    expect(html).not.toContain('progressbar');
  });

  it('resident startup advances only one phase per creature, not an offline activity chain', () => {
    const initial: GameState = { ...createInitialState(initialClock, random), nibiPhase: 'resident',
      nibi: createInitialNibi(initialClock, random) };
    const adapter = memoryAdapter(serializeSave(initial, initialClock));
    let draws = 0;
    const first = startGame(adapter, { now: () => 31536001000 }, { next: () => { draws++; return 0; } });
    expect(draws).toBe(6); // Two phase choices/durations each, one shared + one general.
    expect(first.state.momo.phase).toBe('moving');
    expect(first.state.nibi?.phase).toBe('moving');
    expect(first.state.latestReport?.eventIds).toHaveLength(2);
    expect(first.state.relations.momoNibi).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { createElement, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { startGame } from './startGame';
import { createInitialState } from '../core/state/GameState';
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
    expect(persisted.schemaVersion).toBe(3);
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
});

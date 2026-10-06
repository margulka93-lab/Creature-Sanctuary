import { describe, expect, it } from 'vitest';
import { advanceTime, createInitialState, startMove } from './GameState';

describe('Momo timer rule (pure core)', () => {
  it('moves only when the injected clock reaches the deadline, without mutating input', () => {
    let now = 1000;
    const clock = { now: () => now };
    const initial = createInitialState();
    const moving = startMove(initial, 'stream', clock);
    expect(initial.momo.move).toBeNull();
    expect(moving.momo.move).toEqual({ targetAnchor: 'stream', completesAt: 4000 });
    now = 3999;
    expect(advanceTime(moving, clock)).toBe(moving);
    now = 4000;
    const arrived = advanceTime(moving, clock);
    expect(arrived.momo).toEqual({ currentAnchor: 'stream', move: null });
    expect(advanceTime(arrived, clock)).toBe(arrived);
    expect(startMove(arrived, 'tree', clock).momo.move?.targetAnchor).toBe('tree');
  });

  it('ignores same-anchor requests and a second request during a move', () => {
    const clock = { now: () => 1000 };
    const initial = createInitialState();
    expect(startMove(initial, 'tree', clock)).toBe(initial);
    const moving = startMove(initial, 'stream', clock);
    expect(startMove(moving, 'tree', clock)).toBe(moving);
    expect(advanceTime(moving, { now: () => 0 })).toBe(moving);
  });
});

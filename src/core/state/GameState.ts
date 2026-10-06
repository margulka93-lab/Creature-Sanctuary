import radura from '../../content/radura.json';
import type { Clock } from '../time/Clock';

export type AnchorId = 'tree' | 'stream';

export interface GameState {
  momo: {
    currentAnchor: AnchorId;
    move: { targetAnchor: AnchorId; completesAt: number } | null;
  };
}

export function isAnchorId(value: unknown): value is AnchorId {
  return radura.anchors.some((anchor) => anchor.id === value);
}

export function createInitialState(): GameState {
  return { momo: { currentAnchor: 'tree', move: null } };
}

export function startMove(state: GameState, target: AnchorId, clock: Clock): GameState {
  if (!isAnchorId(target) || target === state.momo.currentAnchor || state.momo.move) return state;
  return {
    momo: {
      currentAnchor: state.momo.currentAnchor,
      move: { targetAnchor: target, completesAt: clock.now() + radura.moveDurationMs },
    },
  };
}

export function advanceTime(state: GameState, clock: Clock): GameState {
  const move = state.momo.move;
  if (!move || clock.now() < move.completesAt) return state;
  return { momo: { currentAnchor: move.targetAnchor, move: null } };
}

export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object' || !('momo' in value)) return false;
  const momo = value.momo;
  if (!momo || typeof momo !== 'object' || !('currentAnchor' in momo) || !('move' in momo)) return false;
  if (!isAnchorId(momo.currentAnchor)) return false;
  const move = momo.move;
  return move === null || (
    typeof move === 'object' && 'targetAnchor' in move && 'completesAt' in move &&
    isAnchorId(move.targetAnchor) && move.targetAnchor !== momo.currentAnchor &&
    typeof move.completesAt === 'number' && Number.isFinite(move.completesAt) && move.completesAt >= 0
  );
}

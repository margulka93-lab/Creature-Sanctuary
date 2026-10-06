import type { GameState } from './GameState';

export const canLeaveBerry = (state: GameState) => state.bowl === 'empty' && state.resources.berries > 0;

export function leaveBerry(state: GameState): GameState {
  if (!canLeaveBerry(state)) return state;
  return { ...state, resources: { berries: state.resources.berries - 1 }, bowl: 'berry' };
}

export function acknowledgeReport(state: GameState): GameState {
  if (!state.latestReport || state.latestReport.acknowledged) return state;
  return { ...state, latestReport: { ...state.latestReport, acknowledged: true } };
}

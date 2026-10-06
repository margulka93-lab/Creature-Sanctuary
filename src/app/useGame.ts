import { useEffect, useState } from 'react';
import { advanceTime, startMove, type AnchorId } from '../core/state/GameState';
import type { Clock } from '../core/time/Clock';
import type { SaveAdapter } from '../storage/SaveAdapter';
import { loadGame, saveGame } from '../storage/save';

export function useGame(adapter: SaveAdapter, clock: Clock) {
  const [state, setState] = useState(() => loadGame(adapter, clock));
  const [saveAvailable, setSaveAvailable] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => setState((current) => advanceTime(current, clock)), 100);
    return () => window.clearInterval(timer);
  }, [clock]);

  useEffect(() => {
    setSaveAvailable(saveGame(adapter, state, clock));
  }, [adapter, state, clock]);

  return { state, saveAvailable, moveTo: (target: AnchorId) => setState((current) => startMove(current, target, clock)) };
}

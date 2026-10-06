import { useEffect, useRef, useState } from 'react';
import { advanceTime, type GameState } from '../core/state/GameState';
import { acknowledgeReport, leaveBerry } from '../core/state/actions';
import type { RandomSource } from '../core/random/RandomSource';
import type { Clock } from '../core/time/Clock';
import type { SaveAdapter } from '../storage/SaveAdapter';
import { saveGame } from '../storage/save';

export function useGame(initial: { state: GameState; saveAvailable: boolean }, adapter: SaveAdapter, clock: Clock, random: RandomSource) {
  const [state, setState] = useState(initial.state);
  const currentState = useRef(state);
  const [saveAvailable, setSaveAvailable] = useState(initial.saveAvailable);
  const commit = (next: GameState) => {
    currentState.current = next;
    setState(next);
    setSaveAvailable(saveGame(adapter, next, clock));
  };

  useEffect(() => {
    // Consume RNG outside React updater functions, which StrictMode may invoke twice.
    const timer = window.setInterval(() => {
      const next = advanceTime(currentState.current, clock, random);
      if (next !== currentState.current) {
        currentState.current = next;
        setState(next);
        setSaveAvailable(saveGame(adapter, next, clock));
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [adapter, clock, random]);

  useEffect(() => {
    const checkpoint = () => { saveGame(adapter, currentState.current, clock); };
    window.addEventListener('pagehide', checkpoint);
    return () => window.removeEventListener('pagehide', checkpoint);
  }, [adapter, clock]);

  return { state, saveAvailable,
    leaveBerry: () => commit(leaveBerry(currentState.current)),
    acknowledgeReport: () => commit(acknowledgeReport(currentState.current)),
  };
}

import { useEffect, useRef, useState } from 'react';
import { advanceTime } from '../core/state/GameState';
import type { RandomSource } from '../core/random/RandomSource';
import type { Clock } from '../core/time/Clock';
import type { SaveAdapter } from '../storage/SaveAdapter';
import { loadGame, saveGame } from '../storage/save';

export function useGame(adapter: SaveAdapter, clock: Clock, random: RandomSource) {
  const [state, setState] = useState(() => loadGame(adapter, clock, random));
  const currentState = useRef(state);
  const [saveAvailable, setSaveAvailable] = useState(true);

  useEffect(() => {
    // Consume RNG outside React updater functions, which StrictMode may invoke twice.
    const timer = window.setInterval(() => {
      const next = advanceTime(currentState.current, clock, random);
      if (next !== currentState.current) {
        currentState.current = next;
        setState(next);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [clock, random]);

  useEffect(() => {
    setSaveAvailable(saveGame(adapter, state, clock));
  }, [adapter, state, clock]);

  return { state, saveAvailable };
}

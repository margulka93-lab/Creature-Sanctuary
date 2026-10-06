import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../core/state/GameState';
import type { Clock } from '../core/time/Clock';
import { createSanctuary } from '../scene/sanctuary/createSanctuary';

export function SanctuaryCanvas({ state, clock }: { state: GameState; clock: Clock }) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<Awaited<ReturnType<typeof createSanctuary>> | null>(null);
  const latestState = useRef(state);
  const [failed, setFailed] = useState(false);
  latestState.current = state;

  useEffect(() => {
    let cancelled = false;
    void createSanctuary(host.current!, clock).then((created) => {
      if (cancelled) { created.destroy(); return; }
      scene.current = created;
      created.render(latestState.current);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      scene.current?.destroy();
      scene.current = null;
    };
  }, [clock]);

  useEffect(() => { scene.current?.render(state); }, [state]);
  return <div className="scene" ref={host}>{failed && <p role="alert">Impossibile avviare la scena Pixi. Ricarica con un browser compatibile con WebGL.</p>}</div>;
}

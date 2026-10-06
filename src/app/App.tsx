import radura from '../content/radura.json';
import type { Clock } from '../core/time/Clock';
import type { SaveAdapter } from '../storage/SaveAdapter';
import { SanctuaryCanvas } from '../ui/SanctuaryCanvas';
import { useGame } from './useGame';

export function App({ adapter, clock }: { adapter: SaveAdapter; clock: Clock }) {
  const { state, saveAvailable, moveTo } = useGame(adapter, clock);
  const currentName = radura.anchors.find((anchor) => anchor.id === state.momo.currentAnchor)!.label;
  return <main>
    <h1>Creature Sanctuary</h1>
    <p>La Radura · Prototipo M0.5 · Grafica placeholder</p>
    <SanctuaryCanvas state={state} />
    <p role="status">{state.momo.move ? 'Momo si prepara a spostarsi…' : `Momo è presso: ${currentName}`}</p>
    <div className="controls">
      <button disabled={!!state.momo.move || state.momo.currentAnchor === 'tree'} onClick={() => moveTo('tree')}>Vai all’Albero</button>
      <button disabled={!!state.momo.move || state.momo.currentAnchor === 'stream'} onClick={() => moveTo('stream')}>Vai al Ruscello</button>
    </div>
    <p>Lo spostamento richiede tre secondi. La posizione viene salvata automaticamente.</p>
    {!saveAvailable && <p role="alert">Salvataggio locale non disponibile. La sessione continua, ma i progressi potrebbero andare persi al reload.</p>}
  </main>;
}

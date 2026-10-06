import radura from '../content/radura.json';
import { activityById } from '../core/state/GameState';
import type { RandomSource } from '../core/random/RandomSource';
import type { Clock } from '../core/time/Clock';
import type { SaveAdapter } from '../storage/SaveAdapter';
import { SanctuaryCanvas } from '../ui/SanctuaryCanvas';
import { useGame } from './useGame';

export function App({ adapter, clock, random }: { adapter: SaveAdapter; clock: Clock; random: RandomSource }) {
  const { state, saveAvailable } = useGame(adapter, clock, random);
  const current = state.momo;
  const targetName = current.phase === 'moving'
    ? radura.anchors.find((anchor) => anchor.id === activityById(current.targetActivityId).anchor)!.label : null;
  return <main>
    <h1>Creature Sanctuary</h1>
    <p>La Radura · Prototipo M1 · Grafica placeholder</p>
    <SanctuaryCanvas state={state} clock={clock} />
    <p role="status">{current.phase === 'moving' ? `Momo si avvicina a: ${targetName}` : `Momo ${activityById(current.currentActivityId).label}`}</p>
    {!saveAvailable && <p role="alert">Salvataggio locale non disponibile. La sessione continua, ma i progressi potrebbero andare persi al reload.</p>}
  </main>;
}

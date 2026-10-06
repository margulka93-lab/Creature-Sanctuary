import radura from '../content/radura.json';
import { activityById } from '../core/state/GameState';
import type { RandomSource } from '../core/random/RandomSource';
import type { Clock } from '../core/time/Clock';
import type { SaveAdapter } from '../storage/SaveAdapter';
import { SanctuaryCanvas } from '../ui/SanctuaryCanvas';
import { useGame } from './useGame';
import type { GameState } from '../core/state/GameState';
import { canLeaveBerry } from '../core/state/actions';
import { useState } from 'react';
import { ReturnDiary } from '../ui/diary/ReturnDiary';

export function App({ initial, adapter, clock, random }: { initial: { state: GameState; saveAvailable: boolean }; adapter: SaveAdapter; clock: Clock; random: RandomSource }) {
  const { state, saveAvailable, leaveBerry, acknowledgeReport } = useGame(initial, adapter, clock, random);
  const [diaryOpen, setDiaryOpen] = useState(!!initial.state.latestReport && !initial.state.latestReport.acknowledged);
  const current = state.momo;
  const targetName = current.phase === 'moving'
    ? radura.anchors.find((anchor) => anchor.id === activityById(current.targetActivityId).anchor)!.label : null;
  return <main>
    <h1>Creature Sanctuary</h1>
    <p>La Radura · Prototipo M2 · Grafica placeholder</p>
    <SanctuaryCanvas state={state} clock={clock} />
    <p role="status">{current.phase === 'moving' ? `Momo si avvicina a: ${targetName}` : `Momo ${activityById(current.currentActivityId).label}`}</p>
    <div className="sanctuary-controls">
      <span>Bacche: {state.resources.berries}</span>
      <span>Ciotola: {state.bowl === 'berry' ? 'una Bacca' : 'vuota'}</span>
      <button disabled={!canLeaveBerry(state)} onClick={leaveBerry}>Lascia 1 Bacca</button>
      {state.latestReport && <button onClick={() => setDiaryOpen(true)}>Diario</button>}
    </div>
    {diaryOpen && state.latestReport && <ReturnDiary report={state.latestReport} onClose={() => {
      acknowledgeReport(); setDiaryOpen(false);
    }} />}
    {!saveAvailable && <p role="alert">Salvataggio locale non disponibile. La sessione continua, ma i progressi potrebbero andare persi al reload.</p>}
  </main>;
}

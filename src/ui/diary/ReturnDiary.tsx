import { offlineEvents, type ReturnReport } from '../../core/offline/ReturnReport';

function elapsedLabel(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minuto' : 'minuti'}`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours} ${hours === 1 ? 'ora' : 'ore'}${remaining ? ` e ${remaining} ${remaining === 1 ? 'minuto' : 'minuti'}` : ''}`;
}

export function ReturnDiary({ report, onClose }: { report: ReturnReport; onClose: () => void }) {
  return <section className="return-diary" aria-labelledby="return-title">
    <div className="diary-heading"><h2 id="return-title">Mentre eri via</h2><button onClick={onClose}>Chiudi Diario</button></div>
    <p>Sei stato via per {elapsedLabel(report.elapsedMs)}.</p>
    {report.berriesGained > 0 && <div><h3>Raccolto</h3><p>+{report.berriesGained} {report.berriesGained === 1 ? 'Bacca' : 'Bacche'}</p></div>}
    {report.eventIds.map((id) => <p key={id}>{offlineEvents.find((event) => event.id === id)!.text}</p>)}
  </section>;
}

# Creature Sanctuary

Prototipo M2: Momo mantiene le tre attività autonome M1; il primo return loop
aggiunge Bacche, una ciotola fissa e l'ultimo report del Diario. La grafica usa
solo forme e testo placeholder.

## Avvio

Usare **Node.js 24 LTS** e npm (`.nvmrc` indica il major previsto), dalla root:

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

`dev` serve l'app su http://localhost:5173; `preview` serve `dist/` su
http://localhost:4173. `build` controlla anche i tipi TypeScript. Il lockfile fissa
le dipendenze; per installazioni riproducibili successive usare `npm ci`.
I test girano in Node. I test core/storage non inizializzano React, Pixi o DOM;
un test di integrazione separato verifica che render React ripetuti non
rieseguano il bootstrap offline.

## Verifica manuale M2

### Nuova partita

1. Nei DevTools → Application → Local Storage eliminare solo la chiave
   `creature-sanctuary.save`, poi aprire/ricaricare l'app.
2. Verificare **1 Bacca**, ciotola vuota e nessun report. Momo parte sonnecchiando
   sotto l'Albero e continua a scegliere autonomamente fra le tre attività.
3. Premere **Lascia 1 Bacca**: il conteggio scende a 0, la Bacca appare nella
   ciotola e l'azione viene disabilitata. Non ci sono comandi di movimento.
4. Un reload immediato conserva la ciotola piena: sotto cinque minuti nessuna
   raccolta, consumo o nuovo evento/report offline.

### Primo ritorno reale

1. Chiudere la scheda per **almeno cinque minuti**, quindi riaprire l'app sullo
   stesso indirizzo/origine e nello stesso browser.
2. Verificare ciotola vuota e report **Mentre eri via** aperto automaticamente.
   Se l'assenza è inferiore a trenta minuti compare un solo evento; con la
   ciotola piena deve essere uno degli eventi ciotola.
3. Chiudere il report: al reload immediato non deve riaprirsi, né duplicare Bacche
   o eventi. Usare **Diario** per riaprire lo stesso ultimo report.
4. Per un ritorno più lungo, verificare che il report rimanga compatto, con al
   massimo due righe di eventi. I test coprono le soglie esatte di raccolta.
5. Provare un save corrotto (`{broken`) o di versione sconosciuta: l'app deve
   ripartire in sicurezza. Uno schema 2 valido deve conservare Momo e aggiungere
   i campi M2; uno schema 1 riparte dal nuovo stato iniziale.

### Playtest umano dopo il merge

M2 è una implementazione da valutare, **non è automaticamente design-validata**.
Dopo almeno un ritorno reale chiedersi: è successo qualcosa o sembra solo un
popup di ricompensa? La ciotola comunica causa/conseguenza? La riga su Momo gli
aggiunge personalità? Le Bacche sono utili o già troppo astratte? Il report è
invadente? Viene voglia di chiudere e tornare ancora? La ripetizione/macchina
sottostante è troppo evidente?

**M3 non è iniziata e resta subordinata a questa verifica umana.**

## Regole M2 e persistenza

- Nuova partita: 1 Bacca, ciotola vuota, ultimo report null.
- Lasciare una Bacca costa 1 e richiede ciotola vuota e inventario positivo.
- Da 5 minuti di assenza: report con 1 evento; da 30 minuti: 2 eventi al massimo.
- Raccolta comune: `min(8, floor(elapsed / 15 minuti))`. Da 5 a 14m59s è zero.
- Una ciotola piena richiede un evento ciotola nel primo slot e viene svuotata.
- Gli eventi possono aggiungere +1 Bacca oltre alla raccolta comune. Il report
  mostra il totale guadagnato, con testo risolto dai contenuti tramite event ID.
- Si evitano eventi dell'ultimo report quando esistono alternative eleggibili e
  non si ripete lo stesso evento due volte nello stesso ritorno.
- Si conserva solo l'ultimo report e il suo acknowledgement, senza timeline.

Lo **schema 3** migra in modo mirato i save M1 (schema 2) validi: preserva Momo,
aggiunge 1 Bacca, ciotola vuota e report null. La normale reconciliation può poi
usare il timestamp originale per un ritorno valido. Non c'è un framework di
migrazione. Save sconosciuti, corrotti o incoerenti usano un nuovo stato sicuro.

`main.tsx` esegue `startGame` **prima** di montare React/StrictMode: lettura e
migrazione, risoluzione di al massimo una fase Momo scaduta, reconciliation M2
una sola volta, salvataggio immediato con baseline corrente, poi rendering.
Nessun initializer o effect React assegna reward o sceglie eventi offline.
Il reload immediato usa la nuova baseline, senza duplicare il ritorno.
StrictMode rimane attivo.

Si salva a ogni transizione Momo, azione sulla ciotola e chiusura del Diario;
`pagehide` aggiorna il checkpoint alla chiusura della scheda. Il controllo
riapertura Diario è solo UI e non assegna premi. Se localStorage è bloccato o
pieno, la sessione continua con un avviso: la baseline e i progressi non possono
essere garantiti tra reload finché la persistenza non torna disponibile.

Orologio arretrato: elapsed offline portato a zero, nessun premio/report;
la fase Momo viene ribasata con timestamp non negativi. M1 risolve al massimo
una fase e riparte dal presente, senza simulare le attività perse.
La reconciliation M2 è limitata a due event slot, indipendentemente dall'assenza.

## Moduli e confini

- `src/core/state/`: stato serializzabile, attività autonome M1 e regole ciotola/acknowledgement.
- `src/core/time/`, `src/core/random/`: dipendenze Clock/RandomSource; implementazioni reali nel bootstrap.
- `src/core/offline/`: report, selezione stretta M2 ed effetti; nessun EventEngine generico.
- `src/content/radura.json`, `momo.json`: anchor e profilo M1 invariato.
- `src/content/offline.json`: configurazione M2 e dieci eventi authored.
- `src/app/startGame.ts`: orchestration una volta fuori React; `useGame` coordina la sessione attiva.
- `src/ui/diary/`: pannello compatto, senza diagnostica o storico.
- `src/scene/sanctuary/`: rendering Pixi, movimento interpolato e ciotola fissa.
- `src/storage/`: SaveAdapter, localStorage, parsing/migrazione mirata, serializzazione versionata.

M1 conserva pesi 5/3/2, durate 8–14/5–9/4–7 secondi e movimenti di tre secondi.
Pacing, layout 800×400 e grafica restano provvisori. Nibi, relazioni, Legnetti,
Fibre, bisogni, upgrade, ulteriori strutture, storico Diario, EventEngine,
Bestiario, meteo, backend, arte finale e audio restano fuori scope.

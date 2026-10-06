# Creature Sanctuary

Prototipo M3: Momo conserva le attività autonome M1; Nibi arriva attraverso
tracce e ciotola, poi vive nella Radura con un profilo più mobile. Il Diario
racconta i ritorni e gli eventi condivisi cambiano un solo legame qualitativo.
La grafica usa forme e testo placeholder.

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
I test core/storage girano in Node senza inizializzare React, Pixi o DOM;
un test di integrazione separato verifica che render React ripetuti con
StrictMode non rieseguano il bootstrap offline. Nessuna nuova dipendenza M3.

## Verifica manuale M3

Usare sempre lo stesso browser e indirizzo/origine. Chiudere davvero la scheda
nei passaggi offline; una scheda aperta continua ad aggiornare il checkpoint.

### A — Tracce

1. Nei DevTools → Application → Local Storage eliminare solo la chiave
   `creature-sanctuary.save` per una nuova partita, oppure usare un save M2
   schema 3 valido. Verificare ciotola vuota: la nuova partita ha 1 Bacca.
2. Chiudere la scheda per **almeno cinque minuti**, poi riaprire l'app.
3. Il Diario deve aprirsi con **Nuove tracce**, prima dell'evento ordinario.
   Nibi e il legame non devono essere ancora visibili nella Radura.
4. Chiudere il Diario e ricaricare subito: niente nuova discovery o consumo;
   il Diario resta chiuso e può essere riaperto con il pulsante **Diario**.

### B — Arrivo

1. Con le tracce già scoperte e almeno 1 Bacca, premere **Lascia 1 Bacca**.
   Costa 1 Bacca; il pulsante viene disabilitato e la Bacca appare nella ciotola.
2. Chiudere la scheda per **almeno cinque minuti**, poi riaprire.
3. Il Diario deve annunciare **Un nuovo abitante**. La ciotola è vuota; non
   compaiono eventi ciotola né altri eventi ricorrenti in questo ritorno.
   L'eventuale raccolta comune resta disponibile.
4. Nibi è visibile, con corpo nocciola, orecchie/germoglio e nome. Compare
   **Legame Momo–Nibi: Si stanno studiando**, senza numero o barra.
5. Chiudere il Diario e ricaricare subito: Nibi resta, nessun secondo arrivo,
   nessun ulteriore consumo e lo stesso report resta riapribile.

### C — Due creature autonome

Osservare **2–3 minuti** senza impartire comandi:

- Momo conserva soste più lunghe e movimento di 3 secondi;
- Nibi alterna Erba Alta, Ruscello e Albero con soste più corte e movimento di 2 secondi;
- le deadline sono indipendenti: uno può sostare mentre l'altro si sposta;
- allo stesso anchor i due placeholder occupano corsie visive separate;
- non compaiono comandi di movimento o altri controlli sulle creature.

### D — Primo ritorno condiviso

1. Con Nibi residente e ciotola vuota, chiudere per **almeno cinque minuti**.
2. Riaprire: il singolo evento deve raccontare Momo e Nibi insieme.
3. Chiudere il Diario e ricaricare: evento e delta legame non si applicano
   due volte. Verificare la categoria qualitativa.
4. A valore 0, l'evento sulle radici mantiene **Si stanno studiando**; un ritorno
   successivo può scegliere l'alternativa positiva grazie al repetition control.
5. Con ciotola piena e assenza breve il normale evento ciotola ha precedenza;
   da trenta minuti possono comparire ciotola + un solo evento condiviso.

### Regressioni M1/M2 e save

- Un reload sotto cinque minuti non genera raccolta, discovery o nuovo report,
  né consuma una Bacca lasciata nella ciotola.
- Momo resta autonomo e mantiene i tre comportamenti originali.
- Da 15 minuti completi verificare la raccolta; da 30 minuti al massimo due
  eventi ricorrenti. I test deterministici coprono i confini esatti e il cap.
- Save corrotti o versioni sconosciute ripartono in sicurezza. Schema 3 conserva
  Momo, Bacche, ciotola, ultimo report e timestamp originale, inizializzando Nibi
  non ancora scoperto. Schema 2 conserva il percorso di migrazione M1 esistente;
  schema 1 riparte da uno stato iniziale sicuro.

### Playtest umano richiesto

Dopo l'arrivo e almeno un ritorno condiviso valutare:

- le tracce creano aspettativa o sembrano una flag tecnica?
- la ciotola comunica attrazione di Nibi oppure acquisto mascherato?
- Nibi sembra diverso da Momo attraverso tempi, movimento e placeholder?
- due creature rendono la Radura più viva o soltanto affollata?
- l'evento condiviso racconta un rapporto?
- la categoria qualitativa aiuta o sembra una barra sociale travestita?
- viene voglia di vedere un'altra interazione?
- il return loop appare già troppo meccanico/ripetitivo?

**M3 non è automaticamente design-validata dai test. M4 non è iniziata e resta
bloccata fino al playtest umano.**

## Regole e persistenza

M2 mantiene una sola risorsa attiva, **Bacche**, e una ciotola vuota/piena:

- nuova partita: 1 Bacca, ciotola vuota, ultimo report null;
- lasciare una Bacca costa 1 e richiede ciotola vuota e inventario positivo;
- soglia report: 5 minuti; massimo 1 evento ricorrente sotto 30 minuti, 2 dopo;
- raccolta comune: `min(8, floor(elapsed / 15 minuti))`;
- bonus +1 Bacca restano soltanto negli eventi generali M2;
- gli ID dell'ultimo report vengono evitati quando ci sono alternative valide;
- solo ultimo report e acknowledgement persistiti, senza timeline.

M3 aggiunge soltanto `nibiPhase`, comportamento Nibi nullable e
`relations.momoNibi` (intero 0–5). Primo ritorno valido: `unseen → traces` senza
renderizzare Nibi. Ritorno successivo valido con ciotola piena:
`traces → resident`, Bacca consumata, `visit_tree` all'Albero e relazione 0.
L'arrivo sopprime tutti gli eventi ricorrenti del ritorno; le tracce convivono
con il normale M2. Le discovery sono separate dagli slot ricorrenti.

Dopo l'arrivo: prima ciotola, poi al massimo un evento condiviso eleggibile per
il valore del legame, poi eventi generali per gli slot restanti. I sei eventi
condivisi applicano +1/-1 clampato 0–5 e non producono Bacche. Non c'è decadimento.
Il numero resta nascosto: 0 **Si stanno studiando**, 1–2 **Si stanno abituando**,
3–4 **Si cercano**, 5 **Amici**.

Lo **schema 4** migra in modo mirato i save schema 3 validi, preservando tutti
i campi M2 e `savedAt` e aggiungendo `unseen`, Nibi null e relazione 0.
Non c'è un framework di migrazione. Save incoerenti ricadono su uno stato sicuro.

`main.tsx` esegue `startGame` **prima** di montare React/StrictMode: lettura e
migrazione, al massimo una fase scaduta per ciascuna creatura residente,
reconciliation una volta, salvataggio immediato con baseline corrente, rendering.
Discovery, consumo e delta relazione passano per questo stesso percorso.
Nessun initializer/effect React sceglie eventi offline o assegna reward.
StrictMode rimane attivo. La riapertura del Diario è solo UI.

Si salva a ogni transizione, azione sulla ciotola e chiusura del Diario;
`pagehide` aggiorna il checkpoint alla chiusura della scheda. Se localStorage è
bloccato/pieno, la sessione continua con un avviso: progressi e baseline non
possono essere garantiti fra reload finché la persistenza non torna disponibile.

Orologio arretrato: elapsed offline a zero, nessun premio/report; le fasi vengono
ribasate senza timestamp negativi. Non si simulano catene di attività perse.

## Moduli e confini

- `src/core/state/`: stato, helper behavior per due profili, relazione e azioni.
- `src/core/time/`, `src/core/random/`: Clock/RandomSource iniettati.
- `src/core/offline/`: report, discovery e selezione stretta M2/M3; nessuna DSL.
- `src/content/radura.json`, `momo.json`: anchor e profilo M1 invariati.
- `src/content/nibi.json`: tre attività Nibi, identità e movimento 2 secondi.
- `src/content/offline.json`: configurazione M2 e dieci eventi invariati.
- `src/content/shared-events.json`, `discoveries.json`: sei eventi e due discovery authored.
- `src/app/startGame.ts`: bootstrap pre-React; `useGame` coordina il timer attivo.
- `src/ui/diary/`: report compatto con discovery prima delle righe ordinarie.
- `src/scene/sanctuary/`: placeholder Pixi e interpolazione; nessuna regola.
- `src/storage/`: adapter, validazione save, migrazioni mirate e schema 4.

Momo conserva pesi 5/3/2, durate 8–14/5–9/4–7 secondi e movimento di 3 secondi.
Pacing, layout 800×400 e grafica restano provvisori. Terza creatura, bisogni,
decadimento/direzionalità delle relazioni, Bestiario, nuove risorse/strutture,
meteo/mistero, ContentRegistry/EventEngine generici, backend, arte finale e audio
restano fuori scope. M4 non è implementata.

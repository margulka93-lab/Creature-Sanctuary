# Creature Sanctuary

Verticale tecnica M0.5: React ospita la Radura PixiJS, il core TypeScript gestisce
un solo spostamento a tempo di Momo e lo storage salva lo stato locale.
La grafica usa esclusivamente forme e testo placeholder.

## Avvio

Usare **Node.js 24 LTS** e npm (`.nvmrc` indica il major previsto).
Dalla root del repository:

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

`dev` serve l'app su http://localhost:5173; `preview` serve la build di `dist/`.
`test` esegue Vitest in Node, senza inizializzare React, Pixi o DOM.
`build` controlla anche i tipi TypeScript. Il lockfile fissa le versioni installate;
per installazioni riproducibili successive è disponibile `npm ci`.

## Verifica manuale M0.5

1. Aprire l'app: Momo parte dall'Albero; Ruscello è un anchor distinto.
2. Premere **Vai al Ruscello**: dopo tre secondi il core cambia la posizione.
3. Ricaricare: Momo resta al Ruscello. Provare anche il ritorno all'Albero.
4. Ricaricare durante uno spostamento: il timer rimane coerente; se la scadenza è
   già trascorsa viene completato soltanto lo spostamento richiesto.
5. Nei DevTools → Application → Local Storage, eliminare la chiave
   `creature-sanctuary.save`, poi ricaricare: viene creato lo stato iniziale.
6. Sostituire il valore con `{broken` e ricaricare: l'app riparte dall'Albero
   senza crash e scrive un salvataggio valido.

Se localStorage è bloccato o pieno, la sessione continua e la UI segnala che il
salvataggio non è disponibile. Versioni/schema non supportati o dati malformati
ricadono sullo stato iniziale; non ci sono migrazioni in M0.5.

## Moduli e confini

- `src/core/state/`: `GameState`, avvio e completamento del timer, validazione dello stato.
- `src/core/time/`: interfaccia `Clock`; `Date.now()` viene iniettato dal bootstrap.
- `src/content/radura.json`: due anchor e durata provvisoria dello spostamento.
- `src/app/`: composizione, timer del browser e coordinamento del salvataggio.
- `src/ui/`: controlli React e lifecycle della canvas.
- `src/scene/sanctuary/`: solo rendering Pixi, senza regole gameplay.
- `src/storage/`: `SaveAdapter`, localStorage ed envelope `{ schemaVersion, savedAt, state }`.

Lo stato salva solo l'anchor corrente di Momo e l'eventuale destinazione/scadenza.
Si salva all'avvio e a ogni transizione; un timer di polling verifica la scadenza
senza salvare ogni frame. Un orologio arretrato al reload conserva il tempo
residuo, evitando elapsed negativo. Non viene simulata l'assenza.

Le scelte di due anchor, tre secondi e layout 800×400 sono parametri del test
tecnico, non decisioni definitive su attività, bilanciamento o direzione artistica.
Economia, reward offline, eventi, Diario, Bestiario, altre creature e asset finali
restano alle milestone successive. Le domande di design rimangono aperte.

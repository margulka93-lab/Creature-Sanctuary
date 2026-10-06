# Creature Sanctuary

Prototipo M1: React ospita la Radura PixiJS, il core TypeScript gestisce le tre
attività autonome di Momo e lo storage salva lo stato locale.
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

## Verifica manuale M1

1. Con storage vuoto aprire l'app: Momo sonnecchia all'Albero; Ruscello ed Erba
   Alta sono distinti. Non ci sono comandi per spostarlo.
2. Osservare per 1–2 minuti senza input: almeno due attività devono essere
   leggibili tramite testo, posizione e simbolo/posa. Le soste variano, i
   movimenti durano tre secondi. Verificare ritorni all'Albero e visite curiose.
3. Ricaricare durante una sosta: attività e deadline restano quelle salvate,
   finché la fase non è scaduta.
4. Ricaricare durante uno spostamento: Momo riprende il percorso persistito e
   arriva all'attività scelta. Dopo una lunga assenza viene risolta soltanto
   quella fase, e la fase successiva parte dal presente.
5. Nei DevTools → Application → Local Storage, eliminare la chiave
   `creature-sanctuary.save`, poi ricaricare: viene creato lo stato iniziale.
6. Sostituire il valore con `{broken` e ricaricare: l'app riparte dall'Albero
   senza crash e scrive un salvataggio valido nello schema 2.

Proseguire l'osservazione per **3–5 minuti** e valutare umanamente: Momo prende
iniziative proprie? Sembra una creatura o una demo di timer? È troppo irrequieto
o statico? La preferenza per l'Albero si percepisce? I pesi 5/3/2 e i movimenti
di tre secondi funzionano? Le tre attività diventano già ripetitive?
I test e la verifica browser dell'implementazione non chiudono queste domande.
**M1 è implementata; la validazione di design resta al playtest umano. M2 non è iniziata.**

Se localStorage è bloccato o pieno, la sessione continua e la UI segnala che il
salvataggio non è disponibile. Versioni/schema non supportati o dati malformati
ricadono sullo stato iniziale. Lo schema è passato da 1 a **2**: i save M0.5
(anche validi) vengono intenzionalmente resettati a `doze_tree` all'Albero.
Nessun framework di migrazione è stato aggiunto.

## Moduli e confini

- `src/core/state/`: `GameState`, scelta pesata, durate e transizioni, validazione dello stato.
- `src/core/time/`: interfaccia `Clock`; `Date.now()` viene iniettato dal bootstrap.
- `src/core/random/`: `RandomSource`; `Math.random()` viene iniettato dal bootstrap.
- `src/content/radura.json`: tre anchor e durata provvisoria dello spostamento.
- `src/content/momo.json`: attività authored, pesi, intervalli, testi e simboli;
  tratti di identità conservati, senza trait engine o effetti di `goloso`.
- `src/app/`: composizione, timer del browser e coordinamento del salvataggio.
- `src/ui/`: lifecycle della canvas; l'interfaccia React permette di osservare.
- `src/scene/sanctuary/`: rendering Pixi e interpolazione, senza regole gameplay.
- `src/storage/`: `SaveAdapter`, localStorage ed envelope `{ schemaVersion, savedAt, state }`.

Lo stato salva anchor e attività corrente, fase `settled`/`moving`, inizio e
deadline della fase. Nel movimento salva l'attività di destinazione e la sua
durata già scelta. L'attività corrente basta a escludere la ripetizione immediata.
Si salva all'avvio e a ogni transizione; un timer di polling verifica la scadenza
senza salvare ogni frame. Ogni aggiornamento risolve al massimo una fase e
riparte dal tempo corrente, anche dopo una scheda sospesa. Al reload un orologio
arretrato ribasa la fase conservandone la durata; l'inizio resta non negativo.
Durante la sessione, un salto precedente all'inizio ribasa la fase sul presente.
Non ci sono loop di recupero o simulazione dell'assenza.

Tre anchor, pesi 5/3/2, durate 8–14/5–9/4–7 secondi, movimento di tre secondi e
layout 800×400 sono parametri del prototipo, non bilanciamento o arte definitiva.
Economia, reward offline, eventi, Diario, Bestiario, altre creature e asset finali
restano alle milestone successive. Le domande di design rimangono aperte.

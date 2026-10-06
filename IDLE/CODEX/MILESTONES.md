# Creature Sanctuary — Milestones

Le milestone sono ordinate per validare il rischio principale prima di produrre molto contenuto.

## M0 — Foundation decision ✅

**Obiettivo:** scegliere il minimo stack tecnico.

Decisioni approvate:

- target browser/web, desktop-first responsive;
- TypeScript;
- React 19.x;
- Vite 8.x;
- PixiJS 8.x;
- Vitest 5.x;
- npm;
- contenuti JSON;
- localStorage tramite SaveAdapter;
- core TypeScript puro separato da React/Pixi.

Output raggiunto:

- stack definito;
- confini architetturali definiti;
- TECH_SPEC aggiornata;
- nessuna feature gameplay ancora richiesta.

## M0.5 — Vertical wiring ✅

**Stato:** implementata, revisionata e accettata il 2026-10-06 (issue #2, PR #3).

La catena React → Pixi → core TypeScript → timer → SaveAdapter → reload funziona
senza introdurre complessità fuori scope. La base tecnica è sufficiente per M1.

**Domanda da validare:** l'intera catena tecnica più piccola funziona senza introdurre complessità inutile?

Scope:

- bootstrap Vite + React + TypeScript;
- canvas PixiJS dentro la shell React;
- Radura placeholder;
- Momo placeholder;
- almeno due anchor point;
- `GameState` minimo in TypeScript puro;
- timer/clock iniettabile;
- passaggio di Momo fra anchor;
- `SaveAdapter` localStorage;
- save envelope versionato;
- reload coerente;
- test minimi del core e del save;
- README con comandi di avvio/test.

Niente:

- asset definitivi;
- economia;
- offline reward;
- Diario;
- Nibi;
- relazioni;
- Bestiario;
- state library aggiuntiva;
- backend.

Success criteria:

- `npm install`, `npm run dev`, `npm test` funzionano;
- la pagina mostra la Radura e Momo placeholder;
- Momo può cambiare anchor tramite una regola del core;
- reload mantiene uno stato coerente;
- i test del core non richiedono Pixi o React;
- l'architettura resta leggibile e piccola.

## M1 — Momo in una Radura

**Stato:** design definito, pronta per implementazione.

**Domanda da validare:** possiamo far percepire Momo come una creatura autonoma, timida ma curiosa, con pochissima tecnologia?

Scope:

- la Radura placeholder esistente;
- tre anchor: Albero, Ruscello, Erba Alta;
- tre attività authored: sonnecchia, osserva il ruscello, esplora l'erba;
- scelta autonoma tramite pesi;
- intervalli di durata variabili;
- repetition control minimo: evitare la stessa attività due volte di seguito quando possibile;
- movimento fra anchor;
- RNG iniettabile;
- stato persistente e reload coerente;
- feedback visivo/testuale placeholder sufficiente a distinguere le attività;
- rimozione dei comandi player-facing "Vai a...".

Pacing prototipo:

- sonnecchia: peso 5, 8–14 s;
- osserva ruscello: peso 3, 5–9 s;
- esplora erba: peso 2, 4–7 s.

Questi valori servono soltanto a rendere leggibile il playtest.

Niente:

- Nibi;
- relazioni;
- economia o bacche;
- fame/energia/bisogni;
- trait engine generico;
- EventEngine completo;
- offline simulation;
- Diario;
- Bestiario;
- meteo;
- mistero;
- asset finali.

Success criteria tecnici:

- Momo sceglie e completa attività senza input del giocatore;
- tempo e RNG restano testabili/iniettabili;
- reload non resetta arbitrariamente Momo;
- una lunga assenza non viene simulata attività-per-attività;
- nessuna logica di comportamento vive in React/Pixi;
- il progetto resta piccolo e leggibile.

Success criteria di design da playtest umano:

- in 1–2 minuti si osservano almeno due comportamenti diversi senza cliccare;
- Momo non appare come un metronomo che cambia posto a intervalli identici;
- l'Albero risulta una preferenza, non una prigione;
- Ruscello/Erba comunicano curiosità;
- l'impressione complessiva è più vicina a "sta facendo cose sue" che a "sta eseguendo una demo".

Non dichiarare M1 validata finché il risultato non viene osservato nel browser.

## M2 — Primo idle loop

**Domanda da validare:** tornare dopo un'assenza produce interesse?

Scope:

- lastSeen timestamp;
- offline reconciliation;
- 3 risorse max;
- circa 10 eventi;
- Diario di ritorno;
- una struttura semplice, probabilmente Rifugio o Ciotola.

Success criteria:

- chiudere e riaprire dopo un intervallo produce un risultato coerente;
- il Diary non è un log tecnico;
- nessuna simulazione secondo-per-secondo necessaria.

## M3 — Nibi e relazioni

**Domanda da validare:** due creature creano storie sufficientemente interessanti?

Scope:

- Nibi;
- condizioni di arrivo;
- relazione Momo↔Nibi;
- eventi condivisi;
- primo evento a più fasi/flag.

Success criteria:

- Nibi non appare tramite acquisto;
- la presenza di due creature produce eventi differenti da quelli individuali;
- la relazione modifica almeno alcuni pesi/eventi.

## M4 — Content architecture

**Obiettivo:** assicurare che il gioco sia espandibile senza hardcode crescente.

Scope:

- definizioni data-driven per creature;
- definizioni data-driven per eventi;
- validation minima degli schemi;
- EventEngine generico;
- test per prerequisiti/effetti.

Success criteria:

- aggiungere un evento semplice non richiede modifica al core;
- aggiungere una creatura simile a quelle esistenti richiede soprattutto contenuti.

## M5 — Piko + Bestiario

Scope:

- Piko;
- introduzione tramite evento ambientale;
- Bestiario base;
- campi progressivamente sbloccabili;
- almeno un comportamento scoperto tramite evento.

Obiettivo: validare la scoperta indiretta.

## M6 — Lumi + tempo/mistero minimo

Scope possibile:

- Lumi;
- Pietra Lucida;
- requisito temporale/notturno semplificato;
- primi indizi;
- primo evento raro.

Day/night completo e meteo sono opzionali e vanno aggiunti solo se servono realmente.

## M7 — Esplorazione / seconda direzione

Solo dopo la validazione del core scegliere se il Bosco sarà:

A. seconda scena completa; oppure  
B. destinazione di spedizione/timer.

Non implementare entrambe le opzioni prima della decisione.

## Backlog post-validazione

Possibili sistemi, non milestone garantite:

- Brum;
- Wisp;
- meteo;
- ciclo giorno/notte più ricco;
- varianti ambientali;
- più biomi;
- anomalie;
- stagioni;
- prestige narrativo;
- personalizzazione estetica.

## Regola di avanzamento

Non procedere alla milestone successiva solo perché quella precedente "funziona tecnicamente".

Chiedere sempre se ha validato la domanda di design associata.

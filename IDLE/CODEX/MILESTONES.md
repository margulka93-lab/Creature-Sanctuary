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

## M1 — Momo in una Radura ✅

**Stato:** implementata e playtestata.

Il playtest umano con grafica placeholder ha giudicato il comportamento autonomo
sufficientemente credibile/carinamente leggibile da permettere di procedere.
Pacing, grafica e varietà restano provvisori; M1 non è considerata contenuto finale.

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

- stato iniziale: `doze_tree` all'Albero;
- movimento fra anchor: 3 s;
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

## M2 — Primo idle loop ✅

**Stato:** implementata, verificata e accettata per procedere.

Il return loop con Bacche, ciotola e Diario è sufficientemente solido per testare
M3. Bilanciamento, frequenze e testi restano provvisori e possono essere rivisti.

**Domanda da validare:** tornare dopo un'assenza produce curiosità e la sensazione che il santuario abbia vissuto senza il giocatore?

Scope:

- offline reconciliation al caricamento;
- una sola risorsa attiva: Bacche;
- stato iniziale: 1 Bacca;
- raccolta comune: 1 Bacca / 15 min, cap 8;
- soglia report: 5 min;
- massimo 1 evento significativo tra 5 e 30 min;
- massimo 2 eventi da 30 min in su;
- 10 eventi offline authored;
- repetition control rispetto all'ultimo report;
- ciotola vuota/piena;
- azione "lascia 1 Bacca";
- consumo offline della Bacca nella ciotola con evento garantito;
- ultimo report di ritorno persistito;
- apertura automatica una volta + riapertura tramite Diario;
- migrazione mirata save M1 → M2;
- test deterministici con Clock/RandomSource.

Niente:

- Legnetti/Fibre attivi;
- Nibi;
- relazioni;
- struttura potenziabile;
- più tipi di cibo;
- bisogno fame;
- simulazione attività-per-attività offline;
- EventEngine generico;
- timeline completa del Diario;
- Bestiario;
- meteo/mistero;
- asset finali.

Success criteria tecnici:

- un'assenza sotto 5 min non genera reward/report;
- un'assenza valida genera una sola reconciliation e non duplica reward al reload;
- la raccolta comune rispetta formula e cap;
- il numero massimo di eventi rispetta la fascia temporale;
- una ciotola piena viene consumata soltanto dopo una vera assenza valida;
- gli eventi recenti vengono evitati quando esistono alternative;
- bonus Bacche degli eventi vengono applicati una sola volta;
- report e acknowledgement sopravvivono al reload;
- nessuna simulazione secondo-per-secondo.

Success criteria di design da playtest umano:

- il report sembra raccontare un piccolo pezzo di vita del santuario, non un log tecnico;
- lasciare una Bacca nella ciotola crea una causa/conseguenza percepibile al ritorno;
- 1–2 eventi sono abbastanza da incuriosire senza diventare rumore;
- le Bacche rendono possibile una scelta senza trasformare Momo in una fabbrica;
- dopo aver chiuso il report nasce almeno un minimo di desiderio di lasciare di nuovo il santuario e vedere cosa succede.

Non iniziare M3 finché il return loop non è stato osservato in browser.

## M3 — Nibi e relazioni

**Stato:** implementata e verificata tecnicamente (issue #11); playtest umano di design ancora richiesto.

Schema 4, migrazione M2, discovery, autonomia Nibi, relazione ed eventi condivisi
sono implementati. Verifica: 140 test in Node, build TypeScript/Vite e browser con
tre ritorni reali di almeno 5 minuti (tracce, arrivo, primo evento condiviso),
circa 3 minuti di osservazione, reload/Diario e rendering allo stesso anchor.
Nessuna nuova dipendenza; parametri Momo e raccolta/limiti M2 invariati.

Queste verifiche confermano l'implementazione, non la domanda di design.
M3 non è dichiarata design-validata. M4 non è iniziata e resta bloccata fino al
playtest umano dopo l'arrivo e almeno un report condiviso.

**Domanda da validare:** una seconda creatura e una relazione semplicissima rendono il santuario sensibilmente più vivo e narrativamente interessante?

Scope:

- migrazione save schema 3 → 4;
- `nibiPhase: unseen → traces → resident`;
- discovery one-shot `nibi_tracks` al primo ritorno valido;
- discovery one-shot `nibi_arrival` a un ritorno successivo con Bacca nella ciotola;
- consumo della Bacca nell'arrivo;
- Nibi residente e autonomo;
- tre attività authored Nibi;
- movimento Nibi 2 s;
- relation Momo–Nibi 0–5;
- categoria qualitativa visibile, numero nascosto;
- 6 shared event authored con delta relazione;
- shared event eligibility dipendente dalla relazione;
- integrazione nel return loop M2 senza aumentare arbitrariamente il numero di eventi;
- generalizzazione minima del behavior scheduler;
- test Clock/RNG/save/reconciliation deterministici.

Progressione Nibi:

1. schema M3 iniziale: unseen;
2. primo return ≥5m: traces;
3. return successivo ≥5m con bowl berry: resident.

Profilo Nibi:

- rustle_grass: peso 4, 3–6 s;
- splash_stream: peso 3, 4–7 s;
- visit_tree: peso 3, 3–5 s;
- initial: visit_tree;
- movimento: 2 s.

Relazione:

- 0 = si stanno studiando;
- 1–2 = si stanno abituando;
- 3–4 = si cercano;
- 5 = amici;
- clamp 0–5;
- no decay.

Niente:

- terza creatura;
- relazione direzionale;
- relationship decay;
- bisogno sociale;
- breeding;
- Bestiario;
- trait engine generico;
- EventEngine universale;
- DSL condizioni/effetti;
- refactor completo content architecture;
- nuove risorse;
- nuove strutture;
- meteo/mistero;
- asset finali.

Success criteria tecnici:

- Nibi non appare prima della progressione prevista;
- tracks e arrival sono one-shot e non si duplicano su reload;
- arrival consuma la bowl berry e sopprime il normale bowl event;
- Nibi diventa autonomo solo quando resident;
- Momo e Nibi possono avanzare in modo indipendente;
- la relation resta 0–5 e sopravvive al save;
- shared event eleggibili cambiano in base alla relation;
- relationship delta viene applicato esattamente una volta;
- M2 exactly-once reconciliation resta valida;
- M1/M2 regression test restano verdi.

Success criteria di design da playtest umano:

- le tracce creano almeno un minimo di anticipazione prima dell'arrivo;
- usare la ciotola per attirare Nibi sembra causa/conseguenza, non acquisto mascherato;
- Nibi appare caratterialmente diverso da Momo anche con placeholder;
- quando entrambi sono presenti la Radura sembra più viva senza diventare caotica;
- almeno uno shared event fa percepire un rapporto, non due NPC indipendenti;
- il cambiamento della categoria di legame sembra conseguenza di ciò che è successo;
- il giocatore è curioso di vedere un'altra interazione.

Non iniziare M4 finché Nibi e il legame non sono stati osservati nel browser e in almeno un return report condiviso.

## M3.5 — Creature Raising vertical slice

**Stato:** design da definire dopo il playtest M3. NON implementation-ready.

**Domanda da validare:** il giocatore prova piacere nel creare condizioni e scoprire come queste cambiano concretamente una creatura nel tempo?

Obiettivo:

- trasformare la fantasy di "allevare" in una prima meccanica reale;
- usare Momo come soggetto pilota;
- collegare almeno una scelta del giocatore a un cambiamento persistente e percepibile;
- dimostrare che habitat/cibo/relazioni/esperienze possono essere input dello sviluppo senza micromanagement.

Il design dovrà scegliere il minimo sottoinsieme fra:

- offerta/cibo;
- habitat;
- relazione con Nibi;
- interazione diretta;
- esplorazione;
- eventi vissuti.

E scegliere **un solo tipo principale di outcome** da validare per primo, per esempio:

- comportamento appreso;
- nuova preferenza;
- tratto manifestato;
- cambiamento/variante visiva;
- altra conseguenza persistente equivalente.

Questi esempi sono OPEN, non requisiti implementativi.

Niente in M3.5 finché non deciso:

- breeding;
- genetica complessa;
- eredità dei tratti;
- alberi evolutivi generici;
- molte forme/varianti;
- terza creatura;
- economia espansa;
- sistemi di bisogno punitivi.

Success criteria da definire nel design, ma il minimo è:

- il giocatore compie una scelta comprensibile;
- la creatura reagisce senza essere comandata direttamente;
- la conseguenza modifica qualcosa di persistente e osservabile;
- il giocatore riesce a collegare scelta e risultato senza vedere formule;
- nasce curiosità verso altre possibili traiettorie di crescita.

**M4 resta bloccata finché questo vertical slice non è stato progettato e playtestato.**

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

M4 deve generalizzare sistemi già dimostrati, incluso il primo vero raising loop, non inventare astrattamente un modello di crescita futuro.

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

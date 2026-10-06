# Creature Sanctuary — Technical Spec

**Status:** M0 approvata, pre-implementation.

Questo documento definisce lo stack e i confini architetturali iniziali. Le scelte possono essere riviste deliberatamente se il prototipo dimostra un problema reale.

## Stack approvato

- **Target:** browser/web app, desktop-first responsive;
- **Language:** TypeScript;
- **UI shell:** React 19.x;
- **Build/dev:** Vite 8.x;
- **2D rendering:** PixiJS 8.x;
- **Tests:** Vitest 5.x;
- **Package manager:** npm;
- **Development runtime:** Node.js LTS;
- **Persistence MVP:** localStorage tramite adapter;
- **Content format:** JSON.

Usare versioni patch/minor compatibili e stabili al momento dell'implementazione. Non cambiare major autonomamente.

## Vincoli tecnici confermati

- gioco 2D;
- single-player;
- no 3D;
- no multiplayer;
- no backend obbligatorio per il prototipo;
- no AI runtime;
- offline progress calcolato al ritorno;
- contenuti data-driven;
- scene con anchor point, non pathfinding avanzato;
- costruzioni su slot, non free placement.

## Confini architetturali

### Core TypeScript

Il dominio deve funzionare senza React, PixiJS o DOM.

Contiene almeno:

- `GameState`;
- regole di transizione;
- tempo;
- RNG iniettabile;
- EventEngine;
- OfflineEngine;
- effetti su risorse/stato.

I test del core devono poter essere eseguiti in ambiente Node.

### Scene layer — PixiJS

Responsabile soltanto della rappresentazione della Radura:

- background;
- anchor point;
- creature;
- hotspot;
- piccole animazioni;
- overlay/effetti ambientali futuri.

La scena riceve uno stato/modello da visualizzare e invia intenzioni/azioni verso l'applicazione. Non possiede la logica economica o narrativa.

### UI layer — React

Responsabile di:

- shell applicativa;
- Diario;
- Bestiario;
- inventario/pannelli futuri;
- menu;
- impostazioni;
- controlli accessibilità;
- integrazione della canvas Pixi.

Per M0.5 preferire integrazione Pixi diretta e minimale. Non aggiungere Redux, Zustand o wrapper React/Pixi se non risolvono un problema concreto.

## Struttura iniziale desiderata

```text
src/
├── app/
├── core/
│   ├── state/
│   ├── time/
│   ├── random/
│   ├── events/
│   └── offline/
├── content/
│   ├── creatures/
│   ├── events/
│   ├── resources/
│   └── structures/
├── scene/
│   └── sanctuary/
├── storage/
└── ui/
    ├── diary/
    ├── bestiary/
    └── common/
```

La struttura può essere adattata se necessario, ma mantenere i confini core/scene/ui/content/storage.

## GameState

Responsabile dello stato persistente:

- risorse;
- creature sbloccate/presenti;
- stato creature;
- relazioni;
- strutture;
- progress flags;
- Bestiario;
- ultimo timestamp;
- eventi/cooldown rilevanti.

Lo stato deve essere serializzabile.

## ContentRegistry

Carica definizioni JSON di:

- creature;
- traits;
- resources;
- structures;
- events;
- exploration tables future.

Il core non deve contenere una cascata di condizioni hardcoded per singola creatura quando la regola può vivere nei dati.

## EventEngine

Responsabile di:

- verificare prerequisiti;
- calcolare candidati;
- applicare pesi;
- rispettare cooldown;
- scegliere eventi;
- applicare effetti.

## OfflineEngine

Input:

- saved state;
- lastSeenAt;
- currentTime;
- RNG quando necessario.

Output:

- nuovo stato;
- risorse aggregate;
- eventi significativi;
- Diary summary model.

Non deve simulare ogni secondo.

### M2 — implementazione minima

M2 introduce un `OfflineReconciler` stretto, testabile in Node, separato da React/Pixi.

Input minimo:

- GameState salvato;
- `savedAt` dell'envelope;
- current time;
- RandomSource;
- definizioni degli offline event M2.

Comportamento:

1. calcola `elapsed = max(0, now - savedAt)`;
2. sotto 5 minuti non genera report;
3. calcola raccolta comune di Bacche con `min(8, floor(elapsed / 15min))`;
4. determina 1 o 2 event slot in base alla durata;
5. se la ciotola è piena, seleziona prima un evento ciotola e la svuota;
6. riempie eventuali slot restanti con eventi generali eleggibili;
7. quando possibile esclude gli event id presenti nell'ultimo report;
8. applica gli effetti semplici degli eventi;
9. produce un return report strutturato;
10. NON simula le attività M1 trascorse durante l'assenza.

Il reconciler deve essere idempotente rispetto allo stesso save caricato una sola volta: dopo aver applicato il risultato, salvare immediatamente il nuovo stato/baseline per evitare doppi reward su reload.

### Stato M2

Aggiungere soltanto quanto serve:

- `resources.berries`;
- stato ciotola `empty | berry`;
- ultimo return report strutturato o null.

Return report suggerito:

- generatedAt;
- elapsedMs;
- berryGain aggregato;
- eventIds[];
- acknowledged.

Il testo degli eventi deve provenire dai contenuti tramite event id, non essere duplicato nello stato se non necessario.

### Event data M2

Schema stretto sufficiente alla milestone:

- id;
- text;
- weight;
- minElapsedMs;
- optional requiresBowlFilled;
- optional effect `berriesDelta`;
- optional effect `consumeBowl`.

Non costruire ancora condizioni/effect DSL generici.

### Save schema M2

La nuova shape richiede un bump di schema.

Preferire una migrazione mirata dal save M1 che preservi lo stato corrente di Momo e inizializzi:

- 1 Bacca;
- ciotola vuota;
- report null.

Non costruire un framework generico di migration.

Save corrotti o versioni sconosciute continuano a ricadere su uno stato iniziale sicuro.

## M1 — comportamento autonomo di Momo

M1 estende il wiring esistente senza introdurre un engine generico per tutte le creature.

### Randomness

Aggiungere una piccola interfaccia iniettabile, ad esempio `RandomSource`, con una sorgente production basata su `Math.random()` creata fuori dal core.

Il core non deve chiamare direttamente `Math.random()`.

I test devono poter fornire una sequenza random deterministica.

### Stato minimo M1

Lo stato persistente di Momo può evolvere per includere:

- `currentAnchor`;
- `currentActivityId`;
- fase `settled` oppure `moving`;
- destinazione quando in movimento;
- deadline della fase corrente;
- eventuale activity precedente necessaria al repetition control.

Non aggiungere bisogni, fame, energia, relazione, inventario o altre statistiche non richieste.

### Content M1

Aggiungere l'anchor `tall_grass`.

Il profilo delle tre attività di Momo può stare in JSON/content data con:

- id stabile;
- anchor;
- weight;
- min/max duration;
- testo/label player-facing se utile.

Questo non implica ancora un ContentRegistry o trait engine generico.

### Transizioni

Il core deve decidere:

- quando una fase è finita;
- quale attività viene dopo;
- quando inizia/finisce un movimento.

PixiJS deve soltanto rappresentare lo stato e interpolare visivamente il movimento fra anchor.

### Resume/reload

M1 non implementa la simulazione offline di M2.

Quando si carica un save con una deadline scaduta, risolvere al massimo la fase persistita necessaria a ottenere uno stato coerente e ripartire dal tempo corrente.

Non iterare attraverso minuti/ore di attività perse.

### UX player-facing

Rimuovere i pulsanti M0.5 che comandano direttamente lo spostamento di Momo.

Un testo discreto di stato è ammesso per il prototipo. Evitare popup e feed di log.

## M3 — Nibi e relazione Momo–Nibi

M3 estende il prototipo senza anticipare M4.

### Stato M3

Aggiungere soltanto:

- `nibiPhase: "unseen" | "traces" | "resident"`;
- stato comportamento Nibi nullable finché non è residente;
- `relations.momoNibi` intero 0–5.

Quando Nibi non è residente, nessun timer/comportamento Nibi deve avanzare.

### Save schema M3

Bump mirato schema 3 → schema 4.

Migrazione schema 3:

- preservare Momo;
- preservare Bacche;
- preservare ciotola;
- preservare ultimo report M2;
- inizializzare `nibiPhase = "unseen"`;
- Nibi state null;
- relazione 0.

Non costruire migration framework generico.

### Behavior scheduler

È permessa una piccola estrazione riutilizzabile delle regole già usate da Momo:

- profilo attività;
- selezione pesata;
- durata;
- repetition control;
- moving/settled;
- Clock e RandomSource iniettabili.

Obiettivo: applicare la stessa meccanica a Momo e Nibi con parametri diversi.

Non costruire un ECS, un registry universale o un sistema pensato per decine di specie.

Il comportamento Nibi viene creato soltanto al passaggio a `resident`.

### Nibi content

Profilo M3:

- `rustle_grass`: tall_grass, peso 4, 3–6 s;
- `splash_stream`: stream, peso 3, 4–7 s;
- `visit_tree`: tree, peso 3, 3–5 s;
- movement duration: 2 s;
- initial activity on arrival: `visit_tree`.

### Discovery / arrival

Estendere il return report con una discovery opzionale, per esempio `discoveryId`, separata dagli eventIds ricorrenti.

Regole:

- `unseen` + first valid return → `nibi_tracks`, phase `traces`;
- `traces` + valid return + bowl `berry` → `nibi_arrival`, consume bowl, phase `resident`, initialize Nibi behavior and relation 0.

`nibi_arrival` sostituisce il normale bowl event di quel return e non deve essere accompagnato da altri eventi ricorrenti.

`nibi_tracks` può convivere con il normale M2 return loop.

La discovery deve essere one-shot per stato: reload immediato non deve riapplicarla.

### Relazione

Aggiungere helper puro per:

- clamp 0–5;
- applicare delta;
- mappare valore → categoria qualitativa.

Il numero non deve essere mostrato nella UI player-facing.

### Shared offline events

Estendere in modo stretto i dati evento M3 con campi opzionali sufficienti:

- `kind: "general" | "bowl" | "shared"`;
- `minRelation`;
- `maxRelation`;
- `relationshipDelta`.

Non introdurre DSL generica.

Dopo Nibi residente:

- evento bowl mantiene priorità se bowl piena;
- se rimane uno slot, selezionare al massimo un shared event eleggibile prima dei general event;
- shared event applica il relationship delta una sola volta;
- repetition control esistente continua a valere.

### Return report

Può evolvere per contenere:

- `eventIds[]`;
- optional `discoveryId`;
- dati M2 già esistenti.

Il Diario risolve il testo della discovery dai contenuti.

### Rendering/UI

Pixi:

- renderizza Nibi solo se residente;
- usa placeholder chiaramente distinguibile da Momo;
- interpola il suo movimento ma non decide comportamento/relazione.

React:

- mostra categoria qualitativa "Legame Momo–Nibi" solo quando Nibi è residente;
- non mostra il numero;
- nessun comando diretto sulle creature.

## M3.5 — Creature Raising vertical slice

**Status tecnico:** non implementation-ready. Prima va chiuso il design.

Questa milestone deve validare il primo cambiamento persistente di una creatura causato indirettamente dalle condizioni create dal giocatore.

Vincoli già approvati:

- creature raising è parte centrale della fantasy;
- il giocatore influenza, non micromanage;
- input plausibili includono cibo, habitat, relazioni, eventi ed esplorazioni;
- il risultato deve essere player-perceivable e persistente;
- niente breeding/genetica complessa;
- niente albero evolutivo generico prima di una decisione di design;
- il sistema deve restare serializzabile, data-driven dove utile e testabile con Clock/RNG se necessario.

Prima del Codex handoff M3.5 servono decisioni esplicite su:

- input esatti;
- stato persistente minimo;
- primo outcome su Momo;
- feedback/UI;
- reversibilità/permanenza;
- condizioni di successo del playtest.

Non implementare M3.5 mentre si sta eseguendo M3.

## SaveSystem

Definire un'interfaccia `SaveAdapter`.

Implementazione MVP:

- localStorage;
- envelope con `schemaVersion`;
- timestamp;
- gestione JSON corrotto/fallback;
- elapsed negativo portato a zero o gestito in modo sicuro.

L'uso di un adapter deve permettere in futuro IndexedDB, file locale o cloud senza cambiare il dominio.

## Modello creatura concettuale

Campi possibili:

- id;
- speciesId;
- displayName;
- traits[];
- currentState;
- currentAnchor;
- unlocked;
- present;
- relation map o riferimenti;
- discoveredBehaviors;
- timestamps/cooldown.

Non implementare campi non necessari alla milestone corrente.

## Modello evento concettuale

Campi possibili:

- id;
- category;
- requirements;
- weight;
- cooldown;
- text template;
- effects;
- priority;
- onceOnly.

Il motore deve restare sufficientemente generico da non contenere `if (creature === "Momo")` per ogni evento.

## Determinismo e testabilità

Devono essere iniettabili:

- `currentTime`;
- RNG/seed o sorgente random sostituibile;
- stato iniziale;
- storage adapter nei test del save.

Il comportamento non deve dipendere direttamente da `Date.now()` o `Math.random()` dentro le regole di dominio.

## Sicurezza temporale

Per il prototipo basta:

- evitare crash;
- evitare elapsed negativi;
- applicare un limite offline configurabile quando introdotto.

Strategie anti-cheat definitive sono fuori scope.

## Performance

Lo scope iniziale è molto piccolo.

Non ottimizzare prematuramente per centinaia di creature simultanee.

## Asset

M0.5 e M1 possono usare placeholder.

Target futuro:

- background 2D;
- sprite/illustrazioni creature;
- poche pose/animazioni;
- overlay eventuali.

Gli asset definitivi non devono bloccare la validazione tecnica.

## Cose esplicitamente non necessarie per M0.5

- backend;
- database;
- autenticazione;
- cloud save;
- PWA obbligatoria;
- Redux/Zustand;
- ECS;
- physics engine;
- pathfinding;
- service worker;
- telemetria;
- pipeline asset complessa.

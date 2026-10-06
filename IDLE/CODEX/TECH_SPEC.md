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

# Creature Sanctuary — Technical Spec Checkpoint

**Status:** pre-implementation. Lo stack non è ancora deciso.

Questo documento definisce vincoli e forma desiderata del sistema, non una tecnologia finale.

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

## Moduli concettuali

### GameState

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

### ContentRegistry

Carica definizioni di:

- creature;
- traits;
- resources;
- structures;
- events;
- exploration tables.

Il formato esatto (JSON/TS objects/YAML/etc.) dipenderà dallo stack scelto.

### EventEngine

Responsabile di:

- verificare prerequisiti;
- calcolare candidati;
- applicare pesi;
- rispettare cooldown;
- scegliere eventi;
- applicare effetti.

### OfflineEngine

Input:

- saved state;
- lastSeenAt;
- currentTime.

Output:

- nuovo stato;
- risorse aggregate;
- eventi significativi;
- Diary summary model.

Non deve simulare ogni secondo.

### SaveSystem

Requisiti iniziali:

- persistenza locale;
- schema versionato;
- timestamp;
- gestione errori/fallback;
- possibilità futura di migration.

Cloud save è fuori scope finché non viene deciso.

### Scene/UI

La Radura è una scena 2D con:

- background;
- anchor point;
- creature visualizzate sugli anchor;
- hotspot;
- slot strutture;
- accesso a Diario/Bestiario.

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

## Determinismo

Per debugging e test è utile poter iniettare:

- currentTime;
- random seed / RNG;
- stato iniziale.

Non è ancora deciso se la build finale userà RNG seeded, ma il core dovrebbe essere testabile.

## Sicurezza temporale

L'orologio di sistema può essere manipolato.

Per il prototipo basta evitare crash e elapsed negativi. La strategia anti-cheat definitiva è una questione aperta e non deve complicare la prima milestone.

## Performance

Lo scope iniziale è molto piccolo.

Non ottimizzare prematuramente per centinaia di creature simultanee.

## Asset

Target:

- background 2D;
- sprite/illustrazioni creature;
- poche pose/animazioni;
- overlay eventuali.

Il formato dipenderà dalla tecnologia scelta.

## Tecnologia — NON DECISA

Prima di iniziare l'implementazione va scelta esplicitamente almeno:

- piattaforma target;
- stack/framework;
- rendering approach;
- formato contenuti;
- toolchain di build/test.

Non scegliere automaticamente un engine solo perché il progetto è chiamato "gioco".

# Creature Sanctuary — Decision Log

Questo file contiene soltanto decisioni sufficientemente solide da trattare come vincoli fino a nuova revisione.

## D-001 — Il gioco sarà 2D

**Decisione:** niente 3D.

Conseguenze:

- sfondi/aree illustrate;
- sprite o cut-out semplici;
- animazioni limitate;
- focus su leggibilità e contenuto data-driven.

## D-002 — Scope da solo developer assistito da AI

Il progetto deve restare realistico per una singola persona che utilizza ChatGPT/Codex come supporto.

Una feature tecnicamente impressionante ma ingestibile non è coerente con il progetto.

## D-003 — Creature Sanctuary non è un open world

Il giocatore non controlla un avatar in una mappa liberamente percorribile.

Le aree sono schermate/scene 2D con hotspot e posizioni predefinite.

## D-004 — Niente pathfinding avanzato per il core

Le creature possono spostarsi tra anchor point/slot predefiniti.

## D-005 — Offline progress senza simulazione secondo-per-secondo

Gli eventi offline vengono ricostruiti/calcolati al ritorno attraverso tempo trascorso, condizioni e tabelle.

## D-006 — Le creature non vengono comprate

Le nuove specie vengono attirate, incontrate o scoperte attraverso condizioni del santuario ed eventi.

## D-007 — Personalità semplice

Pochi tratti modificano pesi e disponibilità degli eventi.

Non costruire una vera AI psicologica.

## D-008 — Relazioni semplici

Le relazioni possono essere rappresentate internamente con valori e soglie qualitative.

Nessun social simulation engine complesso è richiesto.

## D-009 — Costruzione iniziale tramite slot

Niente placement libero nell'MVP.

## D-010 — Eventi author-driven

Il contenuto narrativo viene preparato in anticipo.

Nessuna dipendenza da AI generativa runtime.

## D-011 — Il prototipo deve essere piccolo

Prima milestone concettuale:

- una Radura;
- Momo;
- salvataggio;
- offline;
- circa 10 eventi;
- risorse minime.

Solo dopo si aggiungono Nibi, relazioni e ulteriori sistemi.

## D-012 — Il gioco non deve punire l'assenza

Le creature non muoiono e il giocatore non perde il proprio santuario perché non apre il gioco.

## D-013 — Il contenuto deve essere data-driven

Creature, eventi, oggetti e strutture dovrebbero poter essere estesi principalmente attraverso dati/contenuti, senza modificare il core ogni volta.

## D-014 — Il concept corrente è un checkpoint

Questi documenti NON sono un GDD definitivo.

Le decisioni possono essere cambiate deliberatamente durante la progettazione.

## D-015 — Target iniziale: browser, desktop-first responsive

Il primo target eseguibile è una web app nel browser.

La UI viene progettata desktop-first ma senza impedire un adattamento responsive successivo.

Packaging desktop nativo e mobile restano decisioni future e non devono condizionare l'MVP.

## D-016 — Stack M0

Lo stack iniziale è:

- TypeScript;
- React 19.x per shell e UI;
- Vite 8.x per sviluppo/build;
- PixiJS 8.x per rendering della scena 2D;
- Vitest 5.x per test;
- npm come package manager;
- Node.js LTS come runtime di sviluppo.

Non introdurre un game engine più ampio senza una ragione emersa dal prototipo.

## D-017 — Separazione netta tra core, scena e UI

Il core di gameplay deve essere TypeScript puro e testabile senza browser/rendering.

Responsabilità:

- **core:** stato, tempo, RNG, eventi, offline reconciliation, regole;
- **scene:** PixiJS, background, creature, anchor point, hotspot ed effetti visivi;
- **ui:** React, Diario, Bestiario, menu, pannelli e controlli.

Il core non deve importare React, PixiJS o API DOM.

## D-018 — Persistenza locale tramite adapter

Per il prototipo il salvataggio usa localStorage, ma soltanto dietro un'interfaccia `SaveAdapter`.

Il formato di save deve essere versionato fin dall'inizio.

Cloud save, account e backend sono fuori scope.

## D-019 — Contenuti in JSON

Creature, eventi, risorse e strutture iniziano come file JSON separati dal core.

TypeScript definisce i tipi e il codice che li consuma.

La validazione strutturale più robusta dei contenuti viene introdotta quando richiesta dalla milestone di content architecture.

## D-020 — Rendering React + Pixi senza accoppiamento del dominio

React ospita la canvas Pixi e l'interfaccia applicativa, ma la scena Pixi non deve diventare il contenitore delle regole di gioco.

Per il primo prototipo non è necessario introdurre wrapper o state library aggiuntive se l'integrazione diretta è sufficiente.

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

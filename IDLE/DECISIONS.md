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


## D-021 — M1 è observation-first

Per M1 Momo agisce autonomamente.

La UI destinata al giocatore non offre comandi diretti per spostarlo fra gli anchor. Eventuali controlli di debug non fanno parte dell'esperienza player-facing.

La milestone deve validare la sensazione "Momo fa cose sue", non la capacità del giocatore di impartire ordini.

## D-022 — Tre attività authored per il prototipo M1

M1 usa un set volutamente piccolo:

- sonnecchia sotto l'Albero;
- osserva il Ruscello;
- esplora l'Erba Alta.

Le attività hanno pesi e intervalli di durata authored. Evitare, quando possibile, la ripetizione immediata della stessa attività.

Pesi e durate sono parametri provvisori da playtest, non bilanciamento definitivo.

## D-023 — Niente trait engine generico in M1

I tratti di Momo restano dati di identità, ma M1 non costruisce un sistema generico che converta automaticamente ogni tratto in regole.

Il profilo authored di Momo esprime direttamente "timido" e "curioso".

"Goloso" viene mantenuto ma non produce effetti finché non esiste un sistema cibo/bacche reale.


## D-024 — M1 validata abbastanza da proseguire

Dopo il playtest umano del prototipo placeholder, il comportamento autonomo di Momo è stato giudicato sufficiente per procedere.

Questo non congela pacing, pesi o resa visiva di M1. Significa soltanto che la premessa "Momo può sembrare almeno un po' vivo con sistemi piccoli" non è stata smentita.

## D-025 — M2 usa una sola risorsa attiva

Per M2 entra in gioco soltanto **Bacche**.

Legnetti e Fibre restano nel concept ma sono differiti finché esiste un uso reale per loro.

Il prototipo parte con 1 Bacca.

## D-026 — M2 usa offline reconciliation compresso

M2 non simula le attività di Momo una per una durante l'assenza.

Regole di prototipo:

- report da 5 minuti di assenza;
- massimo 1 evento sotto 30 minuti;
- massimo 2 eventi da 30 minuti in su;
- raccolta comune: 1 Bacca ogni 15 minuti completi;
- massimo 8 Bacche da raccolta comune per ritorno.

I numeri sono parametri di playtest e possono essere ribilanciati.

## D-027 — La ciotola è la prima modifica attiva

Il primo sink/azione del giocatore è lasciare 1 Bacca nella ciotola.

Se resta almeno 5 minuti offline, la Bacca viene consumata e il report deve contenere un evento ciotola.

Questa è la prima espressione meccanica del tratto `goloso` di Momo.

## D-028 — Diario M2 conserva solo l'ultimo ritorno

M2 non implementa una timeline storica completa.

Conserva l'ultimo return report, lo apre automaticamente una volta e permette di riaprirlo tramite un controllo Diario.

## D-029 — Gli eventi offline M2 restano un sistema stretto

M2 usa eventi data-driven limitati alle necessità del return loop: peso, minimo tempo offline, requisito ciotola ed effetti semplici.

Non anticipare un EventEngine generale, un linguaggio di condizioni/effetti o l'architettura completa prevista più avanti.


## D-030 — M2 accettata per proseguire

Dopo implementazione e verifica del return loop, il progetto procede a M3 su indicazione esplicita dell'utente.

Questo non congela il bilanciamento di Bacche, frequenze o testi del Diario. M2 resta materiale di prototipo, ma il return loop è considerato sufficientemente valido per testare la presenza di una seconda creatura.

## D-031 — Nibi arriva tramite una progressione in due fasi

Nibi non viene comprato né appare immediatamente.

M3 usa:

- `unseen` → primo ritorno valido: tracce;
- `traces` → ritorno valido con Bacca nella ciotola: arrivo e permanenza.

L'arrivo consuma la Bacca e sostituisce il normale bowl event di quel ritorno.

## D-032 — Nibi è più mobile di Momo

Nibi usa tre attività authored e un movimento provvisorio di 2 secondi.

Il suo profilo deve comunicare `vivace`, `socievole` e `disordinato` senza introdurre un trait engine generico.

## D-033 — Relazione Momo–Nibi M3 su scala 0–5

M3 usa una singola relazione condivisa e non direzionale, clampata fra 0 e 5.

Il numero resta nascosto.

Categorie player-facing:

- 0: si stanno studiando;
- 1–2: si stanno abituando;
- 3–4: si cercano;
- 5: amici.

Non esiste decadimento in M3.

## D-034 — Gli eventi condivisi modificano il legame

Dopo l'arrivo di Nibi, gli shared event possono applicare delta `+1` o `-1` e diventare eleggibili in base a soglie di relazione.

Il sistema deve dimostrare che la relazione cambia il contenuto disponibile, non soltanto un'etichetta UI.

## D-035 — M3 non è ancora la content architecture definitiva

È consentita una generalizzazione minima del behavior scheduler per gestire Momo e Nibi senza duplicazione fragile.

Non costruire ancora il ContentRegistry generale, EventEngine universale, DSL di requisiti/effetti o schema definitivo previsti per M4.

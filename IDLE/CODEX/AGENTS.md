# AGENTS.md — Creature Sanctuary

Queste istruzioni guidano Codex e altri agenti che lavoreranno nel repository.

## Prima di modificare il progetto

Leggere nell'ordine:

1. `IDLE/GAME_VISION.md`
2. `IDLE/DECISIONS.md`
3. `IDLE/DESIGN.md`
4. `IDLE/ECONOMY.md`
5. `IDLE/CONTENT.md`
6. `IDLE/OPEN_QUESTIONS.md`
7. `IDLE/CODEX/TECH_SPEC.md`
8. `IDLE/CODEX/MILESTONES.md`

## Regola principale

Non trasformare un'idea aperta in una decisione definitiva senza istruzione esplicita.

Se una scelta è in `OPEN_QUESTIONS.md`, trattarla come non decisa.

## Stack M0 approvato

Per M0.5 e milestone successive usare, salvo revisione esplicita:

- TypeScript;
- React 19.x;
- Vite 8.x;
- PixiJS 8.x;
- Vitest 5.x;
- npm;
- contenuti JSON;
- localStorage tramite `SaveAdapter`.

Non sostituire autonomamente questo stack con Phaser, Unity, Godot o altro engine/framework.

## Confini obbligatori

Il core di dominio deve restare TypeScript puro.

Il core NON deve importare:

- React;
- PixiJS;
- API DOM;
- localStorage direttamente.

Responsabilità:

- core = stato/regole/eventi/offline/tempo/RNG;
- scene = rendering Pixi;
- ui = React;
- storage = adapter di persistenza;
- content = dati JSON.

Preferire dipendenze iniettate per tempo, RNG e storage.

## Priorità

1. preservare la fantasy di creature-raising: le creature sono il centro, il santuario è uno strumento;
2. mantenere scope realistico;
3. costruire il minimo sistema verificabile;
4. preferire architettura semplice e data-driven;
5. mantenere salvataggi e stato deterministici/testabili;
6. aggiungere complessità solo quando una milestone la richiede.

Una risorsa, struttura o sistema gestionale non deve diventare automaticamente un fine della progressione. Quando la milestone lo richiede, deve servire cura, scoperta, attrazione, esperienza o sviluppo delle creature.

## Cose da NON introdurre autonomamente

- 3D;
- multiplayer;
- backend obbligatorio;
- AI generativa runtime;
- pathfinding avanzato;
- physics engine non necessario;
- open world;
- placement libero;
- breeding/genetica complessa prima di una decisione esplicita;
- alberi evolutivi/forme inventati autonomamente;
- gacha;
- ads;
- monetizzazione;
- valute aggiuntive;
- prestige;
- login/account system;
- Redux/Zustand o altre state library senza necessità dimostrata;
- ECS;
- service worker/PWA prima che venga deciso;
- dipendenze pesanti senza motivo.

## Content first

Creature, strutture, risorse ed eventi devono essere definiti come dati quando possibile.

Aggiungere una creatura non dovrebbe richiedere nuove condizioni hardcoded nel core se la stessa logica può essere espressa tramite schema dati.

## Eventi

Gli eventi devono supportare almeno il concetto di:

- id stabile;
- prerequisiti;
- peso/probabilità;
- cooldown opzionale;
- effetti;
- testo;
- categorie/tags.

Non anticipare uno schema definitivo prima della milestone tecnica corrispondente.

## Offline

Non creare una simulazione real-time completa in background.

Il modello atteso è "reconcile on resume":

- salva timestamp;
- al caricamento calcola elapsed time;
- genera/aggrega risultati;
- aggiorna lo stato;
- mostra il Diary summary.

## Lavoro incrementale

Ogni milestone deve produrre qualcosa di eseguibile e verificabile.

Evitare mega-refactor prematuri e architetture pensate per centinaia di feature che ancora non esistono.

Implementare soltanto lo scope della milestone richiesta. Se una soluzione più generale è chiaramente necessaria, mantenerla comunque minima.

## Testing

Dare priorità a test per:

- serializzazione/salvataggio;
- calcolo tempo offline;
- selezione eventi;
- prerequisiti;
- effetti sulle risorse;
- migrazione versioni save quando introdotta.

I test del core devono poter girare senza inizializzare React o Pixi.

## Documentazione

Quando una decisione progettuale viene presa esplicitamente:

- aggiornare `DECISIONS.md`;
- rimuovere o aggiornare la corrispondente voce in `OPEN_QUESTIONS.md`;
- aggiornare `TECH_SPEC.md` se ha impatto tecnico.

Non cambiare la visione del gioco attraverso il codice senza aggiornare i documenti.

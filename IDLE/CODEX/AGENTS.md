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

## Priorità

1. mantenere scope realistico;
2. costruire il minimo sistema verificabile;
3. preferire architettura semplice e data-driven;
4. mantenere salvataggi e stato deterministici/testabili;
5. aggiungere complessità solo quando una milestone la richiede.

## Cose da NON introdurre autonomamente

- 3D;
- multiplayer;
- backend obbligatorio;
- AI generativa runtime;
- pathfinding avanzato;
- physics engine non necessario;
- open world;
- placement libero;
- breeding/genetica complessa;
- gacha;
- ads;
- monetizzazione;
- valute aggiuntive;
- prestige;
- login/account system;
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
- genera/aggregra risultati;
- aggiorna lo stato;
- mostra il Diary summary.

## Lavoro incrementale

Ogni milestone deve produrre qualcosa di eseguibile e verificabile.

Evitare mega-refactor prematuri e architetture pensate per centinaia di feature che ancora non esistono.

## Testing

Dare priorità a test per:

- serializzazione/salvataggio;
- calcolo tempo offline;
- selezione eventi;
- prerequisiti;
- effetti sulle risorse;
- migrazione versioni save quando introdotta.

## Documentazione

Quando una decisione progettuale viene presa esplicitamente:

- aggiornare `DECISIONS.md`;
- rimuovere o aggiornare la corrispondente voce in `OPEN_QUESTIONS.md`;
- aggiornare `TECH_SPEC.md` se ha impatto tecnico.

Non cambiare la visione del gioco attraverso il codice senza aggiornare i documenti.

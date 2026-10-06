# Creature Sanctuary — Milestones

Le milestone sono ordinate per validare il rischio principale prima di produrre molto contenuto.

## M0 — Foundation decision

**Obiettivo:** scegliere il minimo stack tecnico.

Da decidere prima del coding sostanziale:

- target iniziale;
- framework/runtime;
- rendering 2D;
- formato dei contenuti;
- persistenza locale;
- test runner.

Output:

- progetto avviabile;
- README tecnico o aggiornamento TECH_SPEC;
- nessuna feature di gameplay obbligatoria.

## M1 — Momo in una Radura

**Domanda da validare:** possiamo far percepire una creatura viva con pochissima tecnologia?

Scope:

- una scena Radura;
- Momo;
- pochi anchor point;
- 2–3 stati visivi/comportamentali;
- timer semplice;
- stato salvabile;
- reload corretto.

Niente:

- Nibi;
- relazioni;
- Bestiario completo;
- meteo;
- mistero.

Success criteria:

- Momo cambia attività/posizione in modo plausibile;
- il suo stato sopravvive a reload;
- il progetto è semplice da modificare.

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

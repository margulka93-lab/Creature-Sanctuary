# Creature Sanctuary — Content Checkpoint

**Status:** contenuti concettuali. Nomi, quantità e dettagli possono cambiare.

## Prima area — La Radura

Una conca naturale circondata da alberi alti.

Hotspot previsti:

- grande albero;
- ruscello;
- rifugio parzialmente crollato;
- erba alta;
- zona cibo;
- sentiero coperto verso il bosco.

La Radura deve suggerire fin dall'inizio che esistono altre zone, senza presentare un pulsante "sblocca bioma".

## Creature emerse finora

### Momo — Puffel

Prima creatura.

Aspetto concettuale:

- piccolo corpo rotondo;
- pelo crema;
- zampe corte;
- occhi grandi;
- coda piumosa.

Tratti:

- timido;
- curioso;
- goloso.

Comportamenti:

- dorme vicino all'albero;
- nasconde oggetti;
- ama le bacche;
- esplora gradualmente la radura.

#### Profilo osservabile M1

Per la prima validazione Momo usa soltanto tre comportamenti:

| id | comportamento | anchor | peso prototipo | durata prototipo |
| --- | --- | --- | ---: | --- |
| `doze_tree` | sonnecchia sotto l'Albero | tree | 5 | 8–14 s |
| `watch_stream` | osserva il Ruscello | stream | 3 | 5–9 s |
| `explore_grass` | esplora l'Erba Alta | tall_grass | 2 | 4–7 s |

Questi valori servono a leggere il comportamento durante il prototipo e non sono numeri di bilanciamento definitivo.

L'Albero deve risultare chiaramente il luogo preferito. Ruscello ed Erba Alta mostrano invece che la curiosità può vincere temporaneamente sulla prudenza.

Feedback placeholder accettabile:

- testo/stato discreto che descrive ciò che Momo sta facendo;
- pose, simboli o variazioni semplici della forma placeholder;
- movimento visivo fra anchor.

Non servono asset finali né dialoghi/popup. La scena deve restare osservabile senza interrompere il giocatore.

Il tratto `goloso` non modifica ancora il comportamento: sarà collegato a cibo/bacche quando quel sistema esisterà.

Funzione di design: creare affezione e insegnare che la creatura è un individuo, non un'unità produttiva.

### Nibi — Spriglet

Aspetto concettuale:

- piccolo incrocio visivo cervo/coniglio;
- pelliccia nocciola;
- germogli sulla testa.

Tratti:

- socievole;
- vivace;
- disordinato.

Possibile arrivo:

- Momo presente;
- bacche disponibili;
- rifugio almeno parzialmente riparato.

Funzione: introdurre relazioni e interazioni.

### Piko — Pebblin

Aspetto concettuale:

- piccolo corpo simile a una pietra;
- corazza irregolare;
- dettagli rame;
- occhi luminosi.

Tratti:

- pigro;
- territoriale;
- affidabile.

Possibile introduzione: inizialmente sembra una pietra dello scenario e cambia posizione tra una sessione e l'altra.

Funzione: mostrare che le creature possono entrare nel mondo in modi differenti.

### Lumi — Glowtail

Aspetto concettuale:

- quadrupede piccolo e snello;
- pelliccia blu-grigia;
- lunga coda traslucida luminosa;
- occhi argentati.

Tratti:

- notturna;
- diffidente;
- curiosa.

Possibile condizione:

- Pietra Lucida presente;
- assenza/offline sufficiente;
- eventi notturni.

Funzione: prima creatura legata fortemente al tempo e al mistero.

### Brum — Mossback

Aspetto concettuale:

- più grande delle creature iniziali;
- corpo robusto;
- muschio sul dorso;
- aria perennemente scocciata.

Tratti:

- protettivo;
- testardo;
- tranquillo.

Possibile ruolo: spostare un ostacolo e aprire l'accesso narrativo al Bosco.

**Nota di scope:** Brum non è necessario nell'MVP iniziale.

### Wisp — creatura segreta

Aspetto concettuale:

- minuscola;
- falena/spirito;
- bianca e quasi trasparente;
- grandi ali e antenne luminose.

Non è necessariamente "reclutabile".

Possibile funzione: prima prova che esistono creature che non seguono le regole normali.

**Nota:** contenuto segreto, da introdurre solo dopo che il loop base funziona.

## Relazioni già immaginate

Non vincolanti, ma utili come esempi:

- Momo + Nibi: amicizia naturale;
- Nibi + Piko: rivalità/comic friction;
- Momo + Brum: rapporto protettivo;
- Lumi + Momo: curiosità reciproca.

## Strutture iniziali

Candidate:

### Rifugio

Aumenta sicurezza e abilita eventi.

### Ciotola / area cibo

Permette di lasciare una risorsa e influenzare arrivi/comportamenti.

### Angolo morbido

Idea emersa ma non necessaria per il primo prototipo.

## Eventi esempio

Gli eventi saranno scritti a mano e parametrizzati.

Esempi:

- Nibi mangia una bacca nascosta da Momo;
- Momo segue Nibi al ruscello;
- Piko cambia posizione mentre il giocatore è assente;
- una Pietra Lucida viene spostata;
- compaiono impronte;
- una creatura dorme in un luogo insolito;
- una tempesta modifica la Radura;
- qualcosa si muove vicino al sentiero;
- tutte le creature si svegliano contemporaneamente.

## Prima anomalia

Idea emersa:

**Frammento 01**

Un oggetto inizialmente scambiato per Pietra Lucida mostra una struttura geometrica impossibile.

Possibile testo:

> Le creature sembrano accorgersi della sua presenza prima di noi.

Questa idea appartiene alla trama lunga e non è richiesta per l'MVP.

## Possibili aree future

- Bosco;
- Lago;
- Grotte;
- Palude;
- Montagna;
- Rovine;
- area sconosciuta.

Questi biomi sono direzioni creative, non contenuti confermati.

## Target contenuti realistico

Una versione completa ipotetica potrebbe restare nell'ordine di:

- circa 5 aree illustrate;
- circa 30–40 creature;
- circa 100–200 eventi;
- circa 20 strutture;
- circa 40–50 oggetti.

Queste quantità sono orientative, non scope approvato.

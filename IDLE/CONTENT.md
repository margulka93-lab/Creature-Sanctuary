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

Stato iniziale M1: Momo parte in `doze_tree` sotto l'Albero. Il movimento fra anchor mantiene provvisoriamente i 3 secondi già usati in M0.5; anche questo valore resta da playtestare.

L'Albero deve risultare chiaramente il luogo preferito. Ruscello ed Erba Alta mostrano invece che la curiosità può vincere temporaneamente sulla prudenza.

Feedback placeholder accettabile:

- testo/stato discreto che descrive ciò che Momo sta facendo;
- pose, simboli o variazioni semplici della forma placeholder;
- movimento visivo fra anchor.

Non servono asset finali né dialoghi/popup. La scena deve restare osservabile senza interrompere il giocatore.

Il tratto `goloso` non modifica ancora il comportamento: sarà collegato a cibo/bacche quando quel sistema esisterà.

Funzione di design: creare affezione e insegnare che la creatura è un individuo, non un'unità produttiva.

#### Hook di crescita futuri — OPEN

Momo sarà il primo soggetto del vertical slice di creature raising. Le sue caratteristiche già emerse possono diventare input/risultati di sviluppo:

- preferenza per l'Albero;
- curiosità verso Ruscello/Erba Alta;
- forte interesse per le Bacche;
- tendenza a nascondere oggetti;
- rapporto con Nibi;
- future esperienze di esplorazione.

Non è ancora deciso quali di questi producano cambiamenti permanenti, comportamenti appresi o varianti/forme. Non implementare autonomamente un'evoluzione di Momo finché M3.5 non la definisce.

### Nibi — Spriglet

Aspetto concettuale:

- piccolo incrocio visivo cervo/coniglio;
- pelliccia nocciola;
- germogli sulla testa.

Tratti:

- socievole;
- vivace;
- disordinato.

#### Arrivo M3

Il requisito "rifugio riparato" resta un'idea futura e non viene usato in M3.

Progressione M3:

1. primo ritorno valido dopo l'attivazione M3 → `nibi_tracks`;
2. ritorno successivo con tracce già scoperte + Bacca nella ciotola → `nibi_arrival`;
3. Nibi diventa residente.

Testi discovery:

- `nibi_tracks`  
  "Vicino al sentiero sono comparse impronte leggere che non appartengono a Momo. Si fermano appena prima della Radura."

- `nibi_arrival`  
  "Le impronte stavolta arrivano fino alla ciotola. Poco oltre, un piccolo Spriglet color nocciola osserva Momo senza alcuna intenzione di andarsene."

#### Profilo osservabile M3

| id | comportamento | anchor | peso prototipo | durata prototipo |
| --- | --- | --- | ---: | --- |
| `rustle_grass` | si infila nell'Erba Alta | tall_grass | 4 | 3–6 s |
| `splash_stream` | gioca vicino al Ruscello | stream | 3 | 4–7 s |
| `visit_tree` | torna a curiosare vicino all'Albero | tree | 3 | 3–5 s |

Movimento fra anchor: **2 secondi**, più rapido di Momo.

Stato iniziale quando diventa residente: `visit_tree` presso l'Albero.

Nibi deve risultare più mobile e impulsivo di Momo anche con placeholder semplici.

Tratti espressi in M3:

- `vivace` → soste più corte e movimento più rapido;
- `socievole` → eventi condivisi frequenti una volta residente;
- `disordinato` → tono di alcuni shared event.

Funzione: introdurre relazioni e interazioni senza trasformare le creature in unità controllabili. La relazione con Nibi sarà anche uno dei primi input reali da poter usare successivamente nel creature raising, ma M3 non deve ancora inventarne gli effetti di sviluppo.

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

- Momo + Nibi: prima relazione implementata in M3;
- Nibi + Piko: rivalità/comic friction futura;
- Momo + Brum: rapporto protettivo futuro;
- Lumi + Momo: curiosità reciproca futura.

### Eventi condivisi Momo–Nibi M3

Gli eventi condivisi entrano nel normale pool offline solo dopo che Nibi è residente.

1. `pair_cautious_circle` — peso 4, relazione 0–1, delta +1  
   "Nibi ha girato due volte intorno a Momo prima di sedersi. Momo ha fatto finta di non guardarlo."

2. `pair_root_squeeze` — peso 2, relazione 0–3, delta -1  
   "Nibi ha provato a infilarsi sotto le radici accanto a Momo. Dopo un minuto Momo si è alzato e se n'è andato con grande dignità."

3. `pair_stream_follow` — peso 3, relazione 1–5, delta +1  
   "Momo ha seguito Nibi fino al Ruscello, mantenendo per tutto il tragitto una distanza che evidentemente considerava casuale."

4. `pair_grass_chase` — peso 3, relazione 1–5, delta +1  
   "Per un po' l'Erba Alta si è mossa in due direzioni contemporaneamente. Quando sono riemersi, Nibi sembrava felicissimo e Momo molto meno contrario di quanto volesse mostrare."

5. `pair_leaf_mess` — peso 2, relazione 2–5, delta +1  
   "Nibi ha trascinato una quantità assurda di foglie vicino all'Albero. Momo le ha spostate una per una. Nibi ha ricominciato."

6. `pair_shared_nap` — peso 2, relazione 3–5, delta +1  
   "Momo e Nibi si sono addormentati sotto lo stesso tratto d'ombra, abbastanza vicini da sfiorarsi senza accorgersene."

Il valore di relazione viene clampato fra 0 e 5.

Questi eventi non aggiungono risorse in M3: il loro lavoro è cambiare e raccontare il rapporto.

## Strutture iniziali

Candidate:

### Rifugio

Aumenta sicurezza e abilita eventi.

### Ciotola / area cibo

Permette di lasciare una risorsa e influenzare arrivi/comportamenti.

#### Versione M2

La ciotola è presente nella Radura come hotspot/slot fisso.

- vuota all'inizio;
- il giocatore può lasciare 1 Bacca;
- la Bacca resta visibile finché non viene consumata;
- dopo almeno 5 minuti di assenza, il primo return reconciliation consuma la Bacca e genera un evento ciotola.

Non esistono ancora livelli, qualità del cibo o più slot.

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

### Libreria offline M2

M2 usa dieci eventi authored. Sono contenuto di prototipo e possono essere riscritti dopo il playtest.

#### Eventi ciotola

Questi eventi richiedono ciotola piena e consumano la Bacca. Se la ciotola è piena e l'assenza dura almeno 5 minuti, uno di questi eventi occupa obbligatoriamente uno slot del report.

1. `bowl_crumbs` — peso 3  
   "La ciotola è vuota. Momo ha lasciato tre briciole in fila accanto al bordo."

2. `bowl_shifted` — peso 2  
   "La bacca è sparita e la ciotola è stata spostata di qualche centimetro verso l'Albero."

3. `bowl_nap` — peso 2  
   "Momo ha svuotato la ciotola e poi si è addormentato lì vicino."

#### Eventi generali

4. `root_nap` — peso 4, minimo 5 min  
   "Momo ha passato buona parte del tempo sotto le radici dell'Albero, raggomitolato così stretto da sembrare una pietra chiara."

5. `stream_watch` — peso 3, minimo 5 min  
   "Momo è rimasto a lungo al Ruscello, fermo a guardare l'acqua come se aspettasse qualcosa."

6. `grass_tunnel` — peso 3, minimo 5 min  
   "Nell'Erba Alta è comparso un piccolo corridoio schiacciato. Momo finge di non sapere nulla."

7. `false_start` — peso 2, minimo 5 min  
   "Momo si è avviato verso il Ruscello, poi a metà strada ha cambiato idea ed è tornato all'Albero."

8. `leaf_hat` — peso 2, minimo 5 min  
   "Per un po' Momo ha avuto una foglia incastrata sulla testa. Non sembra essersene accorto."

9. `berry_under_root` — peso 2, minimo 15 min, effetto +1 Bacca  
   "Sotto una radice c'era una bacca che prima non avevi visto. Momo ci girava intorno con aria molto innocente."

10. `berry_trail` — peso 1, minimo 30 min, effetto +1 Bacca  
    "Vicino al sentiero hai trovato una piccola fila di bacche. Una è ancora intatta."

Per M2 l'evento necessita soltanto di un piccolo schema data-driven: id, testo, peso, minimo tempo offline, eventuale requisito ciotola ed effetti limitati alle necessità della milestone.

Non costruire ancora il generic EventEngine previsto per milestone successive.

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

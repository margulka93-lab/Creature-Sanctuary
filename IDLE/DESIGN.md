# Creature Sanctuary — Design Checkpoint

**Status:** sistemi concettuali, non ancora GDD definitivo.

## Core loop

Loop principale:

**osserva → raccogli → modifica il santuario → lascia agire le creature → torna → scopri conseguenze → decidi di nuovo**

Una sessione breve deve poter durare 3–5 minuti. Una sessione più lunga può includere costruzione, Bestiario, esplorazioni e lettura degli eventi.

## Area iniziale

La prima area è **La Radura**, una singola schermata 2D illustrata con hotspot e slot prestabiliti.

Elementi previsti:

- grande albero con radici esposte;
- ruscello;
- vecchio rifugio;
- ciotola/area cibo;
- erba alta;
- sentiero verso il bosco.

Il giocatore non controlla un avatar e non cammina fisicamente nella mappa.

## Movimento delle creature

Le creature non necessitano di pathfinding.

Ogni area contiene posizioni predefinite. Una creatura può trovarsi, per esempio, vicino al ruscello, sotto l'albero, nel rifugio o nell'erba.

Il sistema cambia stato e posizione con semplici transizioni/animazioni 2D.

## Attività e stati

Ogni creatura possiede una macchina a stati semplice, ad esempio:

- idle/riposo;
- dorme;
- mangia;
- raccoglie;
- esplora;
- gioca;
- interagisce;
- esegue un comportamento speciale.

La scelta dell'attività dipende da condizioni e pesi probabilistici.

### M1 — comportamento autonomo di Momo

Per M1 la domanda non è quante attività possiamo implementare, ma se Momo può sembrare un individuo vivo senza che il giocatore lo comandi.

La UI player-facing non deve quindi avere pulsanti del tipo "Vai all'Albero" o "Vai al Ruscello". Momo sceglie autonomamente che cosa fare; il giocatore osserva.

Il profilo M1 usa tre attività authored:

1. **Sonnecchia sotto l'Albero**
   - anchor: Albero;
   - attività più frequente e più lunga;
   - comunica il lato timido e la preferenza per un punto sicuro.

2. **Osserva il Ruscello**
   - anchor: Ruscello;
   - attività meno frequente;
   - comunica curiosità senza trasformare il ruscello in una risorsa.

3. **Esplora l'Erba Alta**
   - anchor: Erba Alta;
   - attività breve e meno frequente;
   - comunica curiosità e disponibilità ad allontanarsi dal punto sicuro.

Il tratto **goloso** resta visibile come identità di Momo, ma non deve produrre una meccanica finta prima che esistano cibo/bacche. Verrà espresso quando un sistema reale potrà reagire a quel tratto.

#### Selezione

- ogni attività possiede peso e intervallo di durata;
- evitare la stessa attività due volte di seguito quando esiste almeno un'alternativa valida;
- il tempo e la sorgente random devono essere iniettabili/testabili;
- non serve un trait engine generico in M1: il comportamento authored di Momo può riflettere direttamente i suoi tratti;
- i numeri di durata di M1 servono solo a rendere il prototipo osservabile e non sono bilanciamento definitivo.

#### Stato e transizioni

Lo stato minimo deve distinguere:

- attività corrente;
- anchor corrente;
- fase stabile oppure movimento verso un altro anchor;
- deadline della fase corrente.

Quando termina un'attività:

1. il core sceglie la prossima attività valida;
2. se richiede un anchor diverso, Momo entra in movimento;
3. all'arrivo inizia la nuova attività;
4. quando l'attività termina il ciclo riparte.

Non serve pathfinding: il rendering interpola soltanto fra anchor prestabiliti.

#### Reload durante M1

M1 non deve anticipare il vero sistema offline di M2.

Al reload:

- ripristinare lo stato persistito;
- se una singola fase è già scaduta, risolverla in modo coerente e ripartire dal presente;
- non simulare tutte le attività che Momo avrebbe potuto svolgere durante una lunga assenza;
- non produrre risorse, eventi offline o Diario.

### Segnale di successo M1

La milestone è promettente se, osservando la Radura per pochi minuti senza interagire, il giocatore percepisce che Momo:

- prende iniziative proprie;
- preferisce alcuni luoghi/comportamenti ad altri;
- non si muove con una cadenza meccanica identica;
- comunica almeno in parte "timido ma curioso".

La validazione finale resta umana: i test dimostrano coerenza tecnica, non che Momo sembri vivo.

## Personalità

Ogni individuo possiede pochi tratti, idealmente 2–3 nella prima versione.

Esempi già emersi:

- timido;
- curioso;
- goloso;
- socievole;
- vivace;
- disordinato;
- pigro;
- territoriale;
- affidabile;
- notturno;
- diffidente;
- protettivo;
- testardo;
- tranquillo.

I tratti modificano probabilità e disponibilità degli eventi, non richiedono una psicologia simulata.

## Relazioni

Versione realistica proposta:

- un valore semplice per ogni coppia rilevante, ad esempio da -100 a +100;
- gli eventi possono aumentarlo o diminuirlo;
- soglie qualitative: antipatia, neutrale, amici, legame forte.

Il valore numerico può restare nascosto al giocatore.

## Sistema offline

Non simulare ogni secondo.

Al ritorno:

1. calcolare il tempo trascorso;
2. determinare un numero limitato di attività/eventi plausibili;
3. aggregare la produzione comune;
4. mostrare solo gli eventi interessanti;
5. applicare eventuali cambiamenti permanenti.

Possibile compressione:

- assenza breve: più dettaglio;
- assenza lunga: eventi aggregati;
- assenza molto lunga: stato stabile + pochi avvenimenti rilevanti.

Le creature non muoiono perché il giocatore non apre il gioco.

## Diario del Santuario

Il Diario è il principale strumento di ritorno offline.

Deve raccontare in forma compatta:

- cosa è stato raccolto;
- quali creature hanno interagito;
- cosa è cambiato;
- eventuali indizi o scoperte.

Il log tecnico non deve essere esposto direttamente.

## Nuove creature

Le creature non vengono acquistate.

Ogni specie ha condizioni di attrazione nascoste o parzialmente scopribili. L'arrivo può avvenire per fasi:

1. traccia;
2. reazione delle creature;
3. avvistamento;
4. incontro;
5. permanenza.

Tecnicamente può essere implementato tramite flag, condizioni e probabilità.

## Costruzione

Per il primo scope non esiste costruzione libera.

La mappa usa slot prestabiliti. Questo evita drag & drop, collisioni, coordinate persistenti e problemi di layout.

Le strutture modificano condizioni e probabilità più che produrre valuta passivamente.

## Bestiario

Ogni specie ha una scheda con campi progressivamente rivelati:

- nome;
- immagine;
- habitat;
- dieta;
- attività;
- comportamenti;
- osservazioni.

Le informazioni si sbloccano tramite eventi/flag.

## Esplorazioni

Le esplorazioni sono timer, non mappe giocabili.

Flusso:

- selezione creatura;
- selezione destinazione;
- durata;
- tabella dei risultati;
- eventuale evento raro.

## Meteo e giorno/notte

Sono sistemi desiderati ma non necessari per il primissimo prototipo.

Implementazione prevista: stato globale + overlay/variante grafica + modificatori di probabilità.

## Mistero

Il mistero può essere espresso con:

- cambi di sfondo;
- oggetti/Frammenti;
- eventi rari;
- nuove righe nel Diario;
- pagine del Bestiario;
- sezione Anomalie.

Non richiede cutscene complesse.

## Anti-pattern

Evitare:

- raccolta manuale ogni pochi secondi;
- popup continui;
- decine di valute;
- upgrade puramente percentuali come contenuto principale;
- penalità pesanti per assenza;
- feature che esistono solo perché "tipiche degli idle".

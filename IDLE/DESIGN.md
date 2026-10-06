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

- idle;
- dorme;
- mangia;
- raccoglie;
- esplora;
- gioca;
- interagisce;
- esegue un comportamento speciale.

La scelta dell'attività dipende da condizioni e pesi probabilistici.

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

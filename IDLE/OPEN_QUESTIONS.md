# Creature Sanctuary — Open Questions

Queste domande sono intenzionalmente irrisolte. Codex non deve scegliere autonomamente una risposta permanente.

Le scelte di piattaforma MVP, stack, rendering, formato contenuti, persistenza locale e test runner sono state chiuse in M0 e si trovano in `DECISIONS.md` e `CODEX/TECH_SPEC.md`.

## Distribuzione futura

- Serve un packaging desktop nativo?
- Mobile diventerà un target ufficiale oppure resterà web responsive?
- Serve una PWA installabile?
- Quali store/piattaforme sono eventualmente rilevanti?

Queste domande non devono condizionare M0.5–M2.

## Direzione artistica

- Pixel art?
- Illustrazione 2D morbida?
- Sprite frame-by-frame?
- Cut-out/rig semplice?
- Quale risoluzione/aspect ratio target?

## Tempo

- Ciclo giorno/notte legato all'orario reale?
- Ciclo accelerato?
- Sistema ibrido?
- Quanto offline massimo viene simulato in dettaglio?

## Economia

M2 usa soltanto Bacche come scelta di prototipo. Non è una decisione sull'economia finale.

Restano aperte:

- Esiste una valuta generale?
- Le sole risorse fisiche sono sufficienti?
- Quando introdurre Legnetti e Fibre?
- Quanto deve crescere il costo delle strutture?
- Serve una forma di sink a lungo termine?

## Progressione

- Come si sblocca esattamente il Bosco?
- Le aree future saranno scene reali o soltanto destinazioni di spedizione?
- Esiste un "livello del santuario"?
- Esiste una progressione meta?

## Prestige

È emersa l'idea di cicli stagionali/migrazioni come reinterpretazione narrativa del prestige.

Da decidere:

- esiste davvero?
- quando entra?
- cosa viene mantenuto?
- è necessario o il gioco può funzionare senza reset?

## Creature

- Gli individui hanno nomi fissi o generati?
- Possono esistere più individui della stessa specie?
- Esistono sesso/età?
- Esiste breeding?
- Esistono evoluzioni/varianti ambientali?
- Quanto sono personalizzabili?

Per ora breeding e genetica complessa sono fuori scope.

## Relazioni

- Il giocatore vede categorie qualitative?
- Le relazioni possono decadere?
- Servono relazioni direzionali A→B e B→A o basta un singolo valore condiviso?

## Bisogni

- Fame/riposo/socialità devono esistere come valori veri?
- Devono essere visibili?
- Sono necessari per l'MVP oppure bastano stati/eventi?

## Eventi

- Qual è lo schema dati definitivo degli eventi?
- Come evitare ripetizioni troppo evidenti?
- Quante varianti testuali servono?
- Esistono cooldown per evento?
- Serve una priorità narrativa?

## Diario

M2 implementa soltanto l'ultimo report di ritorno, riapribile dopo la chiusura.

Restano aperte:

- quando introdurre una vera timeline?
- il giocatore può consultare tutti gli eventi precedenti?
- quanto storico conservare?
- come organizzare filtri/categorie quando il contenuto cresce?

## Bestiario

- È disponibile fin dall'inizio?
- Mostra silhouette delle specie non scoperte oppure resta completamente vuoto?
- Quanto deve esplicitare le condizioni di attrazione?

## Meteo

- Simulato internamente o legato al tempo reale?
- È necessario nel primo vertical slice?
- Quanti stati servono davvero?

## Mistero

- Qual è la vera natura del santuario?
- Che cosa sono i Frammenti?
- Perché le creature sono attirate qui?
- Quanto esplicita deve diventare la trama?

Non definire queste risposte finché non viene sviluppato il worldbuilding.

## Salvataggio futuro

Per l'MVP è deciso localStorage tramite `SaveAdapter`.

Restano aperti:

- cloud save in futuro?
- import/export manuale?
- eventuale sincronizzazione tra dispositivi?
- strategia definitiva contro manipolazioni dell'orologio di sistema?

## Monetizzazione/pubblicazione

Non ancora decise.

- premium one-time purchase?
- free?
- cosmetici?
- DLC/espansioni?

Questa decisione non deve influenzare prematuramente il prototipo.

## Accessibilità e UX

- font scaling;
- contrasto;
- reduced motion;
- audio cues;
- supporto touch;
- localizzazione.

Da includere quando viene definita la UI reale.

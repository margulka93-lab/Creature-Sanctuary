# Creature Sanctuary — Economy Checkpoint

**Status:** economia volutamente minimale. Numeri e bilanciamento non ancora definiti.

## Principio

Le risorse devono sembrare parti del santuario, non valute astratte.

La prima economia deve essere abbastanza semplice da capire senza tutorial estesi e abbastanza piccola da poter essere ribilanciata facilmente.

## Risorse iniziali candidate

### Bacche

Funzioni:

- cibo;
- condizione per alcuni arrivi;
- costo/ingrediente per eventi o interazioni.

### Legno / Legnetti

Funzioni:

- riparazioni;
- strutture semplici;
- progressione fisica della Radura.

### Fibre

Funzioni:

- nidi;
- rifugi morbidi;
- strutture/decorazioni naturali.

### Pietre Lucide

Risorsa più rara legata al mistero.

Funzioni potenziali:

- condizione per Lumi e/o Wisp;
- indizi;
- progressione delle Anomalie.

Per il primo prototipo è preferibile partire con **tre risorse comuni** e introdurre la Pietra Lucida solo quando serve il primo contenuto segreto.

## Fonti

Le risorse arrivano principalmente da:

- attività automatiche delle creature;
- esplorazioni;
- eventi;
- interazioni con il santuario.

Le strutture non devono trasformarsi in fabbriche di produzione al secondo.

## Spesa

La spesa iniziale dovrebbe concentrarsi su:

- riparazione del rifugio;
- ciotola/area cibo;
- piccoli miglioramenti della radura;
- eventuali sblocchi di nuovi slot o possibilità.

## Offline economy

La produzione comune può essere aggregata durante l'assenza.

Esempio concettuale:

> Durante la tua assenza sono state raccolte 8 bacche, 4 fibre e 2 legnetti.

Gli eventi significativi vengono invece riportati separatamente.

## Progressione economica

La progressione non deve dipendere soltanto dall'accumulare quantità sempre più alte.

Le vere soglie possono richiedere combinazioni di:

- risorse;
- presenza di determinate creature;
- struttura costruita;
- evento osservato;
- relazione;
- tempo;
- stato ambientale.

## Valute

Decisione attuale: **nessuna valuta premium o moneta astratta nel concept base**.

Un'eventuale valuta generale resta una questione aperta e non va introdotta da Codex senza decisione esplicita.

## Inflation policy

Non è stato deciso un modello di crescita esponenziale tipico degli idle.

Al momento la direzione preferita è una crescita più contenuta e leggibile, perché il focus è scoperta + collezione + ecosistema.

## Prestige/reset

L'idea di un reset stagionale/migrazione è emersa, ma NON è ancora una decisione.

Non implementare prestige nel prototipo.

## Monetizzazione

Non fa parte del prototipo.

Direzione concettuale, se il gioco verrà pubblicato:

- evitare pay-to-win;
- evitare vendita diretta delle creature rare;
- eventuali cosmetici/espansioni sono più coerenti con la fantasy.

La monetizzazione richiederà una decisione separata.


## M2 — economia di validazione

Per il primo return loop entra in gioco soltanto **Bacche**.

Legnetti e Fibre restano candidati del concept, ma non vengono introdotti in M2 perché non hanno ancora un sink utile. Aggiungerli ora creerebbe risorse morte.

### Stato iniziale M2

Il prototipo M2 parte con:

- 1 Bacca disponibile;
- ciotola vuota.

La Bacca iniziale permette al giocatore di provare immediatamente la prima modifica del santuario senza aspettare un ciclo offline preliminare.

### Raccolta offline

Formula provvisoria:

```text
berryGain = min(8, floor(elapsedOffline / 15 minuti))
```

- nessun guadagno sotto 15 minuti completi;
- massimo 8 Bacche per ritorno;
- il cap equivale a 2 ore di raccolta comune;
- il tempo reale oltre il cap può ancora rendere eleggibili eventi, ma non aumenta la raccolta comune.

La formula deve restare configurabile e non va trattata come bilanciamento definitivo.

### Primo sink

Lasciare una Bacca nella ciotola:

- costa 1 Bacca;
- imposta la ciotola a piena;
- non è consentito se la ciotola è già piena o se il giocatore non ha Bacche;
- dopo almeno 5 minuti offline la Bacca viene consumata e produce un avvenimento authored nel report.

### Bonus da eventi

Alcuni eventi offline possono concedere **+1 Bacca** oltre alla raccolta aggregata.

Nessun moltiplicatore, upgrade percentuale o crescita esponenziale viene introdotto in M2.

### Domanda economica M2

Il playtest deve verificare soltanto:

- le Bacche sono abbastanza concrete da rendere leggibile il ciclo raccogli → spendi nella ciotola → ritorna?
- il cap evita che una lunga assenza trasformi il prototipo in un contatore enorme?
- il report sembra una conseguenza del santuario o una ricevuta di produzione?

Non usare M2 per bilanciare un'economia a lungo termine.

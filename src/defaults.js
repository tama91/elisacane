// Contenuti iniziali del sito. Vengono usati finché Elisa non salva
// qualcosa dal pannello /admin; da quel momento valgono quelli salvati.
export const DEFAULT_CONTENT = {
  meta: {
    titolo: "Dott.ssa Elisa Cane – Psicologa a Peschiera e Castelnuovo del Garda",
    descrizione:
      "Psicologa clinica a Peschiera del Garda e Castelnuovo del Garda. Percorsi di supporto psicologico per adulti e adolescenti: ansia, umore, relazioni, crescita personale.",
  },
  profilo: {
    nome: "Dott.ssa Elisa Cane",
    professione: "Psicologa clinica",
    albo: "Albo degli Psicologi del Veneto n. 12759",
    foto: "https://elisacanepsicologa.it/wp-content/uploads/2026/11/Foto-CV-scaled.jpg",
  },
  hero: {
    sopratitolo: "Psicologa clinica a Peschiera e Castelnuovo del Garda",
    titolo: "Uno spazio protetto dove fare chiarezza.",
    testo:
      "Intraprendere un percorso psicologico significa regalarsi uno spazio dove riordinare i pensieri e ritrovare il proprio benessere. Non dovrai affrontare tutto da solo: cammineremo insieme, passo dopo passo, per trasformare le difficoltà in consapevolezza e in un nuovo equilibrio.",
    bottone: "Richiedi un primo colloquio",
  },
  servizi: {
    titolo: "Di cosa mi occupo",
    intro: "Offro percorsi di consulenza e supporto psicologico rivolti ad adulti e adolescenti.",
    voci: [
      {
        titolo: "Ansia e gestione dello stress",
        testo: "Attacchi di panico, ansia generalizzata e periodi in cui lo stress diventa difficile da gestire.",
      },
      {
        titolo: "Umore",
        testo: "Deflessione dell'umore, tristezza che si prolunga nel tempo, senso di vuoto.",
      },
      {
        titolo: "Difficoltà relazionali",
        testo: "Conflitti personali, familiari e affettivi, e la fatica di stare nelle relazioni importanti.",
      },
      {
        titolo: "Crescita personale",
        testo: "Conoscersi meglio e dare spazio alle proprie risorse, anche quando non c'è un problema preciso.",
      },
    ],
  },
  passi: {
    titolo: "Come iniziare",
    voci: [
      {
        titolo: "Mi contatti",
        testo: "Compili il modulo qui sotto o mi scrivi. Ti richiamo io, in modo riservato, per capire insieme di cosa hai bisogno.",
      },
      {
        titolo: "Il primo colloquio",
        testo: "Ci conosciamo e mettiamo a fuoco ciò che ti ha portato qui. Alla fine valuti tu se proseguire.",
      },
      {
        titolo: "Il percorso",
        testo: "Definiamo insieme obiettivi, frequenza degli incontri e tempi, rispettando i tuoi ritmi.",
      },
    ],
  },
  chisono: {
    titolo: "Chi sono",
    testo:
      "Sono Elisa Cane, psicologa clinica iscritta all'Albo degli Psicologi del Veneto.\n\nNel mio lavoro do valore all'ascolto e al rispetto dei tempi di ciascuno: ogni percorso è costruito sulla persona, sulla sua storia e sui suoi obiettivi.\n\nRicevo adulti e adolescenti a Castelnuovo del Garda e a Peschiera del Garda.",
  },
  sedi: {
    titolo: "Dove ricevo",
    nota: "Si riceve su appuntamento.",
    voci: [
      {
        citta: "Castelnuovo del Garda",
        struttura: "Poliambulatori Bonamed",
        indirizzo: "Via Roma 7/C, 37014 Castelnuovo del Garda (VR)",
        orari: [{ giorni: "Lunedì e mercoledì", ore: "14:00 – 19:00" }],
      },
      {
        citta: "Peschiera del Garda",
        struttura: "Centro Allevio3",
        indirizzo: "Via Sebino 1, 37019 Peschiera del Garda (VR)",
        orari: [{ giorni: "Venerdì", ore: "9:00 – 13:00" }],
      },
    ],
  },
  faq: {
    titolo: "Domande frequenti",
    voci: [
      {
        domanda: "Quanto dura un colloquio?",
        risposta: "Di solito circa 50 minuti.",
      },
      {
        domanda: "Ogni quanto ci si vede?",
        risposta: "Dipende dal percorso. Spesso si parte con un incontro a settimana o ogni due settimane, e la frequenza si decide insieme.",
      },
      {
        domanda: "Serve l'impegnativa del medico?",
        risposta: "No, puoi contattarmi direttamente.",
      },
      {
        domanda: "Le sedute sono detraibili?",
        risposta: "Sì. Le prestazioni dello psicologo sono spese sanitarie detraibili nella dichiarazione dei redditi, se pagate con metodi tracciabili. Ricevi sempre regolare fattura.",
      },
      {
        domanda: "Quello che dico resta riservato?",
        risposta: "Sì. Lo psicologo è tenuto al segreto professionale previsto dal Codice Deontologico.",
      },
    ],
  },
  contatti: {
    titolo: "Contattami",
    testo:
      "Compila il modulo per essere ricontattato in totale riservatezza. Ti richiamerò personalmente, con una chiamata o un messaggio WhatsApp, per concordare un appuntamento.",
    telefono: "",
    whatsapp: "",
    email: "",
  },
  footer: {
    piva: "",
  },
  privacy: {
    testo:
      "Titolare del trattamento: Dott.ssa Elisa Cane, [indirizzo], [email].\n\nI dati inviati con il modulo di contatto (nome, cognome, telefono, email e motivo della richiesta) sono usati solo per ricontattarti e fissare un appuntamento. Non vengono ceduti a terzi.\n\nLe richieste vengono cancellate automaticamente dopo 180 giorni.\n\nPuoi chiedere in qualsiasi momento l'accesso, la correzione o la cancellazione dei tuoi dati scrivendo a [email].\n\n[Testo da completare e verificare con un consulente privacy.]",
  },
};

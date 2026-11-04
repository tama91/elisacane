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
    parole: "Ansia\nStress\nUmore\nRelazioni\nConsapevolezza\nAscolto\nEquilibrio\nCrescita personale",
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
    instagram: "https://www.instagram.com/leparole_della_mente/",
  },
  instagram: {
    titolo: "Le parole della mente",
    testo: "Sul mio profilo Instagram condivido brevi riflessioni su emozioni, relazioni e benessere psicologico.",
    bottone: "Seguimi su Instagram",
  },
  footer: {
    piva: "",
  },
  privacy: {
    informativa: "Ultimo aggiornamento: 4 novembre 2026\n\nQuesta informativa spiega come vengono trattati i dati personali di chi visita questo sito e di chi compila il modulo di contatto, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (\"GDPR\") e del D.Lgs. 196/2003 (\"Codice privacy\").\n\n## Titolare del trattamento\n\nDott.ssa Elisa Cane, psicologa iscritta all'Albo degli Psicologi del Veneto n. 12759.\nIndirizzo: [indirizzo dello studio o domicilio professionale]\nEmail: [email]\nPEC: [indirizzo PEC]\nP. IVA: [partita IVA]\n\n## Quali dati trattiamo\n\nDati che invii tu con il modulo di contatto:\n- nome e cognome;\n- numero di telefono;\n- indirizzo email, se lo inserisci;\n- il motivo della richiesta, cioè il testo che scrivi nel messaggio.\n\nIl motivo della richiesta può contenere informazioni sulla tua salute, che il GDPR considera \"categorie particolari di dati\" (art. 9). Ti chiedo di scrivere solo ciò che serve a capire come aiutarti: potremo approfondire durante il primo colloquio.\n\nDati di navigazione: quando visiti il sito, i server che lo ospitano registrano in automatico alcuni dati tecnici, come l'indirizzo IP, il tipo di browser e l'orario della visita. Servono solo a far funzionare il sito e a proteggerlo da abusi e attacchi, e non vengono usati per identificarti.\n\n## Perché trattiamo i dati e su quale base giuridica\n\n- Rispondere alla tua richiesta e concordare un appuntamento. Base giuridica: esecuzione di misure precontrattuali adottate su tua richiesta (art. 6, par. 1, lett. b GDPR) e, per gli eventuali dati sulla salute che inserisci nel messaggio, il tuo consenso esplicito (art. 9, par. 2, lett. a GDPR), che esprimi spuntando la casella del modulo.\n- Garantire la sicurezza e il corretto funzionamento del sito. Base giuridica: legittimo interesse della titolare (art. 6, par. 1, lett. f GDPR).\n- Adempiere a obblighi di legge ed eventualmente far valere o difendere un diritto in sede giudiziaria. Base giuridica: obbligo legale (art. 6, par. 1, lett. c GDPR) e legittimo interesse (art. 6, par. 1, lett. f GDPR).\n\nSe dopo il primo contatto decidi di iniziare un percorso, riceverai un'informativa dedicata e il modulo di consenso informato previsti per la prestazione professionale.\n\n## Cosa succede se non fornisci i dati\n\nNome, telefono e motivo della richiesta sono necessari per ricontattarti: senza questi dati il modulo non può essere inviato. L'email è facoltativa. In alternativa puoi usare i recapiti indicati sul sito.\n\n## Come vengono trattati i dati\n\nI dati sono trattati con strumenti elettronici e con misure adeguate a proteggerli da accessi non autorizzati, perdita o diffusione. Le richieste inviate dal modulo sono consultabili solo dalla titolare, in un'area riservata protetta da password. Il contenuto del messaggio non viene inviato via email.\n\nTutte le informazioni sono coperte dal segreto professionale previsto dal Codice Deontologico degli Psicologi Italiani.\n\nNon vengono prese decisioni automatizzate e non viene fatta alcuna profilazione.\n\n## Chi può ricevere i dati\n\nI dati non vengono venduti, ceduti o diffusi. Possono essere trattati, solo per le finalità indicate, da:\n- Cloudflare, Inc., che ospita il sito e l'archivio in cui sono salvate le richieste;\n- [Resend, Inc., servizio usato per avvisare la titolare via email quando arriva una nuova richiesta. L'avviso contiene solo nome e telefono, non il messaggio. – Togliere questo punto se l'avviso email non è attivo.]\n- il fornitore che cura lo sviluppo e la manutenzione tecnica del sito.\n\nQuesti soggetti agiscono come responsabili del trattamento (art. 28 GDPR), in base ad accordi che li vincolano alla riservatezza e alla sicurezza dei dati. L'elenco aggiornato è disponibile su richiesta.\n\n## Trasferimento dei dati fuori dall'Unione europea\n\nCloudflare, Inc. ha sede negli Stati Uniti, quindi i dati possono essere trasferiti fuori dall'Unione europea. Il trasferimento avviene sulla base della decisione di adeguatezza della Commissione europea del 10 luglio 2023 relativa all'EU-U.S. Data Privacy Framework, a cui il fornitore aderisce, e delle clausole contrattuali standard approvate dalla Commissione europea.\n\n## Per quanto tempo conserviamo i dati\n\n- Richieste inviate dal modulo: vengono cancellate in automatico dopo 180 giorni. La titolare può cancellarle prima, quando non servono più.\n- Dati di navigazione: per il tempo strettamente necessario alla sicurezza del sito, di norma pochi giorni.\n\nSe inizi un percorso, i dati necessari vengono conservati per i tempi previsti per la documentazione professionale e dalle norme fiscali.\n\n## Minori\n\nSe la richiesta riguarda una persona minorenne, il modulo deve essere compilato da un genitore o da chi esercita la responsabilità genitoriale.\n\n## Cookie\n\nQuesto sito non usa cookie di profilazione, strumenti di statistica o servizi di terze parti che installano cookie. L'unico cookie presente è tecnico (\"ec_sessione\"): viene creato solo quando la titolare accede alla sua area riservata, per mantenerla collegata. Secondo le Linee guida cookie del Garante del 10 giugno 2021, i cookie tecnici non richiedono il consenso.\n\nI link a WhatsApp, Instagram e Google Maps portano a siti esterni: una volta aperti, valgono le informative privacy e cookie di quei servizi.\n\n## I tuoi diritti\n\nIn qualsiasi momento puoi chiedere alla titolare:\n- di accedere ai tuoi dati e di riceverne una copia (art. 15 GDPR);\n- di correggerli o completarli (art. 16 GDPR);\n- di cancellarli (art. 17 GDPR);\n- di limitarne il trattamento (art. 18 GDPR);\n- di riceverli in un formato strutturato e di uso comune (art. 20 GDPR);\n- di opporti al trattamento basato sul legittimo interesse (art. 21 GDPR).\n\nPuoi anche revocare il consenso in qualsiasi momento. La revoca non rende illegittimo il trattamento fatto prima.\n\nPer esercitare i tuoi diritti scrivi a [email]. Riceverai una risposta entro un mese.\n\nSe ritieni che il trattamento dei tuoi dati violi la normativa, puoi presentare reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).\n\n## Modifiche a questa informativa\n\nQuesta informativa può essere aggiornata nel tempo. La versione valida è sempre quella pubblicata su questa pagina, con la data dell'ultimo aggiornamento indicata in alto.",
  },
};

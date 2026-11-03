// Pannello di gestione del sito.
// La struttura delle sezioni qui sotto decide quali campi Elisa può modificare.

const SEZIONI = [
  {
    chiave: "sedi", titolo: "Orari e sedi",
    aiuto: "Indirizzi e orari degli studi. Puoi aggiungere o togliere giorni e sedi.",
    campi: [
      { k: "titolo", label: "Titolo della sezione" },
      { k: "nota", label: "Nota sotto il titolo", aiuto: "Ad esempio: Si riceve su appuntamento." },
      { k: "voci", label: "Sedi", aggiungi: "Aggiungi una sede", tipo: "lista", nuovo: { citta: "", struttura: "", indirizzo: "", orari: [] }, etichetta: "citta",
        campi: [
          { k: "citta", label: "Città" },
          { k: "struttura", label: "Studio o centro" },
          { k: "indirizzo", label: "Indirizzo completo", aiuto: "Viene usato anche per il link a Google Maps." },
          { k: "orari", label: "Orari", aggiungi: "Aggiungi un orario", compatta: true, tipo: "lista", nuovo: { giorni: "", ore: "" }, etichetta: "giorni",
            campi: [
              { k: "giorni", label: "Giorni", aiuto: "Es. Lunedì e mercoledì" },
              { k: "ore", label: "Orario", aiuto: "Es. 14:00 – 19:00" },
            ] },
        ] },
    ],
  },
  {
    chiave: "contatti", titolo: "Contatti",
    aiuto: "I recapiti che compaiono nel sito. Se lasci un campo vuoto, quel recapito non viene mostrato.",
    campi: [
      { k: "telefono", label: "Telefono", aiuto: "Es. 333 123 4567" },
      { k: "whatsapp", label: "Numero WhatsApp", aiuto: "Se lo inserisci compare il bottone «Scrivimi su WhatsApp»." },
      { k: "email", label: "Email" },
      { k: "titolo", label: "Titolo della sezione" },
      { k: "testo", label: "Testo accanto al modulo", tipo: "testo" },
    ],
  },
  {
    chiave: "hero", titolo: "Apertura",
    aiuto: "La prima cosa che si vede aprendo il sito.",
    campi: [
      { k: "sopratitolo", label: "Riga sopra il titolo" },
      { k: "titolo", label: "Titolo principale" },
      { k: "testo", label: "Testo di presentazione", tipo: "testo" },
      { k: "bottone", label: "Testo del bottone" },
    ],
  },
  {
    chiave: "profilo", titolo: "Profilo e foto",
    campi: [
      { k: "foto", label: "Foto", tipo: "foto" },
      { k: "nome", label: "Nome" },
      { k: "professione", label: "Professione" },
      { k: "albo", label: "Iscrizione all'Albo" },
    ],
  },
  {
    chiave: "servizi", titolo: "Di cosa mi occupo",
    campi: [
      { k: "titolo", label: "Titolo della sezione" },
      { k: "intro", label: "Introduzione", tipo: "testo" },
      { k: "voci", label: "Aree", aggiungi: "Aggiungi un'area", tipo: "lista", nuovo: { titolo: "", testo: "" }, etichetta: "titolo",
        campi: [ { k: "titolo", label: "Titolo" }, { k: "testo", label: "Descrizione", tipo: "testo" } ] },
    ],
  },
  {
    chiave: "passi", titolo: "Come iniziare",
    campi: [
      { k: "titolo", label: "Titolo della sezione" },
      { k: "voci", label: "Passaggi", aggiungi: "Aggiungi un passaggio", tipo: "lista", nuovo: { titolo: "", testo: "" }, etichetta: "titolo",
        campi: [ { k: "titolo", label: "Titolo" }, { k: "testo", label: "Descrizione", tipo: "testo" } ] },
    ],
  },
  {
    chiave: "chisono", titolo: "Chi sono",
    campi: [
      { k: "titolo", label: "Titolo della sezione" },
      { k: "testo", label: "Testo", tipo: "testo", righe: 10, aiuto: "Lascia una riga vuota per iniziare un nuovo paragrafo." },
    ],
  },
  {
    chiave: "faq", titolo: "Domande frequenti",
    campi: [
      { k: "titolo", label: "Titolo della sezione" },
      { k: "voci", label: "Domande", aggiungi: "Aggiungi una domanda", tipo: "lista", nuovo: { domanda: "", risposta: "" }, etichetta: "domanda",
        campi: [ { k: "domanda", label: "Domanda" }, { k: "risposta", label: "Risposta", tipo: "testo" } ] },
    ],
  },
  {
    chiave: "meta", titolo: "Google e condivisione",
    aiuto: "Come appare il sito nei risultati di Google e quando viene condiviso.",
    campi: [
      { k: "titolo", label: "Titolo della pagina", aiuto: "Meglio restare sotto i 60 caratteri." },
      { k: "descrizione", label: "Descrizione", tipo: "testo", aiuto: "Meglio restare sotto i 160 caratteri." },
    ],
  },
  {
    chiave: "footer", titolo: "Dati fiscali",
    campi: [ { k: "piva", label: "Partita IVA", aiuto: "Compare in fondo al sito." } ],
  },
  {
    chiave: "privacy", titolo: "Informativa privacy",
    campi: [ { k: "testo", label: "Testo", tipo: "testo", righe: 14, aiuto: "Lascia una riga vuota per iniziare un nuovo paragrafo." } ],
  },
];

const $ = (s, el = document) => el.querySelector(s);
let dati = null;
let modificato = false;
let attiva = "sedi";
let richieste = [];

// ---------- Avvio ----------

async function avvia() {
  const r = await fetch("/api/sessione");
  if (r.ok) return apriPannello();
  $("#accesso").hidden = false;
  $("#form-accesso input").focus();
}

$("#form-accesso").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("#form-accesso .msg");
  msg.textContent = "";
  const r = await fetch("/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: e.target.password.value }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    msg.textContent = j.errore || "Accesso non riuscito.";
    return;
  }
  e.target.reset();
  $("#accesso").hidden = true;
  apriPannello();
});

async function apriPannello() {
  const [c, q] = await Promise.all([fetch("/api/contenuti"), fetch("/api/richieste")]);
  dati = await c.json();
  richieste = q.ok ? await q.json() : [];
  $("#app").hidden = false;
  disegnaMenu();
  disegnaEditor();
}

$("#esci").addEventListener("click", async () => {
  if (modificato && !confirm("Hai modifiche non salvate. Uscire comunque?")) return;
  await fetch("/api/logout", { method: "POST" });
  location.reload();
});

$("#salva").addEventListener("click", salva);
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); if (modificato) salva(); }
});
window.addEventListener("beforeunload", (e) => { if (modificato) { e.preventDefault(); e.returnValue = ""; } });

async function salva() {
  const btn = $("#salva");
  btn.disabled = true;
  stato("Salvataggio…");
  const r = await fetch("/api/contenuti", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dati),
  });
  if (r.ok) {
    modificato = false;
    stato("Modifiche salvate. Sono già visibili sul sito.");
  } else {
    btn.disabled = false;
    stato(r.status === 401 ? "Sessione scaduta: esci e rientra, poi salva di nuovo." : "Salvataggio non riuscito. Riprova.", true);
  }
}

function segnaModifica() {
  modificato = true;
  $("#salva").disabled = false;
  stato("Modifiche non salvate", true);
}

function stato(testo, evidenza = false) {
  const el = $("#stato");
  el.textContent = testo;
  el.classList.toggle("modificato", evidenza);
}

// ---------- Menu ----------

function disegnaMenu() {
  const menu = $("#menu");
  menu.innerHTML = "";
  const voce = (chiave, testo, extra = "") => {
    const b = document.createElement("button");
    b.type = "button";
    b.innerHTML = escape(testo) + extra;
    if (chiave === attiva) b.setAttribute("aria-current", "true");
    b.addEventListener("click", () => { attiva = chiave; disegnaMenu(); disegnaEditor(); });
    menu.appendChild(b);
  };
  voce("richieste", "Richieste ricevute", richieste.length ? `<span class="badge">${richieste.length}</span>` : "");
  const sep = document.createElement("div");
  sep.className = "separa";
  menu.appendChild(sep);
  SEZIONI.forEach((s) => voce(s.chiave, s.titolo));
}

// ---------- Editor ----------

function disegnaEditor() {
  const ed = $("#editor");
  ed.innerHTML = "";
  if (attiva === "richieste") return disegnaRichieste(ed);

  const sez = SEZIONI.find((s) => s.chiave === attiva);
  const h = document.createElement("h2");
  h.textContent = sez.titolo;
  ed.appendChild(h);
  const p = document.createElement("p");
  p.className = "aiuto";
  p.textContent = sez.aiuto || "Modifica i testi e premi «Salva modifiche».";
  ed.appendChild(p);
  sez.campi.forEach((c) => ed.appendChild(campo(c, dati[sez.chiave])));
}

function campo(def, oggetto) {
  if (def.tipo === "lista") return lista(def, oggetto);
  if (def.tipo === "foto") return foto(def, oggetto);

  const wrap = document.createElement("label");
  wrap.className = "campo";
  const t = document.createElement("span");
  t.textContent = def.label;
  wrap.appendChild(t);
  const input = document.createElement(def.tipo === "testo" ? "textarea" : "input");
  if (def.tipo === "testo") input.rows = def.righe || 4;
  input.value = oggetto[def.k] ?? "";
  input.addEventListener("input", () => {
    oggetto[def.k] = input.value;
    segnaModifica();
    if (wrap._aggiornaEtichetta) wrap._aggiornaEtichetta();
  });
  wrap.appendChild(input);
  if (def.aiuto) {
    const s = document.createElement("small");
    s.textContent = def.aiuto;
    wrap.appendChild(s);
  }
  return wrap;
}

function lista(def, oggetto) {
  if (!Array.isArray(oggetto[def.k])) oggetto[def.k] = [];
  const arr = oggetto[def.k];
  const box = document.createElement("div");
  box.className = "lista";

  const ridisegna = () => {
    box.innerHTML = "";
    const tit = document.createElement("div");
    tit.className = "lista-titolo";
    tit.textContent = def.label;
    box.appendChild(tit);

    arr.forEach((item, i) => {
      const v = document.createElement("div");
      v.className = def.compatta ? "voce compatta" : "voce";
      const testa = document.createElement("div");
      testa.className = "voce-testa";
      const nome = document.createElement("strong");
      const etichetta = () => (nome.textContent = item[def.etichetta] || `Nuova voce`);
      etichetta();
      testa.appendChild(nome);
      testa.appendChild(bottone("Su", () => sposta(i, -1), i === 0));
      testa.appendChild(bottone("Giù", () => sposta(i, 1), i === arr.length - 1));
      const el = bottone("Elimina", () => {
        if (!confirm(`Eliminare «${item[def.etichetta] || "questa voce"}»?`)) return;
        arr.splice(i, 1); segnaModifica(); ridisegna();
      });
      el.classList.add("btn-pericolo");
      testa.appendChild(el);
      v.appendChild(testa);

      def.campi.forEach((c) => {
        const n = campo(c, item);
        if (c.k === def.etichetta) n._aggiornaEtichetta = etichetta;
        v.appendChild(n);
      });
      box.appendChild(v);
    });

    const add = bottone(def.aggiungi || "Aggiungi", () => {
      arr.push(structuredClone(def.nuovo));
      segnaModifica(); ridisegna();
      const voci = box.querySelectorAll(":scope > .voce");
      voci[voci.length - 1]?.querySelector("input, textarea")?.focus();
    });
    add.classList.add("aggiungi");
    box.appendChild(add);
  };

  const sposta = (i, d) => {
    const [x] = arr.splice(i, 1);
    arr.splice(i + d, 0, x);
    segnaModifica(); ridisegna();
  };

  ridisegna();
  return box;
}

function foto(def, oggetto) {
  const wrap = document.createElement("div");
  wrap.className = "campo";
  wrap.innerHTML = `<span>${escape(def.label)}</span>
    <div class="foto">
      <img alt="Anteprima della foto">
      <div>
        <label class="btn btn-leggero">Cambia foto<input type="file" accept="image/jpeg,image/png,image/webp"></label>
        <small style="display:block;margin-top:8px">JPG o PNG. Viene ridimensionata in automatico.</small>
      </div>
    </div>`;
  const img = $("img", wrap);
  img.src = oggetto[def.k] || "";
  $("input[type=file]", wrap).addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    stato("Carico la foto…");
    try {
      const blob = await ridimensiona(file, 1400);
      const r = await fetch("/api/foto", { method: "POST", headers: { "content-type": "image/jpeg" }, body: blob });
      const j = await r.json();
      if (!r.ok) throw new Error(j.errore);
      oggetto[def.k] = j.url;
      img.src = j.url;
      segnaModifica();
      stato("Foto caricata. Premi «Salva modifiche» per pubblicarla.", true);
    } catch (err) {
      stato(err.message || "Caricamento non riuscito.", true);
    }
  });
  return wrap;
}

function ridimensiona(file, lato) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, lato / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => (b ? ok(b) : ko(new Error("Foto non leggibile."))), "image/jpeg", 0.86);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => ko(new Error("Foto non leggibile."));
    img.src = URL.createObjectURL(file);
  });
}

// ---------- Richieste ----------

function disegnaRichieste(ed) {
  ed.innerHTML = `<h2>Richieste ricevute</h2>
    <p class="aiuto">Le richieste inviate dal modulo del sito. Vengono cancellate in automatico dopo 180 giorni.</p>`;
  if (!richieste.length) {
    ed.insertAdjacentHTML("beforeend", `<p class="vuoto">Per ora nessuna richiesta. Quando qualcuno compila il modulo la trovi qui.</p>`);
    return;
  }
  richieste.forEach((r) => {
    const d = new Date(r.data);
    const el = document.createElement("article");
    el.className = "richiesta";
    const tel = (r.telefono || "").replace(/[^\d+]/g, "");
    el.innerHTML = `<div class="richiesta-testa">
        <strong>${escape(r.nome)} ${escape(r.cognome || "")}</strong>
        <time datetime="${escape(r.data)}">${d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}, ${d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</time>
      </div>
      <p class="recapito"><a href="tel:${escape(tel)}">${escape(r.telefono)}</a>${r.email ? ` · <a href="mailto:${escape(r.email)}">${escape(r.email)}</a>` : ""}</p>
      <p>${escape(r.motivo)}</p>`;
    const del = bottone("Elimina", async () => {
      if (!confirm("Eliminare questa richiesta? Non si potrà recuperare.")) return;
      const res = await fetch("/api/richieste/" + encodeURIComponent(r.id), { method: "DELETE" });
      if (res.ok) { richieste = richieste.filter((x) => x.id !== r.id); disegnaMenu(); disegnaEditor(); }
    });
    del.classList.add("btn-pericolo");
    $(".richiesta-testa", el).appendChild(del);
    ed.appendChild(el);
  });
}

// ---------- Utilità ----------

function bottone(testo, fn, disabilitato = false) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn btn-piccolo btn-leggero";
  b.textContent = testo;
  b.disabled = disabilitato;
  b.addEventListener("click", fn);
  return b;
}

function escape(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

avvia();

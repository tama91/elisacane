// Genera l'HTML delle pagine pubbliche a partire dai contenuti salvati.

export function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Testo con righe vuote -> paragrafi
function paragrafi(testo) {
  return String(testo ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

const soloCifre = (s) => String(s ?? "").replace(/[^\d+]/g, "");
const waNumero = (s) => {
  let n = String(s ?? "").replace(/\D/g, "");
  if (n && !n.startsWith("39") && n.length <= 10) n = "39" + n;
  return n;
};
const mappa = (indirizzo) =>
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(indirizzo);

// Onda periodica (periodo 720) larga 2880: si fa scorrere di 720 per un loop continuo
function onda(y, amp) {
  let d = `M0 ${y}`;
  for (let i = 0; i < 8; i++) {
    const x = i * 360, s = i % 2 === 0 ? -1 : 1;
    d += ` C ${x + 120} ${y + s * amp}, ${x + 240} ${y + s * amp}, ${x + 360} ${y}`;
  }
  return d;
}

function instagram(c) {
  const v = String(c.contatti.instagram ?? "").trim();
  if (!v) return null;
  const m = v.match(/instagram\.com\/([^/?#]+)/i);
  const nome = (m ? m[1] : v).replace(/^@/, "");
  if (!/^[\w.]+$/.test(nome)) return null;
  return { url: `https://www.instagram.com/${nome}/`, nome: "@" + nome };
}

const icoInstagram = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1.1" class="pieno"/></svg>`;

function testa(c, { titolo, descrizione, path, noindex }) {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titolo)}</title>
<meta name="description" content="${esc(descrizione)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titolo)}">
<meta property="og:description" content="${esc(descrizione)}">
<meta property="og:locale" content="it_IT">
<meta name="theme-color" content="#f3f5f2">
<script>document.documentElement.classList.add("js")</script>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/hanken-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=3">
</head>`;
}

function intestazione(c, home = true) {
  const p = home ? "" : "/";
  return `<header class="testata">
  <div class="wrap testata-in">
    <a class="marchio" href="/">${esc(c.profilo.nome)}<span>${esc(c.profilo.professione)}</span></a>
    <nav aria-label="Sezioni">
      <ul>
        <li><a href="${p}#servizi">Di cosa mi occupo</a></li>
        <li><a href="${p}#chi-sono">Chi sono</a></li>
        <li><a href="${p}#sedi">Dove ricevo</a></li>
        <li><a href="${p}#domande">Domande</a></li>
      </ul>
    </nav>
    <a class="bottone bottone-piccolo" href="${p}#contatti">Contattami</a>
  </div>
</header>`;
}

function piede(c) {
  const anno = new Date().getFullYear();
  const ig = instagram(c);
  return `<footer class="piede">
  <div class="wrap piede-in">
    <p>${esc(c.profilo.nome)} · ${esc(c.profilo.professione)}<br>${esc(c.profilo.albo)}${
      c.footer.piva ? `<br>P. IVA ${esc(c.footer.piva)}` : ""
    }</p>
    <p>${ig ? `<a href="${esc(ig.url)}" target="_blank" rel="noopener">Instagram</a><br>` : ""}<a href="/privacy">Privacy</a><br>© ${anno}</p>
  </div>
</footer>`;
}

export function renderHome(c, { noindex = false } = {}) {
  const tel = soloCifre(c.contatti.telefono);
  const wa = waNumero(c.contatti.whatsapp);

  const servizi = c.servizi.voci
    .map(
      (v, i) => `<li data-rivela style="--i:${i % 2}"><h3>${esc(v.titolo)}</h3><p>${esc(v.testo)}</p></li>`
    )
    .join("");

  const passi = c.passi.voci
    .map(
      (v, i) =>
        `<li data-rivela style="--i:${i}"><span class="passo-n" aria-hidden="true">${i + 1}</span><h3>${esc(v.titolo)}</h3><p>${esc(v.testo)}</p></li>`
    )
    .join("");

  const sedi = c.sedi.voci
    .map(
      (s, i) => `<article class="sede" data-rivela style="--i:${i}">
      <h3>${esc(s.citta)}</h3>
      <p class="sede-struttura">${esc(s.struttura)}</p>
      <p>${esc(s.indirizzo)}</p>
      ${
        s.orari && s.orari.length
          ? `<dl class="orari">${s.orari
              .map((o) => `<div><dt>${esc(o.giorni)}</dt><dd>${esc(o.ore)}</dd></div>`)
              .join("")}</dl>`
          : ""
      }
      <a class="link" href="${esc(mappa(s.indirizzo))}" target="_blank" rel="noopener">Apri in Google Maps</a>
    </article>`
    )
    .join("");

  const faq = c.faq.voci
    .map(
      (f) =>
        `<details><summary>${esc(f.domanda)}</summary><div class="risposta">${paragrafi(f.risposta)}</div></details>`
    )
    .join("");

  const ig = instagram(c);
  const parole = String(c.hero.parole ?? "")
    .split(/[\n,]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const giro = parole
    .map((p) => `<span class="parola">${esc(p)}</span><svg class="tilde" viewBox="0 0 40 12" aria-hidden="true"><path d="M2 6 C 8 0, 14 0, 20 6 S 32 12, 38 6"/></svg>`)
    .join("");

  const recapiti = [
    tel ? `<li><span>Telefono</span><a href="tel:${esc(tel)}">${esc(c.contatti.telefono)}</a></li>` : "",
    wa
      ? `<li><span>WhatsApp</span><a href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">Scrivimi su WhatsApp</a></li>`
      : "",
    c.contatti.email
      ? `<li><span>Email</span><a href="mailto:${esc(c.contatti.email)}">${esc(c.contatti.email)}</a></li>`
      : "",
    ig ? `<li><span>Instagram</span><a href="${esc(ig.url)}" target="_blank" rel="noopener">${esc(ig.nome)}</a></li>` : "",
  ].join("");

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: c.profilo.nome,
    description: c.meta.descrizione,
    ...(tel ? { telephone: tel } : {}),
    ...(c.contatti.email ? { email: c.contatti.email } : {}),
    ...(ig ? { sameAs: [ig.url] } : {}),
    location: c.sedi.voci.map((s) => ({
      "@type": "Place",
      name: s.struttura,
      address: s.indirizzo,
    })),
  };

  return `${testa(c, { titolo: c.meta.titolo, descrizione: c.meta.descrizione, noindex })}
<body>
<a class="salta" href="#contenuto">Vai al contenuto</a>
${intestazione(c)}
<main id="contenuto">

<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-testo">
      <p class="sopratitolo entra" style="--d:0">${esc(c.hero.sopratitolo)}</p>
      <h1 class="entra" style="--d:1">${esc(c.hero.titolo)}</h1>
      <p class="hero-intro entra" style="--d:2">${esc(c.hero.testo)}</p>
      <div class="azioni entra" style="--d:3">
        <a class="bottone" href="#contatti">${esc(c.hero.bottone)}</a>
        ${wa ? `<a class="bottone bottone-secondario" href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">Scrivimi su WhatsApp</a>` : ""}
      </div>
      <p class="albo entra" style="--d:4">${esc(c.profilo.albo)}</p>
    </div>
    <figure class="hero-foto">
      <div class="cornice"><img src="${esc(c.profilo.foto)}" alt="${esc(c.profilo.nome)}" width="640" height="800" fetchpriority="high"></div>
    </figure>
  </div>
  <svg class="orizzonte" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
    <g class="scorre scorre-lento"><path class="onda-eco" d="${onda(44, 7)}" /></g>
    <g class="scorre"><path d="${onda(28, 12)}" /></g>
  </svg>
</section>

${
  parole.length
    ? `<section class="parole" aria-label="Temi di cui mi occupo">
  <ul class="nascosto">${parole.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
  <div class="parole-traccia" aria-hidden="true"><div class="parole-giro">${giro}</div><div class="parole-giro copia">${giro}</div></div>
</section>`
    : ""
}

<section class="sezione servizi" id="servizi">
  <div class="wrap">
    <div class="sezione-testa" data-rivela>
      <h2>${esc(c.servizi.titolo)}</h2>
      <p>${esc(c.servizi.intro)}</p>
    </div>
    <ul class="aree">${servizi}</ul>
  </div>
</section>

<section class="sezione passi">
  <div class="wrap">
    <div class="sezione-testa" data-rivela><h2>${esc(c.passi.titolo)}</h2></div>
    <ol class="sequenza" data-rivela>${passi}</ol>
  </div>
</section>

<section class="sezione chisono" id="chi-sono">
  <div class="wrap due-col">
    <h2 data-rivela>${esc(c.chisono.titolo)}</h2>
    <div class="testo-lungo" data-rivela style="--i:1">${paragrafi(c.chisono.testo)}</div>
  </div>
</section>

${
  ig
    ? `<section class="instagram">
  <div class="wrap instagram-in" data-rivela>
    <h2>${esc(c.instagram.titolo)}</h2>
    <div class="instagram-testo">
      <p>${esc(c.instagram.testo)}</p>
      <a class="bottone bottone-secondario" href="${esc(ig.url)}" target="_blank" rel="noopener">${icoInstagram}${esc(c.instagram.bottone)}</a>
      <p class="ig-nome">${esc(ig.nome)}</p>
    </div>
  </div>
</section>`
    : ""
}

<section class="sezione sedi" id="sedi">
  <div class="wrap">
    <div class="sezione-testa" data-rivela>
      <h2>${esc(c.sedi.titolo)}</h2>
      ${c.sedi.nota ? `<p>${esc(c.sedi.nota)}</p>` : ""}
    </div>
    <div class="elenco-sedi">${sedi}</div>
  </div>
</section>

<section class="sezione domande" id="domande">
  <div class="wrap due-col">
    <h2 data-rivela>${esc(c.faq.titolo)}</h2>
    <div class="faq" data-rivela style="--i:1">${faq}</div>
  </div>
</section>

<section class="contatti" id="contatti">
  <svg class="fondale" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
    <g class="scorre scorre-inverso"><path class="strato-dietro" d="${onda(34, 12)} L2880 80 L0 80 Z" /></g>
    <g class="scorre scorre-lento"><path d="${onda(46, 10)} L2880 80 L0 80 Z" /></g>
  </svg>
  <div class="wrap contatti-in">
    <div class="contatti-testo" data-rivela>
      <h2>${esc(c.contatti.titolo)}</h2>
      <p>${esc(c.contatti.testo)}</p>
      ${recapiti ? `<ul class="recapiti">${recapiti}</ul>` : ""}
    </div>
    <form class="modulo" id="modulo" novalidate data-rivela style="--i:1">
      <div class="riga">
        <label><span>Nome <span aria-hidden="true">*</span></span><input name="nome" autocomplete="given-name" required></label>
        <label><span>Cognome</span><input name="cognome" autocomplete="family-name"></label>
      </div>
      <div class="riga">
        <label><span>Telefono <span aria-hidden="true">*</span></span><input name="telefono" type="tel" autocomplete="tel" required></label>
        <label><span>Email</span><input name="email" type="email" autocomplete="email"></label>
      </div>
      <label><span>Motivo della richiesta <span aria-hidden="true">*</span></span>
        <textarea name="motivo" rows="4" required placeholder="Bastano poche righe."></textarea>
      </label>
      <label class="nascosto" aria-hidden="true">Lascia vuoto<input name="sito" tabindex="-1" autocomplete="off"></label>
      <label class="consenso"><input type="checkbox" name="privacy" required><span>Ho letto l'<a href="/privacy" target="_blank">informativa privacy</a> e acconsento al trattamento dei miei dati, compresi quelli sulla salute che eventualmente indico nel messaggio.</span></label>
      <button class="bottone bottone-chiaro" type="submit">Invia la richiesta</button>
      <p class="esito" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>

</main>
${piede(c)}
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>
<script src="/assets/site.js?v=2" defer></script>
</body>
</html>`;
}

// Testo con titoli ("## ") ed elenchi ("- "), per la pagina privacy
function testoRicco(testo) {
  return String(testo ?? "")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith("## ")) return `<h2>${esc(b.slice(3))}</h2>`;
      const righe = b.split("\n");
      const voci = righe.filter((r) => r.trim().startsWith("- "));
      if (voci.length && voci.length === righe.length - (righe[0].trim().startsWith("- ") ? 0 : 1)) {
        const intro = righe[0].trim().startsWith("- ") ? "" : `<p>${esc(righe[0])}</p>`;
        return intro + `<ul>${voci.map((r) => `<li>${esc(r.trim().slice(2))}</li>`).join("")}</ul>`;
      }
      return `<p>${esc(b).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

export function renderPrivacy(c, { noindex = false } = {}) {
  return `${testa(c, { titolo: "Privacy – " + c.profilo.nome, descrizione: "Informativa privacy", noindex })}
<body class="pagina-semplice">
${intestazione(c, false)}
<main class="wrap testo-pagina">
  <h1>Informativa privacy</h1>
  ${testoRicco(c.privacy.informativa)}
  <p><a class="link" href="/">Torna al sito</a></p>
</main>
${piede(c)}
</body>
</html>`;
}

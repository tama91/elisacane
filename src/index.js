// Worker del sito di Elisa Cane.
// - Pagine pubbliche generate dai contenuti salvati in KV (CONTENT)
// - /admin: pannello statico (public/admin) + API in /admin/api/*
//   (tutto il pannello sta sotto /admin, così si può proteggere con Cloudflare Access)
// - Segreti richiesti: ADMIN_PASSWORD
// - Facoltativi: RESEND_API_KEY + NOTIFY_EMAIL + FROM_EMAIL per l'avviso via email

import { DEFAULT_CONTENT } from "./defaults.js";
import { renderHome, renderPrivacy } from "./render.js";

const DOMINIO = "elisacanepsicologa.it";
const KEY_CONTENT = "content";
const KEY_FOTO = "foto";
const COOKIE = "ec_sessione";
const DURATA_SESSIONE = 60 * 60 * 24 * 7; // 7 giorni
const DURATA_RICHIESTE = 60 * 60 * 24 * 180; // 180 giorni

// Limiti anti-abuso
const LOGIN_MAX_ERRORI = 5; // tentativi sbagliati...
const LOGIN_BLOCCO = 15 * 60; // ...poi blocco per 15 minuti
const MODULO_MAX_ORA = 5; // invii del modulo per ora dallo stesso indirizzo

// Script inline consentito (aggiunge la classe "js" all'html)
const HASH_SCRIPT_INLINE = "'sha256-qOhFsq0QMV2REqNwk5hGH5bZE9SkX6gt6yeyKdYPv+U='";

const CSP = [
  "default-src 'self'",
  `script-src 'self' ${HASH_SCRIPT_INLINE}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // www e vecchio indirizzo di prova -> dominio principale
    if (url.hostname === "www." + DOMINIO || url.hostname.endsWith("tamabase.app")) {
      return Response.redirect(`https://${DOMINIO}${url.pathname}${url.search}`, 301);
    }

    let risposta;
    try {
      risposta = await gestisci(request, env, url);
    } catch (err) {
      console.error(err);
      risposta = json({ errore: "Errore del server" }, 500);
    }
    return conSicurezza(risposta, url);
  },
};

async function gestisci(request, env, url) {
  const path = url.pathname;
  const m = request.method === "HEAD" ? "GET" : request.method;
  const locale = url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (path === "/" && m === "GET") return html(renderHome(await leggiContenuti(env)));
  if (path === "/privacy" && m === "GET") return html(renderPrivacy(await leggiContenuti(env)));
  if (path === "/media/foto" && m === "GET") return servitoFoto(env);
  if (path === "/robots.txt") return testo(`User-agent: *\nDisallow: /admin/\n\nSitemap: https://${DOMINIO}/sitemap.xml\n`);
  if (path === "/sitemap.xml") return sitemap(env);
  if (path === "/admin") return Response.redirect(url.origin + "/admin/", 301);

  // Le richieste che modificano dati devono partire da questo sito
  if (m !== "GET" && m !== "HEAD" && !stessaOrigine(request, url, locale)) {
    return json({ errore: "Richiesta non consentita" }, 403);
  }

  if (path === "/api/contatto" && m === "POST") return riceviContatto(request, env, url);
  if (path.startsWith("/admin/api/")) return apiAdmin(request, env, path.slice("/admin/api".length), locale);

  // Tutto il resto: file statici (stile, script, font, pannello)
  return env.ASSETS.fetch(request);
}

// ---------- Contenuti ----------

async function leggiContenuti(env) {
  const salvati = await env.CONTENT.get(KEY_CONTENT, "json");
  return unisci(DEFAULT_CONTENT, salvati || {});
}

// Unisce i contenuti salvati ai predefiniti, così un campo nuovo
// aggiunto in futuro ha sempre un valore.
function unisci(base, sopra) {
  if (Array.isArray(base)) return Array.isArray(sopra) ? sopra : base;
  if (base && typeof base === "object") {
    const out = { ...base };
    for (const k of Object.keys(base)) {
      if (sopra && k in sopra) out[k] = unisci(base[k], sopra[k]);
    }
    return out;
  }
  return sopra === undefined || sopra === null ? base : sopra;
}

function differenze(base, dati) {
  if (base === null || typeof base !== "object" || Array.isArray(base)) {
    return JSON.stringify(base) === JSON.stringify(dati) ? undefined : dati;
  }
  const out = {};
  for (const k of Object.keys(base)) {
    if (!dati || !(k in dati)) continue;
    const d = differenze(base[k], dati[k]);
    if (d !== undefined) out[k] = d;
  }
  return Object.keys(out).length ? out : undefined;
}

async function servitoFoto(env) {
  const { value, metadata } = await env.CONTENT.getWithMetadata(KEY_FOTO, "arrayBuffer");
  if (!value) return new Response("Nessuna foto", { status: 404 });
  return new Response(value, {
    headers: {
      "content-type": metadata?.type || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

async function sitemap(env) {
  const salvati = await env.CONTENT.getWithMetadata(KEY_CONTENT);
  const oggi = new Date().toISOString().slice(0, 10);
  const pagine = ["/", "/privacy"]
    .map((p) => `<url><loc>https://${DOMINIO}${p}</loc><lastmod>${salvati.metadata?.modificato || oggi}</lastmod></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pagine}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8" } }
  );
}

// ---------- API del pannello (/admin/api/...) ----------

async function apiAdmin(request, env, path, locale) {
  const m = request.method;

  if (path === "/login" && m === "POST") return login(request, env, locale);
  if (path === "/logout" && m === "POST") {
    return json({ ok: true }, 200, { "set-cookie": cookieSessione("", 0, locale) });
  }

  // Da qui in poi serve essere autenticati
  if (!(await autenticato(request, env))) return json({ errore: "Accesso richiesto" }, 401);

  if (path === "/sessione" && m === "GET") return json({ ok: true });

  if (path === "/contenuti" && m === "GET") return json(await leggiContenuti(env));
  if (path === "/contenuti" && m === "PUT") {
    const corpo = await request.text();
    if (corpo.length > 300_000) return json({ errore: "Testi troppo lunghi" }, 413);
    let dati;
    try { dati = JSON.parse(corpo); } catch { dati = null; }
    if (!dati || typeof dati !== "object") return json({ errore: "Dati non validi" }, 400);
    const pulito = unisci(DEFAULT_CONTENT, dati);
    // Si salva solo ciò che è stato cambiato: i campi rimasti uguali ai testi
    // iniziali seguono eventuali aggiornamenti futuri del sito.
    await env.CONTENT.put(KEY_CONTENT, JSON.stringify(differenze(DEFAULT_CONTENT, pulito) || {}), {
      metadata: { modificato: new Date().toISOString().slice(0, 10) },
    });
    return json({ ok: true });
  }

  if (path === "/foto" && m === "POST") {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 4 * 1024 * 1024) return json({ errore: "La foto supera 4 MB" }, 413);
    const tipo = tipoImmagine(new Uint8Array(buf.slice(0, 12)));
    if (!tipo) return json({ errore: "Usa una foto JPG, PNG o WebP" }, 400);
    await env.CONTENT.put(KEY_FOTO, buf, { metadata: { type: tipo } });
    return json({ ok: true, url: "/media/foto?v=" + Date.now() });
  }

  if (path === "/richieste" && m === "GET") {
    const lista = await env.CONTENT.list({ prefix: "req:" });
    const voci = await Promise.all(
      lista.keys.map(async (k) => ({ id: k.name, ...(await env.CONTENT.get(k.name, "json")) }))
    );
    voci.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
    return json(voci);
  }
  if (path.startsWith("/richieste/") && m === "DELETE") {
    const id = decodeURIComponent(path.slice("/richieste/".length));
    if (!id.startsWith("req:")) return json({ errore: "Richiesta non valida" }, 400);
    await env.CONTENT.delete(id);
    return json({ ok: true });
  }
  return json({ errore: "Non trovato" }, 404);
}

// Riconosce il tipo dai primi byte del file, non da ciò che dichiara il browser
function tipoImmagine(b) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

// ---------- Modulo contatti ----------

async function riceviContatto(request, env, url) {
  const d = await request.json().catch(() => null);
  if (!d) return json({ errore: "Dati non validi" }, 400);
  if (d.sito) return json({ ok: true }); // trappola anti-spam: i bot compilano anche il campo nascosto

  const chiave = `rl:modulo:${ip(request)}`;
  const invii = Number(await env.CONTENT.get(chiave)) || 0;
  if (invii >= MODULO_MAX_ORA) {
    return json({ errore: "Hai già inviato diverse richieste. Riprova più tardi o usa i recapiti indicati." }, 429);
  }

  const pulisci = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000b-\u001f]/g, "").trim().slice(0, max);
  const r = {
    nome: pulisci(d.nome, 80),
    cognome: pulisci(d.cognome, 80),
    telefono: pulisci(d.telefono, 40),
    email: pulisci(d.email, 120),
    motivo: pulisci(d.motivo, 2000),
    data: new Date().toISOString(),
  };
  if (!r.nome || !r.telefono || !r.motivo) return json({ errore: "Compila nome, telefono e motivo della richiesta." }, 400);
  if (!/^[\d\s+().-]{6,40}$/.test(r.telefono)) return json({ errore: "Controlla il numero di telefono." }, 400);
  if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) return json({ errore: "Controlla l'indirizzo email." }, 400);
  if (!d.privacy) return json({ errore: "Serve il consenso al trattamento dei dati." }, 400);

  const id = `req:${r.data}:${crypto.randomUUID().slice(0, 8)}`;
  await env.CONTENT.put(id, JSON.stringify(r), { expirationTtl: DURATA_RICHIESTE });
  await env.CONTENT.put(chiave, String(invii + 1), { expirationTtl: 3600 });

  // Avviso via email (facoltativo): senza il motivo, per riservatezza
  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    const unaRiga = (s) => s.replace(/[\r\n]+/g, " ");
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "Sito <onboarding@resend.dev>",
        to: env.NOTIFY_EMAIL,
        subject: `Nuova richiesta di contatto da ${unaRiga(r.nome)}`,
        text: `Hai ricevuto una nuova richiesta dal sito.\n\nNome: ${unaRiga(r.nome)} ${unaRiga(r.cognome)}\nTelefono: ${unaRiga(r.telefono)}\n\nLeggi il messaggio completo nell'area riservata: ${url.origin}/admin/`,
      }),
    })
      .then(async (res) => { if (!res.ok) console.error("Resend", res.status, await res.text()); })
      .catch((e) => console.error("Resend", e));
  }
  return json({ ok: true });
}

// ---------- Accesso ----------

async function login(request, env, locale) {
  if (!env.ADMIN_PASSWORD) return json({ errore: "Password non ancora impostata su Cloudflare." }, 500);

  const chiave = `rl:login:${ip(request)}`;
  const errori = Number(await env.CONTENT.get(chiave)) || 0;
  if (errori >= LOGIN_MAX_ERRORI) {
    return json({ errore: "Troppi tentativi sbagliati. Riprova tra 15 minuti." }, 429);
  }

  const d = await request.json().catch(() => ({}));
  const ok = await uguali(String(d.password || ""), env.ADMIN_PASSWORD);
  if (!ok) {
    await env.CONTENT.put(chiave, String(errori + 1), { expirationTtl: LOGIN_BLOCCO });
    await new Promise((r) => setTimeout(r, 800));
    const restanti = LOGIN_MAX_ERRORI - errori - 1;
    return json(
      { errore: restanti > 0 ? "Password non corretta." : "Troppi tentativi sbagliati. Riprova tra 15 minuti." },
      restanti > 0 ? 401 : 429
    );
  }
  if (errori) await env.CONTENT.delete(chiave);

  const scadenza = Math.floor(Date.now() / 1000) + DURATA_SESSIONE;
  const token = `${scadenza}.${await firma(String(scadenza), env.ADMIN_PASSWORD)}`;
  return json({ ok: true }, 200, { "set-cookie": cookieSessione(token, DURATA_SESSIONE, locale) });
}

// Il cookie vale solo per /admin. Cambiando la password, tutte le sessioni aperte scadono.
function cookieSessione(valore, durata, locale) {
  return `${COOKIE}=${valore}; Path=/admin; HttpOnly; ${locale ? "" : "Secure; "}SameSite=Strict; Max-Age=${durata}`;
}

async function autenticato(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [scadenza, sig] = m[1].split(".");
  if (!scadenza || !sig || Number(scadenza) < Date.now() / 1000) return false;
  return uguali(sig, await firma(scadenza, env.ADMIN_PASSWORD));
}

async function firma(testo, segreto) {
  const chiave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const s = await crypto.subtle.sign("HMAC", chiave, new TextEncoder().encode(testo));
  return [...new Uint8Array(s)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function uguali(a, b) {
  // confronto a tempo costante tramite hash
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const x = new Uint8Array(ha), y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

// ---------- Utilità ----------

function stessaOrigine(request, url, locale) {
  const origine = request.headers.get("origin");
  if (origine) return origine === url.origin;
  // Senza Origin: accettiamo solo se il browser dichiara che la richiesta è dallo stesso sito
  const sito = request.headers.get("sec-fetch-site");
  return sito === "same-origin" || (locale && !sito);
}

function ip(request) {
  return request.headers.get("cf-connecting-ip") || "locale";
}

function conSicurezza(risposta, url) {
  const r = new Response(risposta.body, risposta);
  const h = r.headers;
  h.set("content-security-policy", CSP);
  h.set("x-content-type-options", "nosniff");
  h.set("x-frame-options", "DENY");
  h.set("referrer-policy", "strict-origin-when-cross-origin");
  h.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()");
  h.set("cross-origin-opener-policy", "same-origin");
  if (url.protocol === "https:") h.set("strict-transport-security", "max-age=31536000");
  if (url.pathname.startsWith("/admin")) {
    h.set("x-robots-tag", "noindex, nofollow");
    h.set("cache-control", "no-store");
  }
  return r;
}

function html(body) {
  return new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
  });
}

function testo(body) {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

function json(dati, status = 200, extra = {}) {
  return new Response(JSON.stringify(dati), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });
}

// Worker del sito di Elisa Cane.
// - Pagine pubbliche generate dai contenuti salvati in KV (CONTENT)
// - /admin: pannello statico (public/admin) che usa le API qui sotto
// - Segreti richiesti: ADMIN_PASSWORD
// - Facoltativi: RESEND_API_KEY + NOTIFY_EMAIL + FROM_EMAIL per l'avviso via email

import { DEFAULT_CONTENT } from "./defaults.js";
import { renderHome, renderPrivacy } from "./render.js";

const KEY_CONTENT = "content";
const KEY_FOTO = "foto";
const COOKIE = "ec_sessione";
const DURATA_SESSIONE = 60 * 60 * 24 * 7; // 7 giorni
const DURATA_RICHIESTE = 60 * 60 * 24 * 180; // 180 giorni

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    // Lo staging su tamabase.app non deve finire su Google
    const noindex = url.hostname.endsWith("tamabase.app") || url.hostname.endsWith("workers.dev");

    try {
      if (path === "/" && request.method === "GET") {
        const c = await leggiContenuti(env);
        return html(renderHome(c, { noindex }), noindex);
      }
      if (path === "/privacy" && request.method === "GET") {
        const c = await leggiContenuti(env);
        return html(renderPrivacy(c, { noindex }), noindex);
      }
      if (path === "/media/foto" && request.method === "GET") {
        return servitoFoto(env);
      }
      if (path === "/admin") {
        return Response.redirect(url.origin + "/admin/", 301);
      }
      if (path.startsWith("/api/")) {
        return api(request, env, path);
      }
      if (path === "/robots.txt") {
        return new Response(noindex ? "User-agent: *\nDisallow: /\n" : "User-agent: *\nDisallow: /admin/\n", {
          headers: { "content-type": "text/plain" },
        });
      }
      return new Response("Pagina non trovata", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
    } catch (err) {
      console.error(err);
      return json({ errore: "Errore del server" }, 500);
    }
  },
};

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

// ---------- API ----------

async function api(request, env, path) {
  const m = request.method;

  if (path === "/api/contatto" && m === "POST") return riceviContatto(request, env);
  if (path === "/api/login" && m === "POST") return login(request, env);
  if (path === "/api/logout" && m === "POST") {
    return json({ ok: true }, 200, { "set-cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
  }

  // Da qui in poi serve essere autenticati
  if (!(await autenticato(request, env))) return json({ errore: "Accesso richiesto" }, 401);

  if (path === "/api/sessione" && m === "GET") return json({ ok: true });

  if (path === "/api/contenuti" && m === "GET") {
    return json(await leggiContenuti(env));
  }
  if (path === "/api/contenuti" && m === "PUT") {
    const dati = await request.json().catch(() => null);
    if (!dati || typeof dati !== "object") return json({ errore: "Dati non validi" }, 400);
    const pulito = unisci(DEFAULT_CONTENT, dati);
    // Si salva solo ciò che è stato cambiato: i campi rimasti uguali ai testi
    // iniziali seguono eventuali aggiornamenti futuri del sito.
    await env.CONTENT.put(KEY_CONTENT, JSON.stringify(differenze(DEFAULT_CONTENT, pulito) || {}));
    return json({ ok: true });
  }
  if (path === "/api/foto" && m === "POST") {
    const tipo = request.headers.get("content-type") || "";
    if (!/^image\/(jpeg|png|webp)$/.test(tipo)) return json({ errore: "Usa una foto JPG, PNG o WebP" }, 400);
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 4 * 1024 * 1024) return json({ errore: "La foto supera 4 MB" }, 400);
    await env.CONTENT.put(KEY_FOTO, buf, { metadata: { type: tipo } });
    return json({ ok: true, url: "/media/foto?v=" + Date.now() });
  }
  if (path === "/api/richieste" && m === "GET") {
    const lista = await env.CONTENT.list({ prefix: "req:" });
    const voci = await Promise.all(
      lista.keys.map(async (k) => ({ id: k.name, ...(await env.CONTENT.get(k.name, "json")) }))
    );
    voci.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
    return json(voci);
  }
  if (path.startsWith("/api/richieste/") && m === "DELETE") {
    const id = decodeURIComponent(path.slice("/api/richieste/".length));
    if (!id.startsWith("req:")) return json({ errore: "Richiesta non valida" }, 400);
    await env.CONTENT.delete(id);
    return json({ ok: true });
  }
  return json({ errore: "Non trovato" }, 404);
}

async function riceviContatto(request, env) {
  const d = await request.json().catch(() => null);
  if (!d) return json({ errore: "Dati non validi" }, 400);
  if (d.sito) return json({ ok: true }); // trappola anti-spam
  const pulisci = (v, max) => String(v ?? "").trim().slice(0, max);
  const r = {
    nome: pulisci(d.nome, 80),
    cognome: pulisci(d.cognome, 80),
    telefono: pulisci(d.telefono, 40),
    email: pulisci(d.email, 120),
    motivo: pulisci(d.motivo, 2000),
    data: new Date().toISOString(),
  };
  if (!r.nome || !r.telefono || !r.motivo) return json({ errore: "Compila nome, telefono e motivo della richiesta." }, 400);
  if (!d.privacy) return json({ errore: "Serve il consenso al trattamento dei dati." }, 400);

  const id = `req:${r.data}:${crypto.randomUUID().slice(0, 8)}`;
  await env.CONTENT.put(id, JSON.stringify(r), { expirationTtl: DURATA_RICHIESTE });

  // Avviso via email (facoltativo): senza il motivo, per riservatezza
  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    const origine = new URL(request.url).origin;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "Sito <onboarding@resend.dev>",
        to: env.NOTIFY_EMAIL,
        subject: `Nuova richiesta di contatto da ${r.nome}`,
        text: `Hai ricevuto una nuova richiesta dal sito.\n\nNome: ${r.nome} ${r.cognome}\nTelefono: ${r.telefono}\n\nLeggi il messaggio completo nell'area riservata: ${origine}/admin/`,
      }),
    }).catch((e) => console.error("Resend", e));
  }
  return json({ ok: true });
}

// ---------- Accesso ----------

async function login(request, env) {
  if (!env.ADMIN_PASSWORD) return json({ errore: "Password non ancora impostata su Cloudflare." }, 500);
  const d = await request.json().catch(() => ({}));
  const ok = await uguali(String(d.password || ""), env.ADMIN_PASSWORD);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800));
    return json({ errore: "Password non corretta." }, 401);
  }
  const scadenza = Math.floor(Date.now() / 1000) + DURATA_SESSIONE;
  const token = `${scadenza}.${await firma(String(scadenza), env.ADMIN_PASSWORD)}`;
  return json({ ok: true }, 200, {
    "set-cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${DURATA_SESSIONE}`,
  });
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

function html(body, noindex) {
  const h = {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-cache",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
  };
  if (noindex) h["x-robots-tag"] = "noindex, nofollow";
  return new Response(body, { headers: h });
}

function json(dati, status = 200, extra = {}) {
  return new Response(JSON.stringify(dati), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });
}

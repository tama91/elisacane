# Sito Dott.ssa Elisa Cane

Sito su Cloudflare Workers con pannello di gestione in `/admin`.

## Come è fatto

- `public/` – file statici: stile, script, font, pannello admin
- `src/index.js` – il Worker: genera le pagine, gestisce le API e l'accesso
- `src/defaults.js` – testi iniziali (usati finché non si salva dal pannello)
- `src/render.js` – HTML delle pagine
- I contenuti modificati dal pannello, la foto e le richieste del modulo stanno nel KV `elisacane-content`

## Impostazioni su Cloudflare

Worker `elisacane` → Settings → Variables and Secrets:

- `ADMIN_PASSWORD` (Secret, **obbligatorio**) – password del pannello
- `RESEND_API_KEY`, `NOTIFY_EMAIL`, `FROM_EMAIL` (facoltativi) – email di avviso per ogni nuova richiesta

## Sviluppo in locale

```
npm install
echo "ADMIN_PASSWORD=una-password-di-prova" > .dev.vars
npm run dev
```

## Note

- Su `*.tamabase.app` il sito manda `noindex` in automatico: Google non lo indicizza. Sul dominio finale no.
- Le richieste del modulo si cancellano da sole dopo 180 giorni. L'email di avviso non contiene il motivo della richiesta.
- Al passaggio sul dominio della cliente: aggiungere il dominio in `routes` dentro `wrangler.jsonc`.

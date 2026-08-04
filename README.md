# Panda Smart Home

Marketing site for **Panda Smart Home** (Panda智能家居) — open, local-first smart
home design and installation for Singapore homes, built on Home Assistant.

Single-page bilingual site (English / 简体中文) with no backend. Vite + React 19 +
TypeScript + Tailwind CSS v4.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

The dev server prints a local URL (default <http://localhost:5173>).

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build into `dist/` |
| `npm run preview` | Serve the built `dist/` on port 4173 |
| `npm run lint` | ESLint (flat config, typescript-eslint + React Hooks rules) |
| `npm run typecheck` | TypeScript only, no emit |
| `npm run og` | Regenerate `og-image.png` and the app icons from the brand SVGs |

Run `npm run lint && npm run typecheck && npm run build` before deploying.

---

## Contact details

Live contact details are **not stored in this repository**. They live in
`.env.local`, which is git-ignored, so a fresh clone builds a site with no
contact channels until you supply them.

The working deployment currently has two variables set:

| Variable | Powers |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | The "Message on WhatsApp" button and footer link (`https://wa.me/<number>`) |
| `VITE_CONTACT_EMAIL` | The "Email us" button, the footer link, JSON-LD `email`, and the destination of every enquiry form submission |

To reproduce that build on another machine or in CI, copy `.env.example` to
`.env.local` and fill those two in — or set them as environment variables in
your host's dashboard (Netlify/Vercel/Cloudflare) or as GitHub Actions
repository variables. **They are inlined at build time, so a rebuild is
required after any change.**

> The contact email ends up in the published page markup and will be scraped.
> If spam becomes a problem, point `VITE_CONTACT_EMAIL` at a role address on
> your own domain (e.g. `enquiries@…`) that forwards to the real inbox.

### With a channel unset

Nothing is invented as a placeholder:

* the contact section shows **"Contact details to be confirmed"**;
* the WhatsApp, email and phone buttons/links **do not render at all**;
* the enquiry form is **disabled** with a visible "Form endpoint not
  configured" notice — it will never fake a successful submission;
* the JSON-LD structured data **omits** `email`, `telephone`, `address` and
  `sameAs` rather than publishing empty or fictional values.

### Full variable reference

`.env.example` documents every variable; copy anything you need into
`.env.local`. Each is optional and independent — setting only an email address
is fine, and only that channel appears.

| Variable | Effect when set |
| --- | --- |
| `VITE_COMPANY_NAME` / `VITE_COMPANY_NAME_ZH` | Overrides the footer copyright and JSON-LD business name |
| `VITE_COMPANY_REGISTRATION_NO` | Adds a UEN/registration line to the footer |
| `VITE_CONTACT_EMAIL` | Shows the "Email us" button, footer link and JSON-LD `email` |
| `VITE_CONTACT_PHONE` | Shows a `tel:` link and JSON-LD `telephone` |
| `VITE_WHATSAPP_NUMBER` | Digits only, incl. country code (e.g. `6590000000`). Reveals the WhatsApp buttons; hidden entirely when blank |
| `VITE_OFFICE_ADDRESS_*` | Shows the office address and emits a JSON-LD `PostalAddress` |
| `VITE_FORM_ENDPOINT` | Enables the enquiry form (see below) |
| `VITE_SITE_URL` | Required for correct `canonical`, `hreflang`, `og:url` and absolute `og:image` |
| `VITE_SOCIAL_*` | Adds footer links and JSON-LD `sameAs` entries |

Values that still contain the example placeholder text (`TODO`, `TBD`,
`your-…`) are treated as unset, so a half-filled `.env.local` cannot leak
placeholders onto the page.

Restart the dev server after editing `.env.local`; env values are inlined at
build time, so **production changes require a rebuild**.

### The enquiry form

The form has three modes, picked automatically:

| Config | Behaviour |
| --- | --- |
| `VITE_FORM_ENDPOINT` set | **Current setup.** Posts JSON to the endpoint and shows the success state in-page. The visitor never leaves the site. |
| Endpoint blank, `VITE_CONTACT_EMAIL` set | Fallback: opens the visitor's mail client with the enquiry pre-filled. No backend needed, but depends on them having a mail app — webmail-only users and several mobile browsers get nothing. |
| Both blank | Form disabled with a visible "not configured" notice. Never fakes a submission. |

Live delivery goes through **Web3Forms** to the address in
`VITE_CONTACT_EMAIL`; verified end to end from a browser submission.

#### Other delivery options

| Option | Setup | Notes |
| --- | --- | --- |
| **Web3Forms** | Enter your email at <https://web3forms.com>, they email you an Access Key. No account or password. | Works anywhere, including GitHub Pages. Set `VITE_FORM_ENDPOINT=https://api.web3forms.com/submit` and `VITE_FORM_ACCESS_KEY=<key>`. |
| **Netlify Forms / Cloudflare Pages** | Built into the host if you deploy there. | Submissions land in the host dashboard with email notifications and spam filtering; no third party. Requires deploying on that host. |
| **Formspree / Basin** | Free tier, but needs an account. | Same shape — set `VITE_FORM_ENDPOINT` to the form URL. |
| **Telegram** | Deploy `serverless/telegram-relay.js` as a Cloudflare Worker (free, no CLI). | Instant push to your phone. **The bot token must stay in the Worker** — see below. |
| **Your own API route** | Any serverless function. | Accepts the JSON below and does whatever you want with it. |

#### Telegram delivery

`serverless/telegram-relay.js` is a ready-to-paste Cloudflare Worker that
forwards submissions into a Telegram chat. Deployment steps are in the comment
at the top of that file; it takes about five minutes and needs no CLI.

**Never call the Telegram API directly from the site.** `VITE_*` values are
inlined into the public JS bundle, so a bot token placed there is readable by
anyone — and a leaked token lets them impersonate the bot, call `getUpdates` to
read every message sent to it, and rewrite its webhook. The Worker exists
purely to keep the token server-side; the browser only ever talks to the
Worker, which validates the request origin so it cannot be used as an open
relay.

Once deployed, point `VITE_FORM_ENDPOINT` at the Worker URL and rebuild. No
site code changes.

Run its self-check with:

```bash
node serverless/telegram-relay.test.mjs
```

Telegram is a notification channel, not an archive — messages are easy to lose
in a busy chat. If enquiries matter commercially, keep an emailed copy too:
either add a second `fetch` to the Worker, or forward Telegram alerts manually.

`VITE_FORM_ACCESS_KEY` is sent as `access_key` in the payload. It is a *public*
submission key, not a secret — it only routes mail to the address that
registered it, and cannot read anything back — so it is safe in a client
bundle. Endpoints that don't use one can leave it blank; the field is omitted.

> **Lock the key to your domains.** Because the key ships in the public bundle,
> anyone can copy it and POST from anywhere, which means spam straight to your
> inbox. In the Web3Forms dashboard set **Allowed Domains** to
> `panda00510.github.io` and `pandasmarthome.xunleix8.workers.dev` (plus any
> future custom domain). Web3Forms also has a built-in spam filter and an
> optional hCaptcha if it ever gets abused.

After changing either variable, run `npm run build`. Nothing else changes —
the form switches to true in-page submission on its own.

`VITE_FORM_ENDPOINT` must be an HTTPS URL that accepts a JSON `POST`:

```json
{
  "access_key": "…",
  "subject": "Smart home enquiry — Tan Wei",
  "from_name": "Tan Wei",
  "email": "tan@example.com",
  "name": "Tan Wei",
  "contact": "tan@example.com",
  "homeType": "Condominium",
  "message": "…",
  "language": "en",
  "submittedAt": "2026-01-01T00:00:00.000Z"
}
```

`access_key` appears only when `VITE_FORM_ACCESS_KEY` is set, and `email` only
when the visitor's contact value looks like an email address (it becomes the
reply-to). `subject` and `from_name` are what hosted services use to title the
notification; a custom endpoint can ignore all three.

A 2xx response shows the success state; anything else shows the error state.
The endpoint must send permissive CORS headers for the site's origin.

The form validates name, contact (email **or** phone, ≥ 8 digits) and message
before sending, and includes a hidden honeypot field named `company` — treat
any submission where it is non-empty as spam.

---

## Project layout

```
public/              favicon, social card, app icons, robots.txt, manifest
scripts/make-og.mjs  rasterises the brand SVGs into PNGs (npm run og)
serverless/          optional Cloudflare Worker: form -> Telegram relay
src/
  index.css          the whole design system: colour, type, spacing, components
  config/
    brand.ts         brand names + logo asset paths  ← change the brand here
    site.ts          company, contact, SEO and social config, read from env
  content/
    types.ts         shape of the site copy
    en.ts  zh.ts     all user-facing text, both languages
  i18n/              language context, detection and URL/localStorage sync
  components/
    brand/           PandaMark (glyph) and Wordmark (lockup)
    layout/          Header, Footer
    graphics/        HomePanel — the hero control-panel illustration
    sections/        one file per page section
    Seo.tsx          head sync + JSON-LD structured data
    ui.tsx           Button, SectionHeading, Chip
  assets/            photos, fonts, third-party brand logos (all local)
```

---

## Design system

Defined once in [`src/index.css`](src/index.css) as Tailwind v4 `@theme`
tokens, so everything is available as normal utilities (`bg-bamboo-500`,
`text-ink-600`, `rounded-card`, `shadow-lift`).

* **Colour** — `ink` (near-black neutral ramp) and `paper` carry the page;
  `bamboo` green is the single accent; `ember` is reserved for warmth in
  lighting/comfort contexts only.
* **Type** — Inter (self-hosted variable, Latin) with a native CJK stack for
  Chinese. `html:lang(zh)` switches `--font-zh` automatically.
* **Layout** — `.shell` caps content at 1200px with 20px/32px gutters;
  `.band` sets the vertical rhythm between sections.
* **Components** — `.btn`, `.field`, `.card`, `.eyebrow` are the shared
  primitives; variants live in `src/components/ui.tsx`.

Breakpoints are Tailwind defaults. The layout was checked at 375, 768 and
1440 px.

---

## Branding

Everything brand-related is centralised so it can be swapped without hunting
through components:

* **Names** — `src/config/brand.ts`
* **Glyph** — `src/components/brand/PandaMark.tsx` (renders in `currentColor`)
* **Favicon** — `public/favicon.svg` (theme-aware; inverts in dark mode)
* **Social card** — `public/og-image.svg` → `npm run og`

The favicon and share card are deliberately simple placeholders pending a
final identity. Replace the three files above together, then run `npm run og`.

The panda motif is used sparingly — logo, favicon and share card only — and
never inside page sections.

---

## Internationalisation

English is the default; Chinese is served at `?lang=zh`. Language is chosen
from the URL parameter first, then `localStorage`, then the browser language.
Switching updates `<html lang>`, the URL, the document title and the
structured data.

All copy lives in `src/content/en.ts` and `src/content/zh.ts`, both typed
against `Content` in `src/content/types.ts` — adding a field to one language
fails the type check until the other is updated too.

---

## SEO & accessibility

* Per-language `<title>`, description, keywords, Open Graph and Twitter tags.
* `canonical`, `hreflang` (`en`, `zh-Hans`, `x-default`) and `og:url` — emitted
  only once `VITE_SITE_URL` is set, so no domain is ever guessed.
* JSON-LD `@graph` with `LocalBusiness` / `HomeAndConstructionBusiness`
  (services included as `makesOffer`) and a `FAQPage` built from the FAQ copy.
* Skip link, landmark elements, labelled form fields with `aria-describedby`
  error messaging, an `aria-live` region for submission status, visible focus
  rings, and `prefers-reduced-motion` support.
* The FAQ uses native `<details>`/`<summary>` — keyboard access and
  find-in-page work without JavaScript.
* Images are sized to prevent layout shift; below-the-fold images are lazy.

`public/robots.txt` has a commented-out `Sitemap:` line — point it at the real
origin before launch.

---

## Deployment

### GitHub Pages (configured)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
It runs lint, typecheck and the relay self-check first, so a broken commit
fails the deploy instead of shipping.

Live at **<https://panda00510.github.io/pandasmarthome/>**.

Because `.env.local` is git-ignored, the CI build reads contact details from
**repository variables** instead (Settings → Secrets and variables → Actions →
Variables). Currently set: `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`,
`VITE_WHATSAPP_NUMBER`. Add `VITE_FORM_ENDPOINT` / `VITE_FORM_ACCESS_KEY`
there too when you wire up form delivery — the workflow already passes them
through. Changing a variable needs a re-run of the workflow to take effect.

A project page is served from `/<repo>/`, so the build sets `BASE_PATH`
accordingly (see `vite.config.ts`). Local `npm run dev` and `npm run preview`
stay at the root; to reproduce the sub-path build locally:

```bash
BASE_PATH=/pandasmarthome/ npm run build && BASE_PATH=/pandasmarthome/ npm run preview
```

> **Known limitation of project pages:** crawlers read `robots.txt` from the
> domain root (`panda00510.github.io/robots.txt`), which belongs to your user
> site — not to this repo. The `public/robots.txt` here is effectively ignored
> until the site moves to its own domain.

### Cloudflare mirror

<https://pandasmarthome.xunleix8.workers.dev> serves the same repo via
Cloudflare Workers Builds (connected to GitHub, rebuilds on push to `main`).

It is a **mirror, not the primary**. GitHub Pages is canonical, so the
Cloudflare build must use the *same* `VITE_SITE_URL` as Pages — that makes
every page on the mirror emit `<link rel="canonical">` pointing back at
GitHub Pages, which is what stops the two copies competing as duplicate
content.

These must be **build-time** variables, not runtime ones. Cloudflare has two
separate panels and only one of them works here:

| Panel | What it does | Use it? |
| --- | --- | --- |
| Settings → **Variables and Secrets** | Runtime bindings, handed to a Worker script on each request | ❌ Never reaches the build; a static bundle cannot read these |
| Settings → **Build** → variables/secrets | Environment of the container that runs `npm run build` | ✅ This one |

Vite inlines `VITE_*` at build time, so a value that is not present while
`npm run build` runs simply does not exist in the output. Symptom: the deploy
succeeds and the bundle hash changes, but the site still shows "Contact details
to be confirmed".

Values (plain text — none are secret):

| Variable | Value |
| --- | --- |
| `VITE_SITE_URL` | the **GitHub Pages** URL, not the workers.dev one |
| `VITE_CONTACT_EMAIL` | same as the GitHub repo variable |
| `VITE_WHATSAPP_NUMBER` | same as the GitHub repo variable |
| `VITE_FORM_ENDPOINT` | `https://api.web3forms.com/submit` |
| `VITE_FORM_ACCESS_KEY` | same as the GitHub repo variable |

Leave `BASE_PATH` **unset** here — Cloudflare serves from the domain root, so
the default `/` base is correct. Setting it would break every asset URL.

If the two panels are hard to tell apart in the dashboard, sidestep them
entirely by inlining the values into the **build command**, which always runs
in a shell:

```bash
VITE_SITE_URL=https://panda00510.github.io/pandasmarthome VITE_CONTACT_EMAIL=you@example.com VITE_WHATSAPP_NUMBER=6500000000 VITE_FORM_ENDPOINT=https://api.web3forms.com/submit VITE_FORM_ACCESS_KEY=your-key npm run build
```

To confirm a build actually picked the values up, grep the deployed bundle —
if this prints nothing, the variables did not reach the build:

```bash
curl -s https://pandasmarthome.xunleix8.workers.dev/ | grep -o '/assets/index-[^"]*\.js' | head -1
```

Two things to be aware of on this deployment:

* Unknown paths currently return `200` with `index.html` (single-page-app
  fallback). This site has no client-side routing, so that produces soft-404s;
  switching the Worker's not-found handling to a real 404 is more correct.
* `robots.txt` *does* work here, unlike on GitHub Pages project sites — but
  since Pages is canonical, leave the crawl directives pointing there.

### Any other static host

`dist/` is plain static files — Netlify, Vercel, Cloudflare Pages, S3 +
CloudFront and nginx all work with no server runtime.

1. Set at minimum `VITE_SITE_URL`, plus whichever contact channels are real.
2. Leave `BASE_PATH` unset when serving from a domain root.
3. `npm run lint && npm run typecheck && npm run build`
4. Point `Sitemap:` in `public/robots.txt` at the real origin.
5. Re-run `npm run og` if the brand artwork changed.

---

## Content accuracy

Claims about Home Assistant (open source, local-first, stewarded by the Open
Home Foundation, 1,500+ integrations, Matter/Thread/Zigbee/Z-Wave support) are
taken from <https://www.home-assistant.io> and attributed on the page.

The site contains **no invented company history, founding date, awards,
certifications, partner relationships, customer counts or prices**. Anything of
that kind must be added deliberately, with evidence.

Asset provenance and licences: [ASSET_SOURCES.md](ASSET_SOURCES.md).

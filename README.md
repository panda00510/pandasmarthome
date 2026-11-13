# Panda Smart Home

Marketing site for **Panda Smart Home** (Panda智能家居) — open, local-first smart
home design and installation for homes across Singapore.

Bilingual static site (English at `/`, 简体中文 at `/zh/`) with a guides section and no backend. Vite + React 19 +
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
| `node scripts/check-form.mjs --dry` | Self-test of the weekly live form check (no requests); see [Weekly form check](#weekly-form-check) |

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
| `VITE_PLAUSIBLE_DOMAIN` | Counts the conversion events below in Plausible (cookie-free) |
| `VITE_PLAUSIBLE_SRC` | Plausible script URL; defaults to `https://plausible.io/js/script.js` (set for self-hosted or proxied Plausible) |
| `VITE_GA_MEASUREMENT_ID` | `G-…` ID; counts the same events in Google Analytics 4, with consent mode set to *denied* so no cookies are written |

Values that still contain the example placeholder text (`TODO`, `TBD`,
`your-…`) are treated as unset, so a half-filled `.env.local` cannot leak
placeholders onto the page.

Restart the dev server after editing `.env.local`; env values are inlined at
build time, so **production changes require a rebuild**.

### Conversion events

`src/lib/track.ts` sends a handful of events to whichever service is
configured above (both at once is fine). **With neither variable set it does
nothing and no third-party script is loaded** — same rule as the contact
channels. The script is added after the page's `load` event, so it never
delays the first screen.

Clicks are picked up by one listener on `document`: links are recognised by
their `href`, everything else opts in with `data-track="<event>"`
(`data-track-<key>="…"` become props). Every event carries `page` (the path)
and `lang`; nothing from the form and nothing about the visitor is ever sent.

| Event | When | Extra props |
| --- | --- | --- |
| `whatsapp_click` | any `wa.me` link | `source`: `floating`, `contact`, `hero`, `footer`, `products`, `hardware`, `signage`, `software`, `guide`, `solution`, `home`, `plan` (plan starter), `bar` (phone bottom bar), `hardware-brief`, `software-brief` (project briefs), `page` (anything else), or `data-track-source` |
| `email_click` / `tel_click` | any `mailto:` / `tel:` link | — |
| `showroom_open` | any link to `/showroom/` | — |
| `nav_cta_click` | the header "Book a consultation" button | — |
| `lang_switch` | the EN / 中文 toggle | `to` |
| `contact_form_submit` | the form was accepted by the endpoint, or handed to the mail app | `method`: `endpoint` / `mailto` |
| `contact_form_error` | the endpoint rejected or failed | — |
| `plan_starter_complete` | the homepage plan starter ("Show my starting list") | `home`: `hdb` / `condo` / `landed`; `rooms`: `1-2` / `3` / `4+`; `priorities`: comma-separated ids (`lighting`, `aircon`, `curtains`, `security`, `safety`, `care`, `voice`, `energy`) |
| `hardware_brief_complete` | the project brief on /custom-hardware/ | `device`, `connect`, `quantity` (`one` / `batch`), `timing` (`none` / `months` / `date`); option ids, comma-separated where multi-select |
| `software_brief_complete` | the project brief on /software/ | `need`, `users`, `connect`, `timing`; option ids only |

The Worker sends a Content-Security-Policy (see "Deployment") that already
allows Plausible (`plausible.io`), GA4, Cloudflare Web Analytics and the
Web3Forms endpoint. **A custom `VITE_PLAUSIBLE_SRC` host, or a
`VITE_FORM_ENDPOINT` other than Web3Forms (such as the Telegram relay
Worker), must be added to `script-src` / `connect-src` in `worker/index.js`
first** — otherwise the browser blocks it, the enquiry form fails quietly,
and the weekly server-side form check will not notice.

### The enquiry form

The homepage plan starter can pre-fill this form (home type, "start with"
when there is a one-to-one match, and the message) through an in-memory
window event — nothing is stored or put in the URL. It never touches name or
contact, and never overwrites what the visitor typed: with text already in
the message field the summary is appended once. The option mapping is by
index into `contact.form.*Options` in `Planner.tsx`; keep it in step when
reordering those options.

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
> `smartpanda.sg`, `www.smartpanda.sg`, `panda00510.github.io` and
> `pandasmarthome.xunleix8.workers.dev`. Web3Forms also has a built-in spam filter and an
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

#### Weekly form check

A form whose backend quietly broke looks exactly like a quiet week.
`.github/workflows/form-check.yml` runs `scripts/check-form.mjs` against the
**live** site every Monday at 09:00 Singapore time (`0 1 * * 1`, i.e. 01:00 UTC;
scheduled runs can start a little late), and on demand from Actions → Weekly
form check → Run workflow. It checks what is deployed, not the repo config:

1. `/` and `/zh/` return 200 and show neither "Form endpoint not configured"
   nor "Contact details to be confirmed" (or the Chinese equivalents); the
   endpoint inlined from `VITE_FORM_ENDPOINT` can be read out of the page's JS
   chunks and equals the repository variable.
2. The endpoint answers a CORS preflight (`OPTIONS`, `Origin:
   https://smartpanda.sg`, `Access-Control-Request-Method: POST`) with a 2xx
   that allows the origin — a 4xx here is only a warning, because Web3Forms
   refused this non-browser preflight with 403 when the check was written
   while browsers submit normally — and a **deliberately invalid** POST — no
   `access_key`, honeypots `company` and `botcheck` filled — with a
   structured rejection (4xx, or JSON `success: false`). With no key the
   service has no inbox to deliver to, so this never sends mail. A 5xx, a
   timeout or a DNS failure fails the check; so does a 2xx that accepts it.
3. `/showroom/` is 200, a made-up path is 404, and the homepage has the
   `wa.me` link when `VITE_WHATSAPP_NUMBER` is set.

**A failed run is the alert.** GitHub sends notifications for a scheduled
workflow to the person who created it, or who last changed its `cron` line
(normally the owner, who pushes it), according to their Settings →
Notifications → Actions choice — keep email for failed workflows on. GitHub
also disables schedules in a public repo after 60 days without repository
activity; re-enable it from the Actions tab.

**Optional real submission.** The steps above prove the service is up, not
that the access key still works. Set the repository variable
`FORM_CHECK_REAL_SUBMIT=true` (or tick *real_submit* on a manual run) and the
check also sends one real submission titled "[Automated check] Enquiry form
OK — smartpanda.sg", using the key from the live bundle. Off by default: on
it means **one email every Monday**. Web3Forms documents that server-side
submissions need a paid plan and an IP safelist, and GitHub's runner IPs
change, so on the free plan expect this step to fail with a 403; test the key
from a browser instead (submit the form yourself).

**When it fails**, the log says what in English and Chinese. Typical causes:
a `VITE_*` variable changed without a redeploy (re-run Deploy); the form
service is down (check its status page, then submit the form yourself); the
key was revoked or the domain lock changed (Web3Forms dashboard). Re-run the
workflow once fixed.

`node scripts/check-form.mjs --dry` runs the parser self-test and prints the
plan without making any request; CI runs it next to the Worker self-checks.

---

## Project layout

```
AGENTS.md            working rules for coding agents (Claude Code / Codex), in Chinese
public/              favicon, social card, app icons, manifest
  og/                per-page share cards, <key>-<lang>.png (npm run og, committed)
    guides/          one card per guide, <slug>-<lang>.jpg (npm run og, committed)
  media/             showroom clip + poster (scripts/record-showroom.mjs, committed)
scripts/make-og.mjs  rasterises the brand SVGs into PNGs (npm run og)
scripts/prerender.mjs  writes one static HTML file per page into dist/
scripts/indexnow.mjs   pings IndexNow with changed URLs after deploy
scripts/record-showroom.mjs  records the homepage showroom clip (see "Showroom clip")
serverless/          optional Cloudflare Worker: form -> Telegram relay
src/
  index.css          the whole design system: colour, type, spacing, components
  config/
    brand.ts         brand names + logo asset paths  ← change the brand here
    site.ts          company, contact, SEO and social config, read from env
    ogImages.ts      per-page share cards: text, alt, and the path -> image lookup
  content/
    types.ts         shape of the site copy
    en.ts  zh.ts     all user-facing text, both languages
    guides/          articles, one Markdown file per language (see "Guides")
    pages/           topic pages (solutions, home types, how-it-works, about, privacy), same format
    guides.ts        loads the articles; page list and per-page title/description
    glossary.en.ts  glossary.zh.ts   /glossary/ terms, one file per language (loaded only on that page)
  i18n/              language context and path helpers (/ vs /zh/)
  lib/track.ts       optional conversion events (see "Conversion events")
  lib/whatsapp.ts    every wa.me link, and each page's pre-filled opening line (copy in content `whatsapp`)
  views.ts           which chunk each page loads (see "Split per page")
  hooks/motion.ts    scroll reveal (never hides what is on screen at load)
  components/
    brand/           PandaMark (glyph) and Wordmark (lockup)
    layout/          Header (with the "Custom" dropdown), Footer
    graphics/
      HomePanel.tsx        the hero control-panel illustration
      ProductFigures.tsx   desk-device drawings (products + custom hardware)
      SignageFigures.tsx   signage hero drawing (screen + door panel + console)
      GuideFigures.tsx     article figures
    sections/        one file per page section, including:
      Hero.tsx       first screen + trust strip; renders Showroom after it
      Showroom.tsx   homepage 3D showroom band: lazy looping clip + links to /showroom/, ?plan=
      Custom.tsx     homepage band: custom hardware + custom software + signage
      Hardware.tsx   the /custom-hardware/ page
      Signage.tsx    the /signage/ page (Panda Signage)
      Home.tsx       the homepage, section by section
      NotFound.tsx   the 404 page
      Glossary.tsx   the /glossary/ page (+ its DefinedTermSet JSON-LD)
      Planner.tsx    homepage "plan starter": three questions → device groups from products.install (copy in content `planner`); its form button pre-fills the enquiry form
    Choices.tsx      pill radio / checkbox groups shared by the plan starter and the briefs
    ProjectBrief.tsx the project brief on /custom-hardware/ and /software/ (copy in content `hardware.brief` / `software.brief`)
    ui.tsx           Button, SectionHeading, Chip, PhotoTag
    Seo.tsx          head sync + JSON-LD structured data
  entry-server.tsx   prerender entry: routes, sitemap, robots, llms.txt
  assets/            photos, fonts (all local)
```

Pages (each also under `/zh/`): `/`, `/solutions/…`, `/homes/…`,
`/how-it-works/`, `/guides/…`, `/products/`, `/software/`,
`/custom-hardware/`, `/signage/`, `/renovation-checklist/`, `/glossary/`, `/about/`, `/privacy/`. The 3D showroom is a separate build at `/showroom/`.

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
  primitives; variants live in `src/components/ui.tsx`. Linked cards
  (`a.card`) lift on hover; reduced motion keeps only the colour change.
* **Buttons** — `primary` (brand green), `secondary`, `ghost`, `inverse`, and
  for ink bands `glow` (bright bamboo with dark text, ≈7:1) and `outlineDark`.
* **Elevation** — `shadow-soft`, `shadow-lift`, plus `shadow-stage` (deep
  shadow for panels on ink) and `shadow-glow` (the primary CTA on ink only).
  Radii: `rounded-card` 1.25rem, `rounded-panel` 1.75rem.
* **Dark bands** — `.stage-grid` (fine grid fading from the top) and
  `.stage-glow` (slow green glow, stopped by reduced motion) behind the hero,
  the showroom band and the custom-hardware hero. `.numeral` sets tabular
  index numbers (01, 02 …). Bands alternate paper / paper-alt / ink.
* **Motion** — CSS transform and opacity only. First-screen content never
  depends on an animation or a scroll to be visible; `[data-reveal]` hiding
  is added by JS and only below the fold.

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

The glyph was supplied by the site owner. Its geometry lives in exactly one
file, `src/components/brand/pandaPath.ts`; the favicon, share card and all
four PNGs are generated from it by `npm run og`. Edit that file, run the
script, done — do not hand-edit `public/favicon.svg`, it is overwritten.

The panda motif is used sparingly — logo, favicon and share card only — and
never inside page sections.

### Per-page share cards

Each main page has its own 1200×630 card in `public/og/<key>-<lang>.png`
(Solutions, Homes, Products, Software, Custom hardware, Signage, Guides,
How it works, the Chinese homepage, and an English one for the showroom).
The text, `og:image:alt` and the lookup live in `src/config/ogImages.ts`;
the prerender and `Seo.tsx` both use `ogImageFor(lang, path)`, matched on the
first path segment, so `/solutions/…` sub-pages share their section's card.
Anything unmatched, and the English homepage, falls back to `/og-image.png`.
The showroom's card is referenced directly in `showroom/index.html`;
`showroom-zh.png` is used by `/showroom/zh/`, a second HTML page the showroom
build writes (`showroom/tools/zhPage.js`): the same app with Chinese meta
tags and `<base href="../">`. Both pages carry reciprocal hreflang and are in
the sitemap. Chinese pages link to it through `showroomHref()` in
`src/lib/showroom.ts`; old `/showroom/?lang=zh` links still work.

Every guide has its own card, `public/og/guides/<slug>-<lang>.jpg`.
`npm run og` draws it from the guide's `heading` (or `title`) front matter,
wrapping and shrinking the title to fit; Chinese titles break at
punctuation. These are JPEG (~30–36 KB each) because palette PNGs went over
60 KB and banded in the glow. A guide without a card falls back to the
Guides card and the build prints a warning. **Re-run `npm run og` after
adding a guide or changing a heading**, look at the new card, and commit.

**The cards are generated locally on macOS and committed — CI never renders
them.** The Chinese cards use PingFang SC, which Ubuntu runners do not have;
librsvg would silently substitute another font or draw empty boxes. `npm run og`
skips the cards on any other OS. After editing a card, run `npm run og`, open
each changed PNG to check for overflow and missing glyphs, then commit it
(each card is ~45–55 KB; keep them under 60 KB).

### Showroom clip

The homepage showroom band plays a 13 s loop recorded from the showroom's own
auto demo (dark flat → come home, lights on → fly into the living room over
the walls → movie scene):
`public/media/showroom-demo.mp4` (H.264, ≤ 1.2 MB), `showroom-demo.webm`
(VP9, ≤ 900 KB) and `showroom-demo-poster.webp` (≤ 60 KB), all 1280×720,
30 fps, no audio. Like the share cards they are **recorded locally on macOS
and committed**; CI never records.

```bash
node scripts/record-showroom.mjs   # builds showroom/, serves it on :4178, records, encodes, stops the server
```

The script opens `?plan=4room&demo=1&clean=1` (`clean=1` is focus mode without
hotspots or the exit button) in a headed Chromium, captures it with the
DevTools screencast, cuts on the demo's step changes into one continuous take, then encodes with ffmpeg. It needs
no npm dependency: Playwright is taken from the repo if installed, else from
the npx cache that the Playwright MCP server leaves (run
`npx --yes @playwright/mcp@latest --help` once if it is missing), or from
`PLAYWRIGHT_CORE=/path/to/playwright-core`; Chromium from
`~/Library/Caches/ms-playwright` (or `CHROMIUM=`). Quality knobs:
`CRF_H264` (26), `CRF_VP9` (41), `POSTER_AT` (6.6 s), `POSTER_Q` (80),
`SCALE` (`1280:720`). Re-record whenever the showroom's look or demo changes,
then watch the clip and check the sizes it prints.

On the page nothing is fetched until the band is on screen: the prerendered
HTML has only the lazy poster `<img>` (with width/height); the `<video>` and
its sources are mounted the first time the card is 30 % visible, and it
pauses off screen. With reduced motion or Save-Data it never autoplays —
the poster and a play button only. The pause/play button is always visible
(WCAG 2.2.2).

---

## Internationalisation

The language is part of the path: English at `/`, Chinese at `/zh/`, and every
page exists under both (`/guides/…` and `/zh/guides/…`). Each is a separate
prerendered HTML file, so crawlers get real Chinese markup. The language toggle
is a plain link to the same page in the other language; there is no browser
detection or `localStorage`. Old `/?lang=zh` links redirect to `/zh/`.

Helpers in `src/i18n/context.ts`: `pageHref(lang, path)` for links (includes
`BASE_URL`), `langPath(lang, path)` for absolute URLs with `site.url`.

All copy lives in `src/content/en.ts` and `src/content/zh.ts`, both typed
against `Content` in `src/content/types.ts` — adding a field to one language
fails the type check until the other is updated too.

---

## SEO & accessibility

* Per-language `<title>`, description, keywords, Open Graph and Twitter tags.
* `canonical`, `hreflang` (`en`, `zh-Hans`, `x-default`) and `og:url` — emitted
  only once `VITE_SITE_URL` is set, so no domain is ever guessed.
* JSON-LD `@graph` with `LocalBusiness` / `HomeAndConstructionBusiness`
  (services included as `makesOffer`, `areaServed` = Singapore + its five
  regions), a `FAQPage` built from the FAQ copy, and a `WebSite` node.
* JSON-LD `Article` + `BreadcrumbList` on every guide page.
* `/glossary/`: `DefinedTermSet` + one `DefinedTerm` per entry (`url` = the
  term's `#id` anchor); `llms.txt` lists each term with its first sentence. The
  build fails if the two languages list different term ids or a term links to
  a page that does not exist.
* **Prerendered.** `npm run build` also renders every page in both languages on
  the server (`src/entry-server.tsx` → `scripts/prerender.mjs`) and writes
  `dist/[zh/]<path>/index.html`, so crawlers that skip JavaScript (most AI bots, Bing's
  first pass) still see the full copy, JSON-LD and canonical links. The browser
  re-renders on load; there is no hydration to keep in sync.
* **Split per page.** The browser bundle carries only React, the header,
  footer and head sync; the page's language (`content/en.ts` *or* `zh.ts`),
  its view (`src/views.ts`) and, on an article, its Markdown body are separate
  chunks. `src/main.tsx` awaits exactly those, then renders — the
  prerendered HTML stays on screen until then, so nothing flashes. The
  prerender adds a `<link rel="modulepreload">` for each (from the Vite
  manifest, deleted afterwards), and fills every chunk statically itself.
  Guide lists use front matter only (`?front`, a small plugin in
  `vite.config.ts` that also counts reading time).
* **404.** Unknown addresses render the 404 view; the prerender writes it to
  `dist/404.html` and `dist/zh/404.html` with `noindex` and no canonical, and
  it is not in the sitemap or `llms.txt`.
* `robots.txt` (explicitly allows Bingbot, Applebot and the named AI
  crawlers), `sitemap.xml` (with `en` / `zh-Hans` / `x-default` alternates),
  `llms.txt` (brand brief, core pages, services, guides) and `llms-full.txt`
  (full text of every guide and topic page) are **generated at build** from
  the copy and `VITE_SITE_URL` — there is no hand-written copy in `public/`.
* Guide titles longer than ~60 characters (~30 CJK) drop the brand suffix in
  `<title>` so the words that matter are not truncated (`pageMeta` in
  `src/content/guides.ts`).
* JSON-LD nodes carry `@id`s (`#business`, `#website`, `#webpage`/`#article`,
  `#breadcrumb`, `#faq`) and reference each other; index pages get a
  `CollectionPage`/`WebPage` node and a breadcrumb. SEO/GEO plan and the
  owner's to-do list: [SEO_GEO_PLAN.md](SEO_GEO_PLAN.md).
* Sitemap `lastmod` is real: guide pages use their `updated` date; other pages
  use the last git commit touching `src/` or `index.html` (the showroom uses
  `showroom/`). CI checks out full history (`fetch-depth: 0`) for this — a
  shallow clone would stamp every page with today.
* **IndexNow.** After the Cloudflare deploy, `scripts/indexnow.mjs` sends the
  URLs whose `lastmod` changed since the previous deploy to Bing and the other
  IndexNow engines. The key file `public/3bda083900f886a126076308efacb0f3.txt`
  is public by design; don't delete it. Google ignores IndexNow and reads the
  sitemap instead.
* Skip link, landmark elements, labelled form fields with `aria-describedby`
  error messaging, an `aria-live` region for submission status, visible focus
  rings, and `prefers-reduced-motion` support.
* The FAQ uses native `<details>`/`<summary>` — keyboard access and
  find-in-page work without JavaScript.
* Images are sized to prevent layout shift; below-the-fold images are lazy.

After deploying, submit `<VITE_SITE_URL>/sitemap.xml` in Google Search Console
and Bing Webmaster Tools — both need the site owner to verify the property.

---

## Deployment

### GitHub Pages (configured)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
It runs lint, typecheck and the relay self-check first, so a broken commit
fails the deploy instead of shipping.

Live at **<https://panda00510.github.io/pandasmarthome/>** — a secondary copy.
The canonical host is **<https://smartpanda.sg/>** on Cloudflare (see below);
this copy's canonical links point there.

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
> site — not to this repo. The generated `robots.txt` is effectively ignored
> there (everything is crawlable by default anyway), so submit the sitemap
> manually in Search Console / Bing Webmaster Tools. This is also why
> Cloudflare, not Pages, is the canonical host.

### Cloudflare (canonical)

Canonical URL: **<https://smartpanda.sg/>** — the value of `VITE_SITE_URL`.
Submit `https://smartpanda.sg/sitemap.xml` in Google Search Console and Bing
Webmaster Tools.

`www.smartpanda.sg` and the old `pandasmarthome.xunleix8.workers.dev` address
answer with a 301 to `smartpanda.sg` (the `CANONICAL_HOST` var in
`wrangler.jsonc`, handled by `worker/index.js`).

Both hosts are published by **one** GitHub Actions run
(`.github/workflows/deploy.yml`). There is a single set of variables — the
repository variables — so the two copies cannot drift apart.

Cloudflare's own Workers Builds is **not** used and must stay disconnected
(Worker → Settings → Build → **Disconnect**). If both pipelines are live they
race each other and whichever finishes last wins.

Required GitHub secrets (Settings → Secrets and variables → Actions →
Secrets):

| Secret | Where to get it |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard URL, or Workers overview → Account ID |

Until `CLOUDFLARE_API_TOKEN` exists the Cloudflare step is skipped, so the
Pages deploy still succeeds on its own.

The workflow builds **twice** — Pages needs `BASE_PATH=/<repo>/`, Cloudflare
serves from the domain root and must have it unset. It also fails the run if
`VITE_*` variables were set but did not make it into the bundle, which is the
exact failure that made the mirror render as unconfigured.

`wrangler.jsonc` defines the Worker: a small script (`worker/index.js`) in
front of the `dist` assets, with `not_found_handling: "none"` so unknown paths
return a real 404 instead of soft-404ing the homepage. For a page request
(`Accept: text/html`, or an address with no file extension) the Worker swaps
that empty 404 for `dist/404.html` (`/zh/404.html` under `/zh/`), still with
status 404; a missing `.js` or image keeps its bare 404. This is done in the
Worker rather than with `not_found_handling: "404-page"`, which would answer
missing files with HTML too. GitHub Pages serves the root `404.html` by
itself (in English; a `/zh/…` miss turns Chinese once the script runs). The
script does the
host and moved-page 301s and adds the security headers (HSTS,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and a
Content-Security-Policy) to every response. The CSP is enforced, exists only
on Cloudflare (the Pages mirror has no Worker), and `/showroom/` gets its own
policy with Google Fonts and a hash for the one `onload` handler in
`showroom/index.html` (the self-check recomputes that hash, and checks the
generated `/showroom/zh/` copy keeps the handler byte-identical). To roll back,
rename the header to `Content-Security-Policy-Report-Only`. All of this is in code rather than `public/_headers`, because with
`run_worker_first` the response comes from the Worker. Self-check:
`node worker/index.test.mjs`.

#### Why not Cloudflare Workers Builds

The mirror was originally built by Cloudflare's own Git integration, and it
could not be made to see the `VITE_*` values. Deploys succeeded and the bundle
hash changed on every push, yet every variable was absent from the output, so
the site rendered as though nothing was configured. That held true both with
Cloudflare's build variables panel and with the values inlined directly into
the build command — while the identical inline command reproduced perfectly in
a local POSIX shell, which ruled out Vite.

Rather than keep debugging someone else's build container, the build moved to
GitHub Actions, which was already producing a correct bundle for Pages. One
build, one set of variables, no second place for configuration to go stale.

Verify a deploy actually picked the values up:

```bash
curl -s https://smartpanda.sg/ | grep -o '/assets/index-[^"]*\.js' | head -1
```

Fetch that bundle and grep it for a known value; the workflow now runs the
same check itself and fails the build if it comes up empty.

### Pull request checks and Dependabot

`.github/workflows/ci.yml` runs on every pull request: lint, typecheck, the
relay / Worker / form-check self-tests, `npm run build`, and the showroom's
lint and build. It deploys nothing and uses no secrets or variables.

`.github/dependabot.yml` opens update PRs every Monday (09:00 Singapore time)
for the site's npm packages, the showroom's, and the GitHub Actions used by
the workflows. Minor and patch updates are grouped into one PR per directory;
each major version gets its own PR. **Merging into `main` deploys the site**,
so wait for the CI check to pass (and read the changelog of a major bump)
before merging.

### Any other static host

`dist/` is plain static files — Netlify, Vercel, Cloudflare Pages, S3 +
CloudFront and nginx all work with no server runtime.

1. Set at minimum `VITE_SITE_URL`, plus whichever contact channels are real.
2. Leave `BASE_PATH` unset when serving from a domain root.
3. `npm run lint && npm run typecheck && npm run build`
4. Re-run `npm run og` if the brand artwork changed.

---

## Guides

Articles live in `src/content/guides/` as `<slug>.en.md` and `<slug>.zh.md`.
**Both languages are required**; the build fails if one is missing. The slug
becomes the URL: `/guides/<slug>/` and `/zh/guides/<slug>/`.

```markdown
---
title: Page title (the brand suffix is added automatically)
description: Meta description, about 150 characters
published: 2026-09-23
updated: 2026-09-23
draft: true
---
Body in Markdown.
```

* `draft: true` shows the article in `npm run dev` only. Delete the line to publish.
* Bump `updated` on every real edit. It drives the sitemap `lastmod` and IndexNow.
* Supported Markdown: `##` / `###` headings, `-` and `1.` lists, paragraphs,
  `**bold**`, `[links](/zh/#contact)`. Root-relative links get the base path added.
* Publishing = commit and push. The deploy regenerates the sitemap and
  `llms.txt` and pings IndexNow.
* Same rules as the rest of the site: no invented prices, statistics, customer
  stories or awards.
* The printable checklist at `/renovation-checklist/` is not Markdown (the
  renderer has no tables or checkboxes): it is a small view,
  `src/components/sections/Checklist.tsx`, with its copy in `content/en.ts` /
  `zh.ts` (`checklist`) and its `@media print` rules at the end of
  `src/index.css`. Every line restates one of the guides it links to.

---

## Content accuracy

The site contains **no invented company history, founding date, awards,
certifications, partner relationships, customer counts or prices**. Anything of
that kind must be added deliberately, with evidence.

Asset provenance and licences: [ASSET_SOURCES.md](ASSET_SOURCES.md).

## 3D 样板间 `showroom/`

一个独立的 Vite 项目，构建产物挂在 `/showroom/`。源码和本站放在同一个仓库，
但**不参与本站的构建流程**：它是 JS 项目，eslint 只扫 `.ts/.tsx`，
`tsconfig.app.json` 只 include `src`，两边互不干扰。

```bash
cd showroom
npm ci
npm run dev      # 独立开发，默认 5173
```

产物**不进版本库** —— `.github/workflows/deploy.yml` 在部署时构建一次，
复制进两次站点构建的 `dist/showroom/`。想在本地完整预览（站点 + 样板间）：

```bash
npm run build:all
npm run preview
```

它的资源用**相对路径**引用，所以 Pages（`/pandasmarthome/`）和 Cloudflare（`/`）
两个 base 共用同一份产物，不像本站那样需要构建两遍。

语言跟随本站的 `?lang=` 参数：`/showroom/?lang=zh` 直接以中文打开。

`showroom/tools/` 是 Blender 烘焙管线（把全局光照烘成贴图），
用法见 [showroom/tools/README.md](showroom/tools/README.md)。

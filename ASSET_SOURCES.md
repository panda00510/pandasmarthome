# Asset sources & licences

Every asset used by this site is stored **inside the repository**. Nothing is
hot-linked from a third-party server at runtime.

Machine-readable provenance for the photographs lives in
[`src/assets/photos/_credits.json`](src/assets/photos/_credits.json), which was
written directly from the Wikimedia Commons API at download time.

---

## 1. Photography

All photographs are illustrative stock images. **None is a Panda Smart Home
installation or a client project**, and the site says so (footer and home-type
section).

### 1a. Pexels (in use)

Licensed under the [Pexels License](https://www.pexels.com/license/): free for
commercial use, no attribution required. They are credited here anyway. Each
photo is cropped by hand to the framing noted below and served as responsive
WebP at 800, 1200 and 1600 px wide
(`src/assets/photos/<name>-<width>.webp`, built by `scripts/make-photos.mjs`).
The same record is kept in `src/content/photos.ts`.

| Files | Where used | Photographer | Source page | Notes |
| --- | --- | --- | --- | --- |
| `hero-living-*.webp` | Home page hero | Max Vakhtbovych | [Pexels](https://www.pexels.com/photo/modern-living-room-design-with-corner-sofa-6920439/) | Living room, 16:10 |
| `home-bto-*.webp` | Home types: BTO & new keys | CK Seng | [Pexels](https://www.pexels.com/photo/singapore-skyline-with-high-rise-apartments-34035022/) | High-rise apartment blocks, 16:9 |
| `home-hdb-*.webp` | Home types: HDB resale | CK Seng | [Pexels](https://www.pexels.com/photo/colorful-residential-building-in-urban-park-setting-34965019/) | Residential block beside a lawn, 16:9 |
| `home-condo-*.webp` | Home types: condominiums | Quang Nguyen Vinh | [Pexels](https://www.pexels.com/photo/modern-condominium-located-on-riverside-in-modern-city-6416109/) | Condominium towers by a river, 16:9; location not stated, so not captioned as a place |
| `home-landed-*.webp` | Home types: landed & larger homes | Abdullah Asad | [Pexels](https://www.pexels.com/photo/houses-with-terraces-12359215/) | Modern house with terraces, cropped from a portrait original to 16:9; location unconfirmed, **never described as Singapore** |

A sixth candidate (Max Vakhtbovych, bedroom with window,
[Pexels](https://www.pexels.com/photo/bedroom-interior-with-bed-against-window-in-house-6956623/))
was approved for use only where a curtain service needs a bedroom picture. No
page needs one yet, so it is not in the repository.

### 1b. Wikimedia Commons

None in use. The last one, `bedroom-lighting`, was taken out of the contact
section on 2026-11-12; its record is in 1c below.

CC BY requires credit to the author, a licence statement and a link back to the
source. This file is published at `/asset-sources.txt` and linked from the site
footer ("Image credits & licences"), so the credits for retired photographs
stay public too.

### 1c. Retired photographs (record kept, files removed from the site)

Replaced on 2026-11-08 by the Pexels photographs above, except
`bedroom-lighting`, which was removed on 2026-11-12 without a replacement.
Their provenance stays in [`src/assets/photos/_credits.json`](src/assets/photos/_credits.json).

| Former file | Former use | Author | Licence | Source page |
| --- | --- | --- | --- | --- |
| `living-room.jpg` | Hero | Shixart1985 | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Modern_living_room_with_stylish_furniture_and_a_view_of_the_outdoors_in_a_cozy_apartment_setting.jpg) |
| `sg-hdb-punggol.jpg` | BTO | Deoma12 | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Solar_Panels_on_Punggol_HDB_flats.jpg) |
| `sg-hdb-segar.jpg` | HDB resale | Teojincheng | CC0 1.0 | [Commons](https://commons.wikimedia.org/wiki/File:HDB_flats_and_canal_near_Segar_LRT_station._Singapore.jpg) |
| `sg-condo-marina.jpg` | Condominiums | William Cho | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:The_Sail_@_Marina_Bay,_Singapore.jpg) |
| `sg-landed.jpg` | Landed homes | Osucheok | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:YewLianPark1.jpg) |
| `bedroom-curtains.jpg` | How it works | Shixart1985 | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Cozy_modern_bedroom_with_plush_pillows_and_elegant_drapes_in_bright_daylight.jpg) |
| `bedroom-lighting.webp` (from `.jpg`) | "Get in touch" | SPL Interiors1 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | [Commons](https://commons.wikimedia.org/wiki/File:Balanced_Modern_Bedroom_Design_with_Neutral_Tones_and_Layered_Lighting.jpg) |

---

## 2. Third-party brand assets

**None.** No third-party logos are used anywhere on the site.

### Why brand logos are not used

The compatibility section lists device manufacturers as **plain text labels
only**. Logo licensing for those brands is not established, and text labels
avoid any implication of an official partnership. The site carries this
statement in both languages, in the compatibility section and the footer:

> Panda Smart Home integrates compatible third-party products through supported
> connection methods. Product names and trademarks
> belong to their respective owners. Compatibility does not imply official
> partnership or endorsement.

---

## 3. Typography

| File | Family | Licence | Source |
| --- | --- | --- | --- |
| `src/assets/fonts/inter-latin.woff2` | Inter (variable, Latin subset) | [SIL Open Font License 1.1](https://openfontlicense.org/) | Google Fonts CDN build v20, downloaded and self-hosted |
| `src/assets/fonts/inter-latin-ext.woff2` | Inter (variable, Latin-Extended subset) | SIL Open Font License 1.1 | as above |

Both files are self-hosted and declared with `unicode-range`, so the
Latin-Extended subset only downloads when a page actually needs it.

**Chinese text uses system fonts by design** — PingFang SC, HarmonyOS Sans SC,
Hiragino Sans GB, Source Han Sans SC, Noto Sans SC, Microsoft YaHei. A
self-hosted Simplified Chinese webfont costs several megabytes even when
subsetted, which is the wrong trade for a marketing site. The stack is defined
once as `--font-zh` in `src/index.css`.

---

## 4. Brand mark

The panda glyph was **supplied by the site owner** as a traced vector of their
own artwork. It is not third-party stock and carries no external licence.

The geometry has exactly one home:
**`src/components/brand/pandaPath.ts`**. Everything else is generated from it
by `npm run og`:

| Output | How |
| --- | --- |
| `PandaMark.tsx` | imports the constant directly |
| `public/favicon.svg` | written from scratch by the script |
| `public/og-image.svg` | the script fills in `<path id="pandaPath">` |
| the four PNGs | rasterised from those two SVGs |

So to change the mark, edit `pandaPath.ts` and run `npm run og`. Do not
hand-edit `favicon.svg` — it is overwritten.

## 5. Other original work (created for this project)

These are original to this repository. There is no third-party licence to
observe, and they can be replaced freely.

| File | What it is |
| --- | --- |
| `public/favicon.svg` | Panda glyph on a light plate (generated — see section 4) |
| `public/og-image.svg` | Source artwork for the social share card |
| `public/og-image.png` | 1200×630 share card, generated by `npm run og` |
| `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png` | App icons, generated by `npm run og` |
| `src/components/brand/PandaMark.tsx` | The panda glyph as a React component (see section 4) |
| `src/components/brand/Wordmark.tsx` | Brand lockup (glyph + live text) |
| `src/components/graphics/HomePanel.tsx` | The illustrative control panel in the hero — built from live DOM, not a screenshot of any real product |

Icons throughout the interface come from **[Lucide](https://lucide.dev)**
(`lucide-react`), [ISC licensed](https://github.com/lucide-icons/lucide/blob/main/LICENSE).

---

## 6. Replacing an asset

1. Drop the new file into the relevant folder under `src/assets/`.
2. Update the `import` in the component that uses it.
3. Add a row to the table above with author, licence and source URL.
4. If the photograph came from Wikimedia Commons, also update
   `src/assets/photos/_credits.json`.
5. Run `npm run build` — Vite fingerprints and emits the file automatically.

For the brand mark, edit `src/components/brand/pandaPath.ts` and run
`npm run og`; every other brand file is generated from it.

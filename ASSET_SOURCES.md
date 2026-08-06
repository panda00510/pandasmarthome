# Asset sources & licences

Every asset used by this site is stored **inside the repository**. Nothing is
hot-linked from a third-party server at runtime.

Machine-readable provenance for the photographs lives in
[`src/assets/photos/_credits.json`](src/assets/photos/_credits.json), which was
written directly from the Wikimedia Commons API at download time.

---

## 1. Photography

All photographs come from **Wikimedia Commons** under licences that permit
commercial use. Each file was downloaded through the Commons thumbnailer at the
display size the site actually needs, then re-encoded once as progressive
MozJPEG (quality 78) to cut transfer size. No cropping, colour grading or other
creative alteration was applied.

| File | Subject / where used | Author | Licence | Source page |
| --- | --- | --- | --- | --- |
| `src/assets/photos/living-room.jpg` | Modern apartment living room — hero | Shixart1985 | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | [Commons](https://commons.wikimedia.org/wiki/File:Modern_living_room_with_stylish_furniture_and_a_view_of_the_outdoors_in_a_cozy_apartment_setting.jpg) |
| `src/assets/photos/sg-hdb-punggol.jpg` | HDB blocks with rooftop solar, Punggol — "BTO & new keys" | Deoma12 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Commons](https://commons.wikimedia.org/wiki/File:Solar_Panels_on_Punggol_HDB_flats.jpg) |
| `src/assets/photos/sg-hdb-segar.jpg` | HDB flats and canal near Segar LRT — "HDB resale" | Teojincheng | [CC0 1.0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | [Commons](https://commons.wikimedia.org/wiki/File:HDB_flats_and_canal_near_Segar_LRT_station._Singapore.jpg) |
| `src/assets/photos/sg-condo-marina.jpg` | High-rise residential towers, Marina Bay — "Condominiums" | William Cho | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | [Commons](https://commons.wikimedia.org/wiki/File:The_Sail_@_Marina_Bay,_Singapore.jpg) |
| `src/assets/photos/sg-landed.jpg` | Landed houses, Yew Lian Park — "Landed & larger homes" | Osucheok (English Wikipedia) | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:YewLianPark1.jpg) |
| `src/assets/photos/bedroom-curtains.jpg` | Bedroom with drapes — "How it works" | Shixart1985 | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | [Commons](https://commons.wikimedia.org/wiki/File:Cozy_modern_bedroom_with_plush_pillows_and_elegant_drapes_in_bright_daylight.jpg) |
| `src/assets/photos/bedroom-lighting.jpg` | Layered bedroom lighting — "Get in touch" | SPL Interiors1 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | [Commons](https://commons.wikimedia.org/wiki/File:Balanced_Modern_Bedroom_Design_with_Neutral_Tones_and_Layered_Lighting.jpg) |

### Attribution obligations

* **CC BY / CC BY-SA files** require credit to the author, a licence statement
  and a link back to the source. That is satisfied by this file, which is
  published at `/ASSET_SOURCES.md` and linked from the site footer
  ("Image credits & licences").
* **ShareAlike (CC BY-SA)** only propagates to *adapted* material. The three
  BY-SA photographs are used unmodified apart from resizing and re-encoding,
  which is not an adaptation. **If anyone later crops, recolours or composites
  these three images, the resulting work must be released under the same
  ShareAlike licence** — or replace them with the CC0 / CC BY / public-domain
  alternatives in the table above.
* `sg-hdb-segar.jpg` (CC0) and `sg-landed.jpg` (public domain) carry no
  attribution obligation; they are credited anyway as a courtesy.

---

## 2. Third-party brand assets

| File | Asset | Source | Notes |
| --- | --- | --- | --- |
| `src/assets/brands/home-assistant-logo.png` | Home Assistant wordmark + icon | <https://brands.home-assistant.io/homeassistant/logo.png> | Used nominatively, in the Platform section, to state which platform the systems are built on. |

If a compact mark is ever needed, the icon-only version is at
<https://brands.home-assistant.io/homeassistant/icon.png>.

The Home Assistant name and logo are trademarks of the Open Home Foundation.
Panda Smart Home is an independent installer and is not affiliated with,
sponsored by or endorsed by the Home Assistant project or the Open Home
Foundation. The site states this explicitly in the Platform section.

### Why other brand logos are not used

The compatibility section lists device manufacturers as **plain text labels
only**. Logo licensing for those brands is not established, and text labels
avoid any implication of an official partnership. The site carries this
statement in both languages, in the compatibility section and the footer:

> Panda Smart Home integrates compatible third-party products through Home
> Assistant and supported connection methods. Product names and trademarks
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

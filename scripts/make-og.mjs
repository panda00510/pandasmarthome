/**
 * Rasterise the brand SVGs into the PNGs that platforms cannot render as SVG:
 *
 *   public/og-image.svg -> public/og-image.png      (1200x630 social card)
 *   public/favicon.svg  -> public/apple-touch-icon.png, icon-192.png, icon-512.png
 *
 * Social platforms (Facebook, LinkedIn, X, WhatsApp) and iOS home screens do
 * not accept SVG, so these PNGs are what the meta tags and web manifest point
 * at. Run `npm run og` after editing either SVG, then commit the output.
 *
 * `sharp` is a devDependency only — it never ships in the browser bundle.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const at = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url))

async function write(name, buffer) {
  await writeFile(at(name), buffer)
  console.log(`${name.padEnd(22)} ${(buffer.length / 1024).toFixed(0)} KB`)
}

// --- Social card -------------------------------------------------------------
const ogSvg = await readFile(at('og-image.svg'))
await write(
  'og-image.png',
  await sharp(ogSvg, { density: 144 })
    .resize(1200, 630, { fit: 'fill' })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer(),
)

// --- App icons ---------------------------------------------------------------
// The favicon flips colour with the OS theme; rasterised icons need one fixed
// look, so the light-theme plate (ink on paper-white glyph) is baked in.
const iconSvg = await readFile(at('favicon.svg'))
for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await write(
    name,
    await sharp(iconSvg, { density: 384 })
      .resize(size, size, { fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  )
}

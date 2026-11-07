/**
 * Builds the WebP variants the site actually serves from the licensed JPEG
 * originals in src/assets/photos (the JPEGs stay as the credited sources).
 *
 *   npm run photos
 *
 * The hero photo gets three widths for srcset; every other photo one WebP at
 * the largest size it is shown.
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../src/assets/photos/', import.meta.url))
const jobs = [
  ['living-room', [800, 1200, 1600]],
  ['sg-hdb-punggol', [1200]],
  ['sg-hdb-segar', [1200]],
  ['sg-condo-marina', [1200]],
  ['sg-landed', [1200]],
  ['bedroom-curtains', [760]],
  ['bedroom-lighting', [1280]],
]

for (const [name, widths] of jobs) {
  for (const width of widths) {
    const out = widths.length > 1 ? `${name}-${width}.webp` : `${name}.webp`
    const info = await sharp(`${dir}${name}.jpg`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(`${dir}${out}`)
    console.log(out.padEnd(28), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`)
  }
}

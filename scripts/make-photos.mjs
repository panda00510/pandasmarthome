/**
 * Builds the responsive WebP set the site serves (800 / 1200 / 1600 px wide)
 * from the Pexels originals listed in src/content/photos.ts.
 *
 *   node scripts/make-photos.mjs <folder holding the original JPEGs>
 *
 * `top` is the hand-set crop: the share of the original's height removed from
 * the top before cutting the target aspect ratio, so the subject stays framed
 * instead of being centre-cropped. The originals are not kept in the repo.
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const from = process.argv[2]
if (!from) throw new Error('usage: node scripts/make-photos.mjs <folder with original JPEGs>')
const out = fileURLToPath(new URL('../src/assets/photos/', import.meta.url))
const WIDTHS = [800, 1200, 1600]

const jobs = [
  // slug, original file, aspect (w/h), top offset as a share of the original height, left share
  { slug: 'hero-living', file: 'E-living-corner.jpg', ratio: 16 / 10, top: 0.02, left: 0.1 },
  { slug: 'home-bto', file: 'A-sg-skyline.jpg', ratio: 16 / 9, top: 0.2, left: 0 },
  { slug: 'home-hdb', file: 'B-sg-hdb.jpg', ratio: 16 / 9, top: 0.09, left: 0 },
  { slug: 'home-condo', file: 'C-sg-condo-river.jpg', ratio: 16 / 9, top: 0.08, left: 0 },
  { slug: 'home-landed', file: 'D-terraced.jpg', ratio: 16 / 9, top: 0.36, left: 0 },
]

for (const job of jobs) {
  const src = sharp(join(from, job.file))
  const { width, height } = await src.metadata()
  const cropW = Math.min(width, Math.round(height * job.ratio))
  const cropH = Math.round(cropW / job.ratio)
  const left = Math.min(width - cropW, Math.round(job.left * width))
  const top = Math.min(height - cropH, Math.round(job.top * height))
  for (const w of WIDTHS) {
    const info = await src
      .clone()
      .extract({ left, top, width: cropW, height: cropH })
      .resize({ width: w })
      .webp({ quality: 72 })
      .toFile(`${out}${job.slug}-${w}.webp`)
    console.log(`${job.slug}-${w}.webp`.padEnd(28), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`)
  }
}

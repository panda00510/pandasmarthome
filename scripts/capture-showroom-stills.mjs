/**
 * Stills of our own 3D showroom for the homepage (hero and image cards):
 *
 *   showroom production build -> vite preview :4179 -> ?plan=4room&demo=1&clean=1
 *   -> one screenshot near the end of each demo step (headed Chromium, real GPU)
 *   -> src/assets/photos/showroom-<step>-{480,800,1200,1600}.webp
 *      (+ showroom-door-{480,800}.webp, cut from the away overview)
 *
 * These are renders of the showroom flat, not photographs of an installation;
 * the site labels them "3D showroom render" (`footer.renderTag`). Steps follow
 * showroom/src/demo.js: 1 home (evening, lights on), 2 living, 3 movie,
 * 5 sleep, 6 away (4, the unlit bedroom, is skipped). Run on macOS, look at the output and commit it.
 *
 * Playwright is found the same way as scripts/record-showroom.mjs.
 */
import { spawn, execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'src/assets/photos')
const PORT = 4179
const W = 1600
const H = 1000
const WIDTHS = [480, 800, 1200, 1600]
const NAMES = { 1: 'home', 2: 'living', 3: 'movie', 5: 'sleep', 6: 'away' }
// demo.js step lengths (ms); the shot is taken this long before the step ends, once the tween has settled.
const STEP_MS = [2500, 3000, 3500, 6000, 3500, 6000, 6000]
const BEFORE_END = 450

function playwright() {
  const req = createRequire(import.meta.url)
  const tries = [process.env.PLAYWRIGHT_CORE, 'playwright-core', 'playwright']
  const npx = join(homedir(), '.npm/_npx')
  if (existsSync(npx)) for (const d of readdirSync(npx)) tries.push(join(npx, d, 'node_modules/playwright-core'))
  for (const p of tries.filter(Boolean)) {
    try {
      return req(p)
    } catch {
      // try the next one
    }
  }
  throw new Error('Playwright not found (see scripts/record-showroom.mjs).')
}

const showroom = join(root, 'showroom')
if (!process.env.SKIP_BUILD) execFileSync('npm', ['run', 'build'], { cwd: showroom, stdio: 'inherit' })
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: showroom, stdio: 'ignore' })
process.on('exit', () => server.kill())

const url = `http://localhost:${PORT}/?plan=4room&lang=en&demo=1&clean=1`
for (let i = 0; ; i++) {
  try {
    if ((await fetch(url)).ok) break
  } catch {
    if (i > 100) throw new Error('vite preview did not start')
    await new Promise((r) => setTimeout(r, 100))
  }
}

const { chromium } = playwright()
const cache = join(homedir(), 'Library/Caches/ms-playwright')
const builds = existsSync(cache) ? readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.slice(9) - a.slice(9)) : []
const app = builds.map((d) => join(cache, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')).find(existsSync)
const browser = await chromium.launch({ headless: false, executablePath: process.env.CHROMIUM ?? app, args: ['--hide-scrollbars'] })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await page.goto(url)

const step = () =>
  page.evaluate(() => [...document.querySelectorAll('.demo-dots i')].findIndex((d) => d.classList.contains('is-on')))

for (const [i, name] of Object.entries(NAMES).map(([k, v]) => [Number(k), v])) {
  await page.waitForFunction((n) => {
    const dots = [...document.querySelectorAll('.demo-dots i')]
    return dots.findIndex((d) => d.classList.contains('is-on')) === n
  }, i, { timeout: 120_000 })
  await page.waitForTimeout(STEP_MS[i] - BEFORE_END)
  if ((await step()) !== i) console.warn(`step ${i} (${name}) ended before the shot`)
  const png = await page.screenshot({ type: 'png' })
  for (const w of WIDTHS) {
    const info = await sharp(png).resize({ width: w }).webp({ quality: 74 }).toFile(join(out, `showroom-${name}-${w}.webp`))
    console.log(`showroom-${name}-${w}.webp`.padEnd(30), `${Math.round(info.size / 1024)} KB`)
  }
}

await browser.close()

// The front door and gate, cut from the away overview: the security card on the homepage.
for (const w of [480, 800]) {
  await sharp(join(out, 'showroom-away-1600.webp'))
    .extract({ left: 300, top: 430, width: 800, height: 500 })
    .resize({ width: w })
    .webp({ quality: 76 })
    .toFile(join(out, `showroom-door-${w}.webp`))
}
process.exit(0)

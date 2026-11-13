/**
 * Record the homepage's showroom clip from the showroom's own auto demo:
 *
 *   showroom production build -> vite preview :4178 -> ?plan=4room&demo=1&clean=1
 *   -> CDP screencast (headed Chromium, real GPU) -> ffmpeg
 *   -> public/media/showroom-demo.{mp4,webm} + showroom-demo-poster.webp
 *
 * The clip is demo step "come home" (evening, lights and curtains come on) ->
 * fly into the living room (over the walls, see showroom/src/three/cameraPath.js) ->
 * "movie" (curtains close, lights dim, TV on). It is cut on the step changes the
 * demo writes into its (hidden) caption box, so it follows showroom/src/demo.js
 * if the timings change. Run on macOS, then look at the
 * output and commit it — CI never records. See README "Showroom clip".
 *
 * No npm dependency: Playwright is resolved from the repo if present, else from
 * the npx cache the Playwright MCP server leaves (~/.npm/_npx/<hash>/node_modules),
 * or from PLAYWRIGHT_CORE=/path/to/playwright-core. ffmpeg comes from PATH or
 * /opt/homebrew/bin. `sharp` (already a devDependency) writes the poster.
 */
import { spawn, execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'public/media')
const PORT = 4178
const W = 1280
const H = 720
const FADE = 0.3 // fade in/out at the loop point
const LEAD = 0.7 // seconds of the dark flat before "home": the lights coming on is the first thing that happens
// Encoder settings. Budget: mp4 <= 1.2 MB, webm <= 900 KB, poster <= 60 KB.
const X264 = ['-c:v', 'libx264', '-preset', 'veryslow', '-crf', process.env.CRF_H264 ?? '26', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
const VP9 = ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', process.env.CRF_VP9 ?? '41', '-deadline', 'good', '-cpu-used', '1', '-row-mt', '1', '-pix_fmt', 'yuv420p']
const POSTER_AT = Number(process.env.POSTER_AT ?? 6.6) // seconds into the clip: living room, lamps on, before the movie
const POSTER_Q = Number(process.env.POSTER_Q ?? 80)
const SCALE = process.env.SCALE ?? `${W}:${H}`

function playwright() {
  const req = createRequire(import.meta.url)
  const tries = [process.env.PLAYWRIGHT_CORE, 'playwright-core', 'playwright']
  const npx = join(homedir(), '.npm/_npx')
  if (existsSync(npx)) {
    for (const d of readdirSync(npx)) tries.push(join(npx, d, 'node_modules/playwright-core'))
  }
  for (const p of tries.filter(Boolean)) {
    try {
      return req(p)
    } catch {
      // try the next one
    }
  }
  throw new Error('Playwright not found. Run `npx --yes @playwright/mcp@latest --help` once, or set PLAYWRIGHT_CORE.')
}

const ffmpeg = ['/opt/homebrew/bin/ffmpeg', 'ffmpeg'].find((p) => {
  try {
    execFileSync(p, ['-version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
})
if (!ffmpeg) throw new Error('ffmpeg not found')

const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })

// --- 1. Build and serve the showroom ----------------------------------------
const showroom = join(root, 'showroom')
if (!process.env.SKIP_BUILD) execFileSync('npm', ['run', 'build'], { cwd: showroom, stdio: 'inherit' })
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: showroom, stdio: 'ignore' })
const stop = () => server.kill()
process.on('exit', stop)

const url = `http://localhost:${PORT}/?plan=4room&lang=en&demo=1&clean=1`
for (let i = 0; ; i++) {
  try {
    if ((await fetch(url)).ok) break
  } catch {
    if (i > 100) throw new Error('vite preview did not start')
    await new Promise((r) => setTimeout(r, 100))
  }
}

// --- 2. Record ---------------------------------------------------------------
// Headed, because headless Chromium on macOS renders WebGL in software and drops frames.
// The cached playwright-core may expect a newer Chromium build than is downloaded: use the newest one there.
const { chromium } = playwright()
const cache = join(homedir(), 'Library/Caches/ms-playwright')
const builds = existsSync(cache) ? readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.slice(9) - a.slice(9)) : []
const app = builds.map((d) => join(cache, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')).find(existsSync)
const browser = await chromium.launch({ headless: false, executablePath: process.env.CHROMIUM ?? app, args: ['--hide-scrollbars'] })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
// Step changes, wall-clock seconds (same clock as screencast frame timestamps).
await page.addInitScript(() => {
  window.__steps = []
  new MutationObserver(() => {
    const dots = [...document.querySelectorAll('.demo-dots i')]
    const i = dots.findIndex((d) => d.classList.contains('is-on'))
    if (i >= 0 && window.__steps.at(-1)?.i !== i) window.__steps.push({ i, t: Date.now() / 1000 })
  }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] })
})

const dir = await mkdtemp(join(tmpdir(), 'showroom-rec-'))
const frames = []
const cdp = await page.context().newCDPSession(page)
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  const file = join(dir, `${String(frames.length).padStart(5, '0')}.jpg`)
  frames.push({ file, t: metadata.timestamp })
  cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  await writeFile(file, Buffer.from(data, 'base64'))
})
await page.goto(url)
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: W, maxHeight: H })

// Steps: 0 intro (dusk, lights off), 1 home, 2 living, 3 movie, 4 bedroom. Record until 4 starts.
await page.waitForFunction(() => window.__steps.some((s) => s.i === 4), null, { timeout: 120_000 })
await cdp.send('Page.stopScreencast')
const steps = await page.evaluate(() => window.__steps)
await browser.close()
stop()

// One continuous take: just before "home" -> "bedroom" starts.
const from = steps.find((s) => s.i === 1).t - LEAD
const to = steps.find((s) => s.i === 4).t
const dur = to - from

const clip = frames.filter((f) => f.t >= from - 0.2 && f.t <= to)
const fps = clip.length / (clip.at(-1).t - clip[0].t)
console.log(`recorded ${frames.length} frames; clip ${dur.toFixed(2)} s from ${clip.length} frames (~${fps.toFixed(0)} fps captured)`)
if (fps < 24) console.warn('warning: capture ran below 24 fps; the clip will judder')

// Screencast frames arrive only when the page repaints: give each frame its real
// duration, then resample to a constant 30 fps.
const list = ['ffconcat version 1.0']
clip.forEach((f, i) => {
  const next = clip[i + 1]?.t ?? to
  list.push(`file '${f.file}'`, `duration ${Math.max(0.001, next - Math.max(f.t, from)).toFixed(4)}`)
})
list.push(`file '${clip.at(-1).file}'`)
const listFile = join(dir, 'list.txt')
await writeFile(listFile, list.join('\n'))

// --- 3. Encode ---------------------------------------------------------------
await mkdir(out, { recursive: true })
const f = (n) => n.toFixed(3)
const graph = [
  `[0]fps=30,scale=${SCALE}:flags=lanczos:out_range=tv,format=yuv420p,trim=0:${f(dur)},setpts=PTS-STARTPTS`,
  `fade=t=in:st=0:d=${FADE},fade=t=out:st=${f(dur - FADE)}:d=${FADE}[v]`,
].join(',')
const input = ['-f', 'concat', '-safe', '0', '-i', listFile, '-filter_complex', graph, '-map', '[v]', '-an']
run([...input, ...X264, join(out, 'showroom-demo.mp4')])
const pass = join(dir, 'vp9')
run([...input, ...VP9, '-pass', '1', '-passlogfile', pass, '-f', 'null', '/dev/null'])
run([...input, ...VP9, '-pass', '2', '-passlogfile', pass, join(out, 'showroom-demo.webm')])

const png = join(dir, 'poster.png')
run(['-ss', String(POSTER_AT), '-i', join(out, 'showroom-demo.mp4'), '-frames:v', '1', png])
await sharp(png).webp({ quality: POSTER_Q }).toFile(join(out, 'showroom-demo-poster.webp'))

for (const name of ['showroom-demo.mp4', 'showroom-demo.webm', 'showroom-demo-poster.webp']) {
  console.log(`${name.padEnd(28)} ${(statSync(join(out, name)).size / 1024).toFixed(0)} KB`)
}
await rm(dir, { recursive: true })

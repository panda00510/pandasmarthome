// 展厅验收截图：桌面六个视角、中文、手机两张，外加一张只有画布的全屋渲染（首屏图的原图）。
// 不是展厅的依赖：在任意装了 puppeteer-core 的目录里运行（npm i puppeteer-core），
//   node capture.mjs <输出目录> [展厅地址，默认 http://127.0.0.1:4187/] [hero=只截渲染图] [宽x高，默认 1600x1000]
// 浏览器路径用 BROWSER 环境变量指定（默认 Windows 的 Edge；macOS 用 Chrome 的可执行文件路径）。
// 必须用真 GPU（--use-angle=d3d11 / macOS 上去掉该参数）：软件渲染每帧要几十秒，截到的是相机还在飞的画面。
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
const out = process.argv[2]
const base = process.argv[3] ?? 'http://127.0.0.1:4187/'
const only = process.argv[4] // optional: 'hero'
fs.mkdirSync(out, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: process.env.BROWSER ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new',
  args: [...(process.platform === 'win32' ? ['--use-angle=d3d11'] : []), '--enable-gpu', '--ignore-gpu-blocklist', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
})
const open = async (url, vp) => {
  const page = await browser.newPage()
  await page.setViewport(vp)
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
  await page.goto(url, { waitUntil: 'load', timeout: 120000 })
  await sleep(9000)
  return page
}
const clickView = (page, i) => page.evaluate((i) => document.querySelectorAll('nav.views button')[i].click(), i)

if (only !== 'hero') {
  const page = await open(base, { width: 1440, height: 900 })
  const names = await page.evaluate(() => [...document.querySelectorAll('nav.views button')].map((b) => b.textContent.trim()))
  console.log('views', names.join(','))
  await page.screenshot({ path: `${out}/d-0-overview.png` })
  for (let i = 1; i < names.length; i++) {
    await clickView(page, i)
    await sleep(4500)
    await page.screenshot({ path: `${out}/d-${i}-${names[i].replace(/\s/g, '').toLowerCase()}.png` })
  }
  await page.close()

  const zh = await open(base + '?lang=zh', { width: 1440, height: 900 })
  await zh.screenshot({ path: `${out}/d-zh-overview.png` })
  await zh.close()

  const m = await open(base, { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  await m.screenshot({ path: `${out}/m-0-overview.png` })
  await clickView(m, 1)
  await sleep(4500)
  await m.screenshot({ path: `${out}/m-1-living.png` })
  console.log('phone overflow', await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
  await m.close()
}

// Hero render: focus mode, all UI hidden, canvas only.
const [w, h] = (process.argv[5] ?? '1600x1000').split('x').map(Number)
const hero = await open(base, { width: w, height: h, deviceScaleFactor: 2 })
await hero.evaluate(() => {
  const tools = document.querySelectorAll('.tools .tool')
  tools[tools.length - 1].click()
})
await sleep(4000)
await hero.addStyleTag({ content: '.app > :not(.canvas-layer), .canvas-layer > :not(div):not(canvas) { display: none !important }' })
await sleep(1500)
await hero.screenshot({ path: `${out}/hero-focus.png` })
await browser.close()
console.log('done')

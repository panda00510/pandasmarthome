import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

// 全部纹理在运行时用 Canvas 2D 程序化生成，不依赖任何图片资源。

function makeCanvas(size) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  return c
}

// 值噪声：低频块 + 双线性插值，比纯随机更像材质
function valueNoise(w, h, cells, seed = 1) {
  const rnd = mulberry32(seed)
  const g = new Float32Array((cells + 1) * (cells + 1))
  for (let i = 0; i < g.length; i++) g[i] = rnd()
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const fy = (y / h) * cells
    const y0 = Math.floor(fy)
    const ty = fy - y0
    for (let x = 0; x < w; x++) {
      const fx = (x / w) * cells
      const x0 = Math.floor(fx)
      const tx = fx - x0
      const a = g[y0 * (cells + 1) + x0]
      const b = g[y0 * (cells + 1) + x0 + 1]
      const c = g[(y0 + 1) * (cells + 1) + x0]
      const d = g[(y0 + 1) * (cells + 1) + x0 + 1]
      const sx = tx * tx * (3 - 2 * tx)
      const sy = ty * ty * (3 - 2 * ty)
      out[y * w + x] = (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy
    }
  }
  return out
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 由彩色图推导法线贴图（Sobel）
function normalFrom(ctx, size, strength) {
  const src = ctx.getImageData(0, 0, size, size).data
  const lum = new Float32Array(size * size)
  for (let i = 0; i < size * size; i++) {
    lum[i] = (src[i * 4] * 0.299 + src[i * 4 + 1] * 0.587 + src[i * 4 + 2] * 0.114) / 255
  }
  const c = makeCanvas(size)
  const cx = c.getContext('2d')
  const img = cx.createImageData(size, size)
  const at = (x, y) => lum[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1) -
        (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1))
      const dy =
        at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1) -
        (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1))
      const nx = dx * strength
      const ny = dy * strength
      const nz = 1
      const len = Math.hypot(nx, ny, nz)
      const i = (y * size + x) * 4
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255
      img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255
      img.data[i + 2] = ((nz / len) * 0.5 + 0.5) * 255
      img.data[i + 3] = 255
    }
  }
  cx.putImageData(img, 0, 0)
  return c
}

// 由彩色图推导粗糙度贴图：亮的地方更光滑
function roughFrom(ctx, size, base, range) {
  const src = ctx.getImageData(0, 0, size, size).data
  const c = makeCanvas(size)
  const cx = c.getContext('2d')
  const img = cx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const l = (src[i * 4] * 0.299 + src[i * 4 + 1] * 0.587 + src[i * 4 + 2] * 0.114) / 255
    const v = Math.max(0, Math.min(1, base + (l - 0.5) * range)) * 255
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
    img.data[i * 4 + 3] = 255
  }
  cx.putImageData(img, 0, 0)
  return c
}

function build(draw, { size = 512, normalStrength = 2.2, roughBase = 0.75, roughRange = -0.4, repeat = [1, 1] } = {}) {
  const canvas = makeCanvas(size)
  const ctx = canvas.getContext('2d')
  draw(ctx, size)

  const map = new CanvasTexture(canvas)
  map.colorSpace = SRGBColorSpace
  const normalMap = new CanvasTexture(normalFrom(ctx, size, normalStrength))
  const roughnessMap = new CanvasTexture(roughFrom(ctx, size, roughBase, roughRange))

  for (const t of [map, normalMap, roughnessMap]) {
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
    t.anisotropy = 8
  }
  return { map, normalMap, roughnessMap }
}

// ---------------- 各材质的绘制 ----------------

function drawWood(base, plankCount) {
  return (ctx, size) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    const plankW = size / plankCount
    const rnd = mulberry32(7)

    for (let p = 0; p < plankCount; p++) {
      const x0 = p * plankW
      // 每块板整体色差
      const shade = (rnd() - 0.5) * 16
      ctx.fillStyle = `rgba(${shade > 0 ? 255 : 0},${shade > 0 ? 245 : 10},${shade > 0 ? 230 : 0},${Math.abs(shade) / 200})`
      ctx.fillRect(x0, 0, plankW, size)

      // 木纹：沿板长方向的细纹，带缓慢横向漂移
      const grains = 26
      for (let g = 0; g < grains; g++) {
        const gx = x0 + rnd() * plankW
        const dark = rnd() > 0.55
        ctx.strokeStyle = dark ? `rgba(60,38,20,${0.05 + rnd() * 0.1})` : `rgba(232,200,160,${0.04 + rnd() * 0.08})`
        ctx.lineWidth = 0.6 + rnd() * 2.2
        ctx.beginPath()
        const amp = 1.5 + rnd() * 4
        const freq = 0.6 + rnd() * 1.8
        const phase = rnd() * 6.28
        for (let y = 0; y <= size; y += 4) {
          const x = gx + Math.sin((y / size) * freq * 6.28 + phase) * amp
          y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // 板缝
      ctx.fillStyle = 'rgba(38,24,12,0.55)'
      ctx.fillRect(x0, 0, 1.5, size)
      ctx.fillStyle = 'rgba(255,240,215,0.12)'
      ctx.fillRect(x0 + 1.5, 0, 1, size)

      // 板端接缝（错缝铺装）
      const seamY = Math.floor(rnd() * size)
      ctx.fillStyle = 'rgba(38,24,12,0.4)'
      ctx.fillRect(x0, seamY, plankW, 1.5)
    }
  }
}

function drawTile(ctx, size) {
  ctx.fillStyle = '#cfcac2'
  ctx.fillRect(0, 0, size, size)
  const n = 2
  const cell = size / n
  const noise = valueNoise(size, size, 40, 3)
  const img = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < size * size; i++) {
    const v = (noise[i] - 0.5) * 14
    img.data[i * 4] += v
    img.data[i * 4 + 1] += v
    img.data[i * 4 + 2] += v
  }
  ctx.putImageData(img, 0, 0)
  ctx.strokeStyle = 'rgba(120,116,110,0.55)'
  ctx.lineWidth = 3
  for (let i = 0; i <= n; i++) {
    ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell); ctx.stroke()
  }
}

function drawFabric(base, weave) {
  return (ctx, size) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    // 经纬交织
    for (let y = 0; y < size; y += weave) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fillRect(0, y, size, weave / 2)
    }
    for (let x = 0; x < size; x += weave) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.fillRect(x, 0, weave / 2, size)
    }
    // 绒感噪声
    const noise = valueNoise(size, size, 128, 11)
    const img = ctx.getImageData(0, 0, size, size)
    for (let i = 0; i < size * size; i++) {
      const v = (noise[i] - 0.5) * 22
      img.data[i * 4] += v
      img.data[i * 4 + 1] += v
      img.data[i * 4 + 2] += v
    }
    ctx.putImageData(img, 0, 0)
  }
}

function drawRug(ctx, size) {
  ctx.fillStyle = '#c4b8a5'
  ctx.fillRect(0, 0, size, size)
  const rnd = mulberry32(23)
  // 绒毛：大量短笔触
  for (let i = 0; i < 14000; i++) {
    const x = rnd() * size
    const y = rnd() * size
    const l = 2 + rnd() * 4
    const a = rnd() * 6.28
    ctx.strokeStyle = rnd() > 0.5 ? `rgba(255,250,240,${rnd() * 0.16})` : `rgba(90,78,62,${rnd() * 0.16})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l)
    ctx.stroke()
  }
}

function drawPlaster(base) {
  return (ctx, size) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    const fine = valueNoise(size, size, 200, 5)
    const broad = valueNoise(size, size, 12, 9)
    const img = ctx.getImageData(0, 0, size, size)
    for (let i = 0; i < size * size; i++) {
      const v = (fine[i] - 0.5) * 9 + (broad[i] - 0.5) * 6
      img.data[i * 4] += v
      img.data[i * 4 + 1] += v
      img.data[i * 4 + 2] += v
    }
    ctx.putImageData(img, 0, 0)
  }
}


// 挂画：纯色块比空墙更假，用程序化抽象画填内容
function drawArtwork(seed, bg, palette) {
  return (ctx, size) => {
    const r = mulberry32(seed)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)

    // 大色块
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = palette[i % palette.length]
      ctx.globalAlpha = 0.55 + r() * 0.35
      const w = size * (0.18 + r() * 0.42)
      const h = size * (0.16 + r() * 0.5)
      ctx.fillRect(size * (0.06 + r() * 0.5), size * (0.06 + r() * 0.45), w, h)
    }
    // 圆形
    ctx.globalAlpha = 0.5 + r() * 0.3
    ctx.fillStyle = palette[(palette.length - 1) % palette.length]
    ctx.beginPath()
    ctx.arc(size * (0.25 + r() * 0.5), size * (0.3 + r() * 0.4), size * (0.09 + r() * 0.11), 0, 6.284)
    ctx.fill()

    // 细线
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = 'rgba(40,34,28,0.6)'
    for (let i = 0; i < 4; i++) {
      ctx.lineWidth = 1 + r() * 2.5
      ctx.beginPath()
      const y = size * r()
      ctx.moveTo(size * r() * 0.4, y)
      ctx.lineTo(size * (0.6 + r() * 0.4), y + (r() - 0.5) * size * 0.3)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // 画布颗粒
    const noise = valueNoise(size, size, 90, seed + 5)
    const img = ctx.getImageData(0, 0, size, size)
    for (let i = 0; i < size * size; i++) {
      const v = (noise[i] - 0.5) * 10
      img.data[i * 4] += v
      img.data[i * 4 + 1] += v
      img.data[i * 4 + 2] += v
    }
    ctx.putImageData(img, 0, 0)
  }
}

// 只需要颜色贴图的场合（挂画），跳过法线与粗糙度
function buildMap(draw, size = 256) {
  const canvas = makeCanvas(size)
  draw(canvas.getContext('2d'), size)
  const map = new CanvasTexture(canvas)
  map.colorSpace = SRGBColorSpace
  map.anisotropy = 4
  return map
}

// ---------------- 懒加载单例 ----------------
let cache = null

export function getTextures() {
  if (cache) return cache
  cache = {
    woodFloor: build(drawWood('#a9825a', 5), { size: 1024, normalStrength: 1.4, roughBase: 0.62, roughRange: -0.3 }),
    woodFloorWarm: build(drawWood('#b98f66', 5), { size: 1024, normalStrength: 1.4, roughBase: 0.62, roughRange: -0.3 }),
    tile: build(drawTile, { size: 512, normalStrength: 1.1, roughBase: 0.35, roughRange: -0.2 }),
    sofa: build(drawFabric('#7d8794', 6), { size: 512, normalStrength: 3.2, roughBase: 0.95, roughRange: -0.1 }),
    linen: build(drawFabric('#e8e3da', 5), { size: 512, normalStrength: 2.6, roughBase: 0.95, roughRange: -0.1 }),
    curtain: build(drawFabric('#e6ded1', 8), { size: 512, normalStrength: 3.4, roughBase: 0.98, roughRange: -0.08 }),
    rug: build(drawRug, { size: 512, normalStrength: 2.4, roughBase: 0.98, roughRange: -0.06 }),
    wall: build(drawPlaster('#efece6'), { size: 512, normalStrength: 0.9, roughBase: 0.92, roughRange: -0.12 }),
    wallAccent: build(drawPlaster('#ded7cc'), { size: 512, normalStrength: 0.9, roughBase: 0.92, roughRange: -0.12 }),
    art1: buildMap(drawArtwork(13, '#e9e3d7', ['#8a9b8e', '#c4a882', '#5f6b6f'])),
    art2: buildMap(drawArtwork(29, '#efe9de', ['#b98d6a', '#7d8794', '#d8c7a8'])),
    art3: buildMap(drawArtwork(47, '#e6e0d4', ['#9a8298', '#7f9184', '#cbb896'])),
  }
  return cache
}

// 按物理尺寸克隆一套贴图（每个 mesh 的 repeat 不同，必须各自持有实例）
export function tiled(set, repeatX, repeatY) {
  const out = {}
  for (const key of ['map', 'normalMap', 'roughnessMap']) {
    const t = set[key].clone()
    t.needsUpdate = true
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(repeatX, repeatY)
    out[key] = t
  }
  return out
}

import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import { MOBILE_QUERY } from '../hooks'

// 全部纹理在运行时用 Canvas 2D 程序化生成，不依赖任何图片资源。
// 每张贴图对应一块真实尺寸的表面（尺寸写在 materials.js 的 meters 里），几何 UV 按米给，
// 所以砖缝、板宽在任何房间里都是同一个物理尺寸，不会随房间拉伸。
// 这里只管"画什么"；哪个材质用哪张图、多大、多粗糙，统一在 materials.js。

// 桌面 1024，手机 512（显存和生成时间都降到 1/4）
export const TEX_SIZE = typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches ? 512 : 1024

function makeCanvas(size) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  return c
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

// 值噪声：低频块 + 双线性插值，四方连续（边缘回绕），平铺时没有接缝
function valueNoise(size, cells, seed = 1) {
  const rnd = mulberry32(seed)
  const g = new Float32Array(cells * cells)
  for (let i = 0; i < g.length; i++) g[i] = rnd()
  const out = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    const fy = (y / size) * cells
    const y0 = Math.floor(fy)
    const y1 = (y0 + 1) % cells
    let ty = fy - y0
    ty = ty * ty * (3 - 2 * ty)
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * cells
      const x0 = Math.floor(fx)
      const x1 = (x0 + 1) % cells
      let tx = fx - x0
      tx = tx * tx * (3 - 2 * tx)
      const a = g[y0 * cells + x0]
      const b = g[y0 * cells + x1]
      const c = g[y1 * cells + x0]
      const d = g[y1 * cells + x1]
      out[y * size + x] = (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty
    }
  }
  return out
}

// 把若干层噪声按权重加到画布亮度上（偏移量是 0..255 的色阶）
function addNoise(ctx, size, layers) {
  const img = ctx.getImageData(0, 0, size, size)
  const fields = layers.map(([cells, amp, seed]) => [valueNoise(size, Math.max(2, Math.round(cells)), seed), amp])
  for (let i = 0; i < size * size; i++) {
    let v = 0
    for (const [f, amp] of fields) v += (f[i] - 0.5) * amp
    img.data[i * 4] += v
    img.data[i * 4 + 1] += v
    img.data[i * 4 + 2] += v
  }
  ctx.putImageData(img, 0, 0)
}

function lumOf(src, i) {
  return (src[i * 4] * 0.299 + src[i * 4 + 1] * 0.587 + src[i * 4 + 2] * 0.114) / 255
}

// 由高度图（亮 = 高）推导法线贴图（Sobel）。强度按分辨率归一，512 和 1024 看起来一样深。
function normalFrom(ctx, size, strength) {
  const src = ctx.getImageData(0, 0, size, size).data
  const lum = new Float32Array(size * size)
  for (let i = 0; i < size * size; i++) lum[i] = lumOf(src, i)
  const k = strength * (size / 512)
  const c = makeCanvas(size)
  const cx = c.getContext('2d')
  const img = cx.createImageData(size, size)
  const at = (x, y) => lum[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1) - (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1))
      const dy = at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1) - (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1))
      const nx = dx * k
      const ny = -dy * k
      const len = Math.hypot(nx, ny, 1)
      const i = (y * size + x) * 4
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255
      img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
      img.data[i + 3] = 255
    }
  }
  cx.putImageData(img, 0, 0)
  return c
}

// 粗糙度贴图（绝对值，材质 roughness 设为 1 后直接用它）：base ± (亮度 - 0.5) * range
function roughFrom(ctx, size, base, range) {
  const src = ctx.getImageData(0, 0, size, size).data
  const c = makeCanvas(size)
  const cx = c.getContext('2d')
  const img = cx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const v = Math.max(0.03, Math.min(1, base + (lumOf(src, i) - 0.5) * range)) * 255
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
    img.data[i * 4 + 3] = 255
  }
  cx.putImageData(img, 0, 0)
  return c
}

function wrapTex(canvas, color) {
  const t = new CanvasTexture(canvas)
  if (color) t.colorSpace = SRGBColorSpace
  t.wrapS = t.wrapT = RepeatWrapping
  return t
}

// draw(ctx, size, rnd) 画颜色；可选 height(ctx, size, rnd) 单独画高度（否则用颜色亮度当高度）
// 与 rough(ctx, size, rnd) 单独画粗糙度（否则由颜色推导）
function build({ draw, height, rough, normal = 1, roughBase = 0.8, roughRange = -0.2, seed = 1 }, size) {
  const canvas = makeCanvas(size)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  draw(ctx, size, mulberry32(seed))

  let hctx = ctx
  if (height) {
    const hc = makeCanvas(size)
    hctx = hc.getContext('2d', { willReadFrequently: true })
    height(hctx, size, mulberry32(seed))
  }
  let rctx = ctx
  if (rough) {
    const rc = makeCanvas(size)
    rctx = rc.getContext('2d', { willReadFrequently: true })
    rough(rctx, size, mulberry32(seed))
  }
  return {
    map: wrapTex(canvas, true),
    normalMap: wrapTex(normalFrom(hctx, size, normal)),
    roughnessMap: wrapTex(rough ? rctx.canvas : roughFrom(rctx, size, roughBase, roughRange)),
  }
}

// ---------------- 各材质的绘制 ----------------

// 乳胶漆 / 批荡：几乎看不出的细颗粒 + 很缓的滚筒起伏
const plaster = {
  draw: (ctx, s) => {
    ctx.fillStyle = '#f6f4f0'
    ctx.fillRect(0, 0, s, s)
    addNoise(ctx, s, [[s / 3, 7, 5], [s / 12, 6, 6], [6, 5, 9]])
  },
  normal: 0.35,
  roughBase: 0.9,
  roughRange: -0.25,
}

// 墙顶截面：混凝土 / 砖砌体的剖面，灰，有气孔
const concrete = {
  draw: (ctx, s, r) => {
    ctx.fillStyle = '#e6e2dc'
    ctx.fillRect(0, 0, s, s)
    addNoise(ctx, s, [[s / 4, 22, 21], [24, 16, 22]])
    for (let i = 0; i < s * 1.2; i++) {
      ctx.fillStyle = `rgba(40,36,32,${0.2 + r() * 0.35})`
      const d = 0.6 + r() * 1.8 * (s / 512)
      ctx.beginPath()
      ctx.arc(r() * s, r() * s, d, 0, 6.29)
      ctx.fill()
    }
  },
  normal: 1.2,
  roughBase: 0.95,
  roughRange: 0.05,
}

// 实木复合 / SPC 木地板：一张贴图 = 1.2 m 见方，8 条 150 mm 宽的长条板，
// 每列两块板、端缝错开，板间色差，细木纹，偶尔一个木节。清漆面低光泽，板缝更粗糙。
function oak(base, seed) {
  const plan = (s, r) => {
    const cols = 8
    const w = s / cols
    const boards = []
    for (let c = 0; c < cols; c++) {
      const start = r() * s
      const l1 = s * (0.38 + r() * 0.3)
      for (const [y, len] of [[start, l1], [start + l1, s - l1]]) {
        boards.push({ x: c * w, y: y % s, w, len, tone: r(), seed: Math.floor(r() * 1e9) })
      }
    }
    return boards
  }
  // 一块板跨过贴图下边缘时，在上边缘再画一次，保证四方连续
  const eachCopy = (b, s, fn) => {
    fn(b.y)
    if (b.y + b.len > s) fn(b.y - s)
  }
  return {
    seed,
    draw: (ctx, s, r) => {
      ctx.fillStyle = base
      ctx.fillRect(0, 0, s, s)
      for (const b of plan(s, r)) {
        const g = mulberry32(b.seed)
        eachCopy(b, s, (y) => {
          ctx.save()
          ctx.beginPath()
          ctx.rect(b.x, y, b.w, b.len)
          ctx.clip()
          // 板间色差：明暗 ±、冷暖微偏
          const dl = (b.tone - 0.5) * 0.22
          ctx.fillStyle = dl > 0 ? `rgba(255,236,206,${dl})` : `rgba(48,28,14,${-dl})`
          ctx.fillRect(b.x, y, b.w, b.len)
          // 木纹：沿板长的细线，缓慢摆动；暗纹多、亮纹少
          const lines = 34
          for (let i = 0; i < lines; i++) {
            const gx = b.x + g() * b.w
            const dark = g() > 0.35
            ctx.strokeStyle = dark ? `rgba(62,38,20,${0.05 + g() * 0.12})` : `rgba(250,222,182,${0.04 + g() * 0.08})`
            ctx.lineWidth = (0.4 + g() * 1.6) * (s / 1024)
            const amp = (1 + g() * 3.5) * (s / 1024)
            const freq = 0.5 + g() * 2.2
            const ph = g() * 6.28
            ctx.beginPath()
            for (let t = 0; t <= b.len; t += 6) {
              const x = gx + Math.sin((t / b.len) * freq * 6.28 + ph) * amp
              if (t === 0) ctx.moveTo(x, y + t)
              else ctx.lineTo(x, y + t)
            }
            ctx.stroke()
          }
          // 偶尔一个木节
          if (g() > 0.72) {
            const kx = b.x + b.w * (0.3 + g() * 0.4)
            const ky = y + b.len * (0.2 + g() * 0.6)
            const kr = b.w * (0.06 + g() * 0.06)
            const grd = ctx.createRadialGradient(kx, ky, 0, kx, ky, kr * 2.4)
            grd.addColorStop(0, 'rgba(60,34,16,0.55)')
            grd.addColorStop(0.4, 'rgba(80,48,24,0.25)')
            grd.addColorStop(1, 'rgba(80,48,24,0)')
            ctx.fillStyle = grd
            ctx.beginPath()
            ctx.ellipse(kx, ky, kr * 1.4, kr * 2.4, 0, 0, 6.29)
            ctx.fill()
          }
          ctx.restore()
          // 板缝：长边 V 槽 + 端缝
          ctx.fillStyle = 'rgba(40,24,12,0.6)'
          ctx.fillRect(b.x, y, Math.max(1, s / 900), b.len)
          ctx.fillRect(b.x, y, b.w, Math.max(1, s / 900))
        })
      }
      addNoise(ctx, s, [[s / 2, 6, seed + 3]])
    },
    normal: 0.9,
    roughBase: 0.5,
    roughRange: -0.35,
  }
}

// 瓷砖通用：n×m 块，砖缝宽 grout（占贴图边长比例），每块独立色差；body 画砖面
function tiles({ cols, rows, grout, base, groutColor, tint = 10, body, seed, normal = 1.1, roughBase, roughRange, glossy }) {
  const draw = (ctx, s, r) => {
    ctx.fillStyle = groutColor
    ctx.fillRect(0, 0, s, s)
    const cw = s / cols
    const rh = s / rows
    const gw = Math.max(1.5, grout * s)
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const d = (r() - 0.5) * tint
        ctx.fillStyle = base
        ctx.fillRect(i * cw + gw / 2, j * rh + gw / 2, cw - gw, rh - gw)
        ctx.fillStyle = d > 0 ? `rgba(255,255,255,${d / 100})` : `rgba(0,0,0,${-d / 100})`
        ctx.fillRect(i * cw + gw / 2, j * rh + gw / 2, cw - gw, rh - gw)
      }
    }
    body?.(ctx, s, r)
  }
  // 高度：砖面平、砖缝低，砖边略微倒角
  const height = (ctx, s) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, s, s)
    const cw = s / cols
    const rh = s / rows
    const gw = Math.max(1.5, grout * s)
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        ctx.fillStyle = '#9a9a9a'
        ctx.fillRect(i * cw + gw / 2, j * rh + gw / 2, cw - gw, rh - gw)
        ctx.fillStyle = '#fff'
        ctx.fillRect(i * cw + gw, j * rh + gw, cw - gw * 2, rh - gw * 2)
      }
    }
  }
  // 粗糙度：砖面 roughBase（带一点起伏），砖缝很粗糙
  const rough = (ctx, s) => {
    ctx.fillStyle = '#e8e8e8'
    ctx.fillRect(0, 0, s, s)
    const cw = s / cols
    const rh = s / rows
    const gw = Math.max(1.5, grout * s)
    const v = Math.round(roughBase * 255)
    ctx.fillStyle = `rgb(${v},${v},${v})`
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) ctx.fillRect(i * cw + gw / 2, j * rh + gw / 2, cw - gw, rh - gw)
    }
    addNoise(ctx, s, [[s / 8, glossy ? 8 : 26 * (roughRange || 1), seed + 7]])
  }
  return { draw, height, rough, normal, seed }
}

// 客餐厅：600×600 哑光仿石大砖，浅缝。一张贴图 1.2 m = 2×2 块
const stone = tiles({
  cols: 2, rows: 2, grout: 0.0022, base: '#d8d2c8', groutColor: '#b7b0a5', tint: 7, seed: 31,
  roughBase: 0.5, roughRange: 1, normal: 0.8,
  body: (ctx, s, r) => {
    addNoise(ctx, s, [[5, 10, 32], [s / 30, 6, 33], [s / 3, 3, 34]])
    // 极淡的石纹
    for (let i = 0; i < 9; i++) {
      ctx.strokeStyle = `rgba(150,140,128,${0.05 + r() * 0.07})`
      ctx.lineWidth = (0.8 + r() * 2) * (s / 1024)
      ctx.beginPath()
      let x = r() * s
      let y = r() * s
      ctx.moveTo(x, y)
      for (let k = 0; k < 6; k++) {
        x += (r() - 0.3) * s * 0.18
        y += (r() - 0.5) * s * 0.12
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  },
})

// 厨卫地面：300×300 防滑小砖，深一点的缝。一张贴图 1.2 m = 4×4 块
const floorTile = tiles({
  cols: 4, rows: 4, grout: 0.003, base: '#c9c4bb', groutColor: '#8f8a82', tint: 9, seed: 41,
  roughBase: 0.78, roughRange: 1, normal: 1.2,
  body: (ctx, s) => addNoise(ctx, s, [[s / 2.2, 16, 42], [s / 20, 6, 43]]),
})

// 卫生间 / 厨房墙砖：300×600 竖贴，亮面白砖，贴到顶。一张贴图 1.2 m = 4 列 × 2 行
const wallTile = tiles({
  cols: 4, rows: 2, grout: 0.0022, base: '#efede8', groutColor: '#c9c5bd', tint: 4, seed: 51,
  roughBase: 0.12, roughRange: 1, normal: 0.9, glossy: true,
  body: (ctx, s) => addNoise(ctx, s, [[s / 40, 3, 52]]),
})

// 木皮：直纹，中性浅色，由材质 color 着色（同一张图做浅橡木、胡桃木）
const veneer = {
  seed: 61,
  draw: (ctx, s, r) => {
    ctx.fillStyle = '#ece6dc'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 220; i++) {
      const x = r() * s
      ctx.strokeStyle = r() > 0.3 ? `rgba(90,70,50,${0.04 + r() * 0.1})` : `rgba(255,250,240,${0.05 + r() * 0.08})`
      ctx.lineWidth = (0.5 + r() * 2.4) * (s / 1024)
      const amp = (1 + r() * 5) * (s / 1024)
      const ph = r() * 6.28
      const f = 1 + Math.floor(r() * 3)
      ctx.beginPath()
      for (let y = 0; y <= s; y += 8) {
        const xx = x + Math.sin((y / s) * f * 6.28 + ph) * amp
        if (y === 0) ctx.moveTo(xx, y)
        else ctx.lineTo(xx, y)
      }
      ctx.stroke()
    }
    addNoise(ctx, s, [[s / 3, 5, 62], [4, 8, 63]])
  },
  normal: 0.5,
  roughBase: 0.5,
  roughRange: -0.2,
}

// 石英石台面：深灰底 + 细碎的亮 / 暗斑点，抛光面
const quartz = {
  seed: 71,
  draw: (ctx, s, r) => {
    ctx.fillStyle = '#4a4e53'
    ctx.fillRect(0, 0, s, s)
    addNoise(ctx, s, [[s / 6, 8, 72], [12, 6, 73]])
    for (let i = 0; i < s * 6; i++) {
      const l = r()
      ctx.fillStyle = l > 0.55 ? `rgba(236,232,224,${0.25 + r() * 0.5})` : `rgba(20,20,22,${0.3 + r() * 0.4})`
      const d = (0.4 + r() * (r() > 0.97 ? 3 : 1.2)) * (s / 1024)
      ctx.fillRect(r() * s, r() * s, d, d)
    }
  },
  height: (ctx, s) => {
    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, s, s)
  },
  roughBase: 0.16,
  roughRange: -0.08,
}

// 布纹：经纬交织 + 绒感噪声，中性浅灰，由材质 color 着色
function fabric(weave, seed, slub = 0) {
  return {
    seed,
    draw: (ctx, s, r) => {
      const w = Math.max(2, weave * (s / 512))
      ctx.fillStyle = '#e6e3de'
      ctx.fillRect(0, 0, s, s)
      for (let y = 0; y < s; y += w) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)'
        ctx.fillRect(0, y, s, w / 2)
      }
      for (let x = 0; x < s; x += w) {
        ctx.fillStyle = 'rgba(255,255,255,0.06)'
        ctx.fillRect(x, 0, w / 2, s)
      }
      // 竹节纱：亚麻那种不均匀的粗纱
      for (let i = 0; i < slub; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
        ctx.fillRect(r() * s, r() * s, s * (0.05 + r() * 0.2), w * (0.4 + r() * 0.6))
      }
      addNoise(ctx, s, [[s / 4, 18, seed + 1], [s / 40, 8, seed + 2]])
    },
    normal: 2.2,
    roughBase: 0.95,
    roughRange: -0.1,
  }
}

// 地毯绒毛：大量短笔触
const rug = {
  seed: 23,
  draw: (ctx, s, r) => {
    ctx.fillStyle = '#e2ddd5'
    ctx.fillRect(0, 0, s, s)
    const n = 14000 * (s / 512) * (s / 512)
    for (let i = 0; i < n; i++) {
      const x = r() * s
      const y = r() * s
      const l = (2 + r() * 4) * (s / 512)
      const a = r() * 6.28
      ctx.strokeStyle = r() > 0.5 ? `rgba(255,250,240,${r() * 0.18})` : `rgba(90,78,62,${r() * 0.16})`
      ctx.lineWidth = s / 512
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l)
      ctx.stroke()
    }
  },
  normal: 2,
  roughBase: 0.98,
  roughRange: -0.06,
}

const SPECS = {
  plaster,
  concrete,
  oak: oak('#b08a62', 7),
  oakWarm: oak('#a77c55', 8),
  stone,
  floorTile,
  wallTile,
  veneer,
  quartz,
  fabric: fabric(6, 11),
  linen: fabric(4, 13, 160),
  curtain: fabric(7, 17, 60),
  rug,
}

export const TEXTURE_KEYS = Object.keys(SPECS)

const cache = {}
/** 生成（并缓存）一套 { map, normalMap, roughnessMap }。同步，单张 1024 约 20–60 ms。 */
export function textureSet(key, size = TEX_SIZE) {
  return (cache[key] ??= build(SPECS[key], size))
}

// ---------------- 挂画（只需颜色贴图，小图，同步生成） ----------------

function drawArtwork(seed, bg, palette) {
  return (ctx, size) => {
    const r = mulberry32(seed)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = palette[i % palette.length]
      ctx.globalAlpha = 0.55 + r() * 0.35
      const w = size * (0.18 + r() * 0.42)
      const h = size * (0.16 + r() * 0.5)
      ctx.fillRect(size * (0.06 + r() * 0.5), size * (0.06 + r() * 0.45), w, h)
    }
    ctx.globalAlpha = 0.5 + r() * 0.3
    ctx.fillStyle = palette[(palette.length - 1) % palette.length]
    ctx.beginPath()
    ctx.arc(size * (0.25 + r() * 0.5), size * (0.3 + r() * 0.4), size * (0.09 + r() * 0.11), 0, 6.284)
    ctx.fill()
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
    addNoise(ctx, size, [[90, 10, seed + 5]])
  }
}

const ART = {
  art1: [13, '#e9e3d7', ['#8a9b8e', '#c4a882', '#5f6b6f']],
  art2: [29, '#efe9de', ['#b98d6a', '#7d8794', '#d8c7a8']],
  art3: [47, '#e6e0d4', ['#9a8298', '#7f9184', '#cbb896']],
}
const artCache = {}
export function artMap(key) {
  if (artCache[key]) return artCache[key]
  const canvas = makeCanvas(256)
  drawArtwork(...ART[key])(canvas.getContext('2d'), 256)
  const map = new CanvasTexture(canvas)
  map.colorSpace = SRGBColorSpace
  map.anisotropy = 4
  return (artCache[key] = map)
}

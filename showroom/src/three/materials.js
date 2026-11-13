import { MeshStandardMaterial, MeshPhysicalMaterial, Vector2, DoubleSide, TextureLoader, ImageBitmapLoader, Texture, DataTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import { useHA } from '../ha/store'
import { textureSet } from './textures'
import { MOBILE_QUERY } from '../hooks'

// ============================================================
// 材质唯一定义处。场景里所有"表面"都从 getMat(name, overrides) 取共享材质。
//
//   tex     —— textures.js 里的程序化贴图键；meters —— 一张贴图对应的真实边长（米）
//   几何 UV 一律按米给（ExtrudeGeometry / RoundedBox 天生如此，盒子用 metersUV()），
//   所以贴图密度只由这里的 meters 决定，不会随房间、家具尺寸拉伸。
//
// img —— CC0 图片贴图集（src/assets/textures/<img>/），canvas 创建时就开始懒加载（后台线程解码）；
// tex —— 程序化回退：没有图片、或图片加载失败时用它，首帧之后才后台逐张生成。
// 首帧只用纯色参数，不等任何贴图，加载不变慢。换贴图只改这张表。
// ============================================================

const IS_MOBILE = typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches

export const MATERIALS = {
  // ---- 壳体 ----
  wall: { color: '#f3f0ea', roughness: 0.9, img: 'plaster', tex: 'plaster', meters: 2, normalScale: 0.35 },
  wallExt: { color: '#e9e5dd', roughness: 0.92, img: 'plaster', tex: 'plaster', meters: 1.4, normalScale: 0.6 },
  wallCut: { color: '#9d978e', roughness: 0.95, tex: 'concrete', meters: 0.7, normalScale: 0.6 },
  wallTile: { color: '#ffffff', roughness: 0.15, img: 'wallTile', tex: 'wallTile', meters: 1.6, normalScale: 0.8, physical: { clearcoat: 0.6, clearcoatRoughness: 0.12 } },
  skirting: { color: '#ece7de', roughness: 0.45 },
  floorOak: { color: '#ffffff', roughness: 0.5, img: 'oak', tex: 'oak', meters: 1.7, normalScale: 0.7 },
  floorOakWarm: { color: '#ffffff', roughness: 0.5, img: 'oakWarm', tex: 'oakWarm', meters: 1.7, normalScale: 0.7 },
  floorStone: { color: '#f6f1e8', roughness: 0.5, img: 'tiles', tex: 'stone', meters: 2.4, normalScale: 0.6 },      // 600×600 大砖
  floorTile: { color: '#cfc8bc', roughness: 0.78, img: 'tiles', tex: 'floorTile', meters: 1.2, normalScale: 0.9 },  // 300×300 防滑砖

  // ---- 木作 / 台面 ----
  veneer: { color: '#c39d76', roughness: 0.5, img: 'veneer', tex: 'veneer', meters: 1.83, normalScale: 0.5 },
  lacquer: { color: '#e2ded6', roughness: 0.42 },                          // 烤漆柜门
  quartz: { color: '#ffffff', roughness: 0.16, img: 'quartz', tex: 'quartz', meters: 1, physical: { clearcoat: 0.4, clearcoatRoughness: 0.08 } },
  ceramic: { color: '#f5f3ef', roughness: 0.12, physical: { clearcoat: 1, clearcoatRoughness: 0.05 } },

  // ---- 布艺（sheen 让织物边缘有绒光）----
  fabric: { color: '#7d8794', roughness: 0.95, img: 'fabric', tex: 'fabric', meters: 0.26, normalScale: 0.8, physical: { sheen: 1, sheenRoughness: 0.75 } },
  linen: { color: '#ece6dc', roughness: 0.95, img: 'linen', tex: 'linen', meters: 0.27, normalScale: 0.7, physical: { sheen: 0.8, sheenRoughness: 0.8 } },
  curtain: { color: '#e6ded1', roughness: 0.97, tex: 'curtain', meters: 0.45, normalScale: 0.9, physical: { sheen: 0.7, sheenRoughness: 0.7 }, side: DoubleSide },
  rug: { color: '#c4b8a5', roughness: 0.98, tex: 'rug', meters: 1.2, normalScale: 0.9 },

  // ---- 金属 / 玻璃 / 镜面 ----
  alu: { color: '#6b6f74', roughness: 0.32, metalness: 0.9 },            // 铝合金窗框
  steel: { color: '#c4c8cb', roughness: 0.22, metalness: 1 },             // 不锈钢：龙头、扶手、水槽
  brass: { color: '#8d8378', roughness: 0.3, metalness: 0.9 },            // 把手
  blackMetal: { color: '#2c2e31', roughness: 0.45, metalness: 0.7 },
  plastic: { color: '#f3f1ec', roughness: 0.45 },                         // 家电外壳
  glass: { color: '#dfeaee', roughness: 0.02, metalness: 0, transparent: true, opacity: 0.14, depthWrite: false, physical: { ior: 1.5, specularIntensity: 1 }, envMapIntensity: 1.6 },
  showerGlass: { color: '#d4e2e6', roughness: 0.04, transparent: true, opacity: 0.2, depthWrite: false, physical: { ior: 1.5 }, envMapIntensity: 1.4 },
  mirror: { color: '#dfe5e8', roughness: 0.02, metalness: 1, envMapIntensity: 1.2 },
  screen: { color: '#07090c', roughness: 0.06, physical: { clearcoat: 1, clearcoatRoughness: 0.03 } },
}

// CC0 图片贴图（来源见仓库根 ASSET_SOURCES.md）：src/assets/textures/<集>/{map,normal,rough}[_512].webp
// 只取 URL（不内联），按需懒加载。
const IMG_URLS = import.meta.glob('../assets/textures/*/*.webp', { query: '?url', import: 'default', eager: true })
const imgUrl = (set, file) => IMG_URLS[`../assets/textures/${set}/${file}.webp`]

const cache = new Map()
const READY = new Map()           // 来源键（img:xx / tex:xx）-> 贴图集
const waiting = new Map()         // 来源键 -> 等它的材质
let anisotropy = 4

const sourceOf = (spec) => (spec.img ? `img:${spec.img}` : spec.tex ? `tex:${spec.tex}` : null)

function keyOf(name, o) {
  return o ? `${name}|${JSON.stringify(o)}` : name
}

/** 取共享材质。overrides 可覆盖 color / roughness / metalness 等，同一组参数只建一份。 */
export function getMat(name, overrides) {
  const k = keyOf(name, overrides)
  let m = cache.get(k)
  if (m) return m
  const spec = { ...MATERIALS[name], ...overrides }
  const { tex, img, meters = 1, normalScale = 1, physical, ...params } = spec
  // 手机上布料、瓷砖退回标准材质（sheen / clearcoat 多一套 BRDF，很吃片元）
  const usePhysical = physical && !IS_MOBILE
  m = usePhysical ? new MeshPhysicalMaterial({ ...params, ...physical }) : new MeshStandardMaterial(params)
  if (usePhysical && physical.sheen) m.sheenColor.copy(m.color).lerp({ r: 1, g: 1, b: 1 }, 0.35)
  m.userData = { tex, img, meters, normalScale, slots: expectedSlots(spec) }
  // 占位贴图：材质一出生就带着最终会有的那几个贴图槽（1×1 白图 / 平法线 / 粗糙度 1），
  // 真贴图到了只是换 texture 对象，shader 宏不变 —— 不会在首帧之后再整批重编译。
  for (const slot of m.userData.slots) m[slot] = PLACEHOLDER[slot]
  if (m.normalMap) m.normalScale = new Vector2(normalScale, normalScale)
  cache.set(k, m)
  const src = sourceOf(spec)
  if (src) {
    if (READY.has(src)) applySet(m, READY.get(src))
    else (waiting.get(src) ?? waiting.set(src, []).get(src)).push(m)
  }
  return m
}

function pixel(rgba, color) {
  const t = new DataTexture(new Uint8Array(rgba), 1, 1)
  if (color) t.colorSpace = SRGBColorSpace
  t.needsUpdate = true
  return t
}
const PLACEHOLDER = {
  map: pixel([255, 255, 255, 255], true),
  normalMap: pixel([128, 128, 255, 255]),
  roughnessMap: pixel([255, 255, 255, 255]),
}

// 这个材质最终会有哪些贴图槽：图片集看文件是否存在（手机不加载法线），纯程序化三张都有
function expectedSlots(spec) {
  if (spec.img && imgUrl(spec.img, 'rough')) {
    return [
      imgUrl(spec.img, 'map') && 'map',
      !IS_MOBILE && imgUrl(spec.img, 'normal') && 'normalMap',
      'roughnessMap',
    ].filter(Boolean)
  }
  return spec.tex ? ['map', 'normalMap', 'roughnessMap'] : []
}

// 每个材质自己 clone 一份贴图对象（只为各自的 repeat；clone 共享同一个 Source，显存只占一份）
function applySet(m, set) {
  const rep = 1 / m.userData.meters
  for (const slot of m.userData.slots) {
    if (!set[slot]) continue
    const t = set[slot].clone()
    t.repeat.set(rep, rep)
    t.anisotropy = anisotropy
    m[slot] = t
  }
  if (set.roughnessMap) m.roughness = 1                 // 粗糙度贴图里是绝对值
  // 槽位与占位时一致，不需要 needsUpdate（那会触发重编译）
}

function publish(src, set) {
  READY.set(src, set)
  for (const m of waiting.get(src) ?? []) applySet(m, set)
  waiting.delete(src)
}

// 图片贴图：createImageBitmap 在后台线程解码（ImageBitmapLoader），不在主线程上卡上传；
// 浏览器不支持时退回 TextureLoader。每个文件计入加载屏进度。
// 手机加载 512 版本、跳过法线。任何一张失败 → 整集回退到程序化纹理，不会白屏。
const canBitmap = typeof createImageBitmap !== 'undefined'
function loadTexture(url, color) {
  const { loadStart, loadDone } = useHA.getState()
  loadStart()
  const viaBitmap = () => new ImageBitmapLoader()
    .setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' })
    .loadAsync(url)
    .then((bmp) => {
      const t = new Texture(bmp)
      t.flipY = false                      // 已在解码时翻转
      return t
    })
  const viaImage = () => new TextureLoader().loadAsync(url)
  return (canBitmap ? viaBitmap().catch(viaImage) : viaImage())
    .then((t) => {
      t.wrapS = t.wrapT = RepeatWrapping
      if (color) t.colorSpace = SRGBColorSpace
      t.needsUpdate = true
      return t
    })
    .finally(loadDone)
}

function loadImageSet(name, fallbackTex) {
  const pick = (file) => (IS_MOBILE ? imgUrl(name, `${file}_512`) ?? imgUrl(name, file) : imgUrl(name, file))
  const slots = [['map', pick('map'), true], ['roughnessMap', pick('rough')], ['normalMap', IS_MOBILE ? null : imgUrl(name, 'normal')]]
    .filter(([, url]) => url)
  return Promise.all(slots.map(([slot, url, color]) => loadTexture(url, color).then((t) => [slot, t]))).then(
    (pairs) => Object.fromEntries(pairs),
    () => (fallbackTex ? textureSet(fallbackTex) : {}),
  )
}

// 贴图集到齐后排队、首帧之后每帧最多挂一集：首帧只画占位纯色（少 100+ ms 的 GPU 上传），
// 真贴图在加载屏淡出的 400 ms 里逐集换上；也避免同一帧里十几张 1024 贴图一起上传。
const publishQueue = []
let canPublish = false
function enqueuePublish(src, set) {
  publishQueue.push([src, set])
  if (canPublish && publishQueue.length === 1) requestAnimationFrame(drainPublish)
}
function drainPublish() {
  const next = publishQueue.shift()
  if (next) publish(...next)
  if (publishQueue.length) requestAnimationFrame(drainPublish)
}

let started = false
/**
 * Canvas 创建时调用（onCreated）：图片贴图立即开始并行下载（与 HDRI 同时，进度条可见）；
 * 程序化纹理（没有图片的材质，或图片失败的回退）放到首帧之后逐张生成。
 */
export function startTextures(gl) {
  if (started) return
  started = true
  anisotropy = Math.min(IS_MOBILE ? 4 : 16, gl.capabilities.getMaxAnisotropy())
  const imgs = new Map()
  for (const spec of Object.values(MATERIALS)) if (spec.img) imgs.set(spec.img, spec.tex)
  for (const [name, fallback] of imgs) {
    if (!imgUrl(name, 'rough')) continue
    loadImageSet(name, fallback).then((set) => enqueuePublish(`img:${name}`, set))
  }
}

/** 首帧之后：放行已下载好的图片贴图；生成只有程序化来源的贴图（以及没有图片文件的集），每张之间让出主线程。 */
let procStarted = false
export function startProceduralTextures() {
  if (procStarted) return
  procStarted = true
  canPublish = true
  if (publishQueue.length) requestAnimationFrame(drainPublish)
  const queue = [...new Set(Object.values(MATERIALS)
    .filter((s) => s.tex && (!s.img || !imgUrl(s.img, 'rough')))
    .map((s) => s.tex))]
  const step = () => {
    const key = queue.shift()
    if (!key) return
    const set = textureSet(key)
    publish(`tex:${key}`, set)
    // 图片集缺文件时，材质登记在 img: 下，同样回退
    for (const spec of Object.values(MATERIALS)) if (spec.tex === key && spec.img && !imgUrl(spec.img, 'rough')) publish(`img:${spec.img}`, set)
    setTimeout(step, 30)
  }
  setTimeout(step, 60)
}

/**
 * 盒子类几何（BoxGeometry、pillowGeometry）的 UV 改成按米的方盒投影：
 * 每个顶点按法线主轴挑两根坐标轴，uv = 坐标（米）+ offset。
 */
export function metersUV(geometry, offset = [0, 0, 0]) {
  const pos = geometry.attributes.position
  const nor = geometry.attributes.normal
  const uv = geometry.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + offset[0]
    const y = pos.getY(i) + offset[1]
    const z = pos.getZ(i) + offset[2]
    const ax = Math.abs(nor.getX(i))
    const ay = Math.abs(nor.getY(i))
    const az = Math.abs(nor.getZ(i))
    if (ax >= ay && ax >= az) uv.setXY(i, z, y)
    else if (ay >= az) uv.setXY(i, x, z)
    else uv.setXY(i, x, y)
  }
  uv.needsUpdate = true
  return geometry
}

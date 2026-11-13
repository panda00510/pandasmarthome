import { useMemo } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { usePlan } from '../ha/store'
import { getMat } from './materials'

// 旧的 Blender 烘焙贴图是上一版 198 ㎡ 户型的，套到新墙上会对不齐。
// gi !== 'baked' 时整屋壳体在这里按 plans/<户型>.json 实时生成，点光源直接照到墙和地面。
//
// 墙不再是同一块白色盒子：每段墙的两个大面按"面朝哪个房间"选材质 ——
// 厨卫贴砖到顶、居室乳胶漆 + 踢脚线、外立面单独一种漆，墙顶截面用混凝土剖面色。
// 所有面按材质合并成几张大网格（一种材质一次 draw call），UV 按世界坐标（米）给，
// 相邻墙段的纹理自然连续。

const WET = new Set(['bath', 'mbath', 'kitchen', 'yard'])
const FLOOR_MAT = { woodFloor: 'floorOak', woodFloorWarm: 'floorOakWarm', tile: 'floorTile', stone: 'floorStone' }
const SKIRT_H = 0.08
const SKIRT_D = 0.012

function segments(start, end, holes, height) {
  const segs = []
  let cursor = start
  const sorted = [...(holes || [])].sort((a, b) => a.from - b.from)
  for (const h of sorted) {
    if (h.from > cursor + 1e-4) segs.push([cursor, h.from, 0, height])
    if (h.y0 > 0) segs.push([h.from, h.to, 0, h.y0])
    if (h.y1 < height) segs.push([h.from, h.to, h.y1, height])
    cursor = Math.max(cursor, h.to)
  }
  if (cursor < end - 1e-4) segs.push([cursor, end, 0, height])
  return segs
}

// 盒子六个面：法线 n，面内两轴 u、v（u×v=n，保证逆时针朝外）
const FACES = [
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
]
const FACE = { px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5 }

// 往对应材质的桶里压一个盒子；matFor(faceIndex) 返回材质名（null 表示不画这个面）。
// uvOff / swap：地面按房间错开相位、长条板顺着房间长边。
function pushBox(buckets, c, s, matFor, uvOff = [0, 0], swap = false) {
  FACES.forEach((f, fi) => {
    const name = matFor(fi)
    if (!name) return
    const b = (buckets[name] ??= { pos: [], nor: [], uv: [] })
    const corner = (su, sv) => [0, 1, 2].map((k) => c[k] + (f.n[k] * s[k]) / 2 + (su * f.u[k] * s[k]) / 2 + (sv * f.v[k] * s[k]) / 2)
    const q = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, -1), corner(1, 1), corner(-1, 1)]
    for (const p of q) {
      b.pos.push(...p)
      b.nor.push(...f.n)
      const [ax, ay] = f.n.map(Math.abs)
      let uv = ax ? [p[2], p[1]] : ay ? [p[0], p[2]] : [p[0], p[1]]
      if (swap) uv = [uv[1], uv[0]]
      b.uv.push(uv[0] + uvOff[0], uv[1] + uvOff[1])
    }
  })
}

function toGeometry({ pos, nor, uv }) {
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new Float32BufferAttribute(nor, 3))
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2))
  g.computeBoundingSphere()
  return g
}

function roomAt(rooms, x, z) {
  for (const [id, r] of Object.entries(rooms)) {
    if (x > r.x0 && x < r.x1 && z > r.z0 && z < r.z1) return id
  }
  return null
}

// 由房间 id 稳定地算一个 UV 相位，同名区域（如 living + living_e）共用，砖缝才对得上
function phase(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return [((h >>> 0) % 997) / 997 * 1.2, ((h >>> 10) % 991) / 991 * 1.2]
}

function buildShell(PLAN) {
  const H = PLAN.wallH
  const walls = {}
  const floors = {}
  const rooms = PLAN.rooms
  const faceMat = (room) => (room == null ? 'wallExt' : WET.has(room) ? 'wallTile' : 'wall')

  for (const w of [...PLAN.exterior, ...PLAN.interior]) {
    const T = w.thickness || PLAN.wallT
    const isX = w.axis === 'x'
    for (let [a, b, y0, y1] of segments(w.from, w.to, w.holes, H)) {
      if (b - a < 1e-3 || y1 - y0 < 1e-3) continue
      // 墙按中线定义，两端各补半个墙厚，转角处才不会留一个缺口
      if (Math.abs(a - w.from) < 1e-4) a -= PLAN.wallT / 2
      if (Math.abs(b - w.to) < 1e-4) b += PLAN.wallT / 2

      // 在房间分界处把墙段切开，一段墙的一面只朝向一个房间（厨房砖不会贴进玄关）
      const cuts = new Set([a, b])
      for (const side of [-1, 1]) {
        const off = w.at + side * (T / 2 + 0.03)
        for (const r of Object.values(rooms)) {
          const [lo, hi, c0, c1] = isX ? [r.x0, r.x1, r.z0, r.z1] : [r.z0, r.z1, r.x0, r.x1]
          if (off <= c0 || off >= c1) continue
          for (const v of [lo, hi]) if (v > a + 0.02 && v < b - 0.02) cuts.add(v)
        }
      }
      const pts = [...cuts].sort((p, q) => p - q)
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i]
        const p1 = pts[i + 1]
        const mid = (p0 + p1) / 2
        const at = (side) => w.at + side * (T / 2 + 0.03)
        const roomP = isX ? roomAt(rooms, mid, at(1)) : roomAt(rooms, at(1), mid)
        const roomN = isX ? roomAt(rooms, mid, at(-1)) : roomAt(rooms, at(-1), mid)
        const matP = faceMat(roomP)
        const matN = faceMat(roomN)
        const c = isX ? [mid, (y0 + y1) / 2, w.at] : [w.at, (y0 + y1) / 2, mid]
        const s = isX ? [p1 - p0, y1 - y0, T] : [T, y1 - y0, p1 - p0]
        const big = isX ? { [FACE.pz]: matP, [FACE.nz]: matN } : { [FACE.px]: matP, [FACE.nx]: matN }
        pushBox(walls, c, s, (fi) => {
          if (big[fi]) return big[fi]
          if (fi === FACE.py) return y1 >= H - 1e-4 ? 'wallCut' : 'wall'   // 墙顶剖面 / 窗下墙顶
          if (fi === FACE.ny) return y0 > 0 ? 'wall' : null                 // 过梁底面；落地的底面看不见
          return 'wall'                                                      // 门窗洞侧壁
        })
        // 踢脚线：只在居室刷漆的墙面、落地的墙段
        if (y0 === 0) {
          for (const [side, mat] of [[1, matP], [-1, matN]]) {
            if (mat !== 'wall') continue
            const o = w.at + side * (T / 2 + SKIRT_D / 2)
            const sc = isX ? [mid, SKIRT_H / 2, o] : [o, SKIRT_H / 2, mid]
            const ss = isX ? [p1 - p0, SKIRT_H, SKIRT_D] : [SKIRT_D, SKIRT_H, p1 - p0]
            pushBox(walls, sc, ss, (fi) => (fi === FACE.ny ? null : 'skirting'))
          }
        }
      }
    }
  }

  for (const [id, r] of Object.entries(rooms)) {
    const w = r.x1 - r.x0
    const d = r.z1 - r.z0
    const mat = FLOOR_MAT[r.floor] ?? 'floorTile'
    // 木地板顺着房间长边铺；同名区域（客餐厅的几块）共用相位，砖缝连续
    const swap = mat.startsWith('floorOak') && w > d
    pushBox(floors, [(r.x0 + r.x1) / 2, -0.012, (r.z0 + r.z1) / 2], [w, 0.02, d],
      (fi) => (fi === FACE.ny ? null : mat), phase(r.name?.en ?? id), swap)
  }

  const out = (b) => Object.entries(b).map(([name, data]) => ({ name, geometry: toGeometry(data) }))
  return { walls: out(walls), floors: out(floors) }
}

export default function ProceduralShell() {
  const PLAN = usePlan()
  const { walls, floors } = useMemo(() => buildShell(PLAN), [PLAN])
  return (
    <group>
      {/* 以前这里有一盏恒定 0.2 的半球光，夜里也不减弱，关了灯屋里还是亮的、阴影发灰。
          天光现在只由 Fixtures 的 Daylight 按昼夜曲线给（夜里降到 0.05）。 */}
      {floors.map(({ name, geometry }) => (
        <mesh key={'f' + name} geometry={geometry} material={getMat(name)} receiveShadow />
      ))}
      {walls.map(({ name, geometry }) => (
        <mesh key={'w' + name} geometry={geometry} material={getMat(name)} castShadow receiveShadow />
      ))}
    </group>
  )
}

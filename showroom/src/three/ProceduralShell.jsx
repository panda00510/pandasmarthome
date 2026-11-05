import { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { PLAN } from './utils'
import { getTextures, tiled } from './textures'

// 旧的 Blender 烘焙贴图是上一版 198 ㎡ 户型的，套到新墙上会对不齐。
// gi !== 'baked' 时整屋壳体在这里按 plan.json 实时生成，点光源直接照到墙和地面。

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

function useWallMaterial() {
  return useMemo(() => {
    const maps = tiled(getTextures().wall, 2.4, 1.5)
    return new MeshStandardMaterial({ color: '#ffffff', roughness: 0.92, metalness: 0, ...maps })
  }, [])
}

function useFloorMaterial(key, w, d) {
  return useMemo(() => {
    const tex = getTextures()[key] || getTextures().tile
    const maps = tiled(tex, Math.max(1, w / 1.15), Math.max(1, d / 1.15))
    return new MeshStandardMaterial({ color: '#ffffff', roughness: 0.86, metalness: 0, ...maps })
  }, [key, w, d])
}

function Floor({ room }) {
  const w = room.x1 - room.x0
  const d = room.z1 - room.z0
  const material = useFloorMaterial(room.floor, w, d)
  return (
    <mesh position={[(room.x0 + room.x1) / 2, -0.012, (room.z0 + room.z1) / 2]} receiveShadow material={material}>
      <boxGeometry args={[w, 0.02, d]} />
    </mesh>
  )
}

function Walls({ material }) {
  const boxes = useMemo(() => {
    const H = PLAN.wallH
    const out = []
    for (const w of [...PLAN.exterior, ...PLAN.interior]) {
      const T = w.thickness || PLAN.wallT
      for (const [a, b, y0, y1] of segments(w.from, w.to, w.holes, H)) {
        if (b - a < 1e-3 || y1 - y0 < 1e-3) continue
        const mid = (a + b) / 2
        const midY = (y0 + y1) / 2
        if (w.axis === 'x') {
          out.push({ pos: [mid, midY, w.at], size: [b - a, y1 - y0, T] })
        } else {
          out.push({ pos: [w.at, midY, mid], size: [T, y1 - y0, b - a] })
        }
      }
    }
    return out
  }, [])

  return boxes.map((b, i) => (
    <mesh key={i} position={b.pos} castShadow receiveShadow material={material}>
      <boxGeometry args={b.size} />
    </mesh>
  ))
}

export default function ProceduralShell() {
  const wallMat = useWallMaterial()
  return (
    <group>
      {/* 没有烘焙间接光，补一层很弱的天光，避免内房全黑，同时灯的开关仍然看得出。 */}
      <hemisphereLight args={['#d7e3f0', '#6d655c', 0.2]} />
      {Object.entries(PLAN.rooms).map(([id, room]) => (
        <Floor key={id} room={room} />
      ))}
      <Walls material={wallMat} />
    </group>
  )
}

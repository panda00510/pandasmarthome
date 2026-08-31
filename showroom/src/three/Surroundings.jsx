import { useMemo } from 'react'
import { PLAN } from './utils'

// 确定性伪随机，保证每次刷新场景一致
function rng(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 窗户朝南（+z）和朝西（-x），远景只铺这两侧
function useSkyline() {
  return useMemo(() => {
    const r = rng(41)
    const out = []
    // 角度覆盖西侧到南侧再到东南
    for (let i = 0; i < 26; i++) {
      const angle = Math.PI * (0.06 + (i / 25) * 1.06) // 约 11° → 202°
      const dist = 52 + r() * 30
      const h = 5 + r() * 20
      const w = 5 + r() * 9
      const d = 5 + r() * 9
      out.push({
        pos: [Math.cos(angle) * -dist, h / 2 - 1.5, Math.sin(angle) * dist],
        size: [w, h, d],
        tone: 0.35 + r() * 0.25,
      })
    }
    return out
  }, [])
}

function useTrees() {
  return useMemo(() => {
    const r = rng(97)
    const out = []
    // 只种在窗户视线方向，且退到雾里，避免在全屋俯视时挡住房子
    // 全部推到雾的起点之外，只作为背景层次存在，不与房子争视线
    const spots = [
      [-26.0, 41.0], [-4.0, 44.0], [12.0, 40.0], [24.0, 46.0],
      [-38.0, 9.0], [-35.0, -7.0], [-42.0, 19.0],
      [-10.0, 56.0], [32.0, 50.0], [-24.0, 52.0],
    ]
    for (const [x, z] of spots) {
      const scale = 1.5 + r() * 0.8
      out.push({
        pos: [x, -0.3, z],
        scale,
        crowns: [
          { y: 2.5 * scale, r: 1.35 * scale, off: [0, 0] },
          { y: 3.3 * scale, r: 1.0 * scale, off: [(r() - 0.5) * 0.7, (r() - 0.5) * 0.7] },
          { y: 1.9 * scale, r: 1.05 * scale, off: [(r() - 0.5) * 0.9, (r() - 0.5) * 0.9] },
        ],
        tone: 0.8 + r() * 0.4,
      })
    }
    return out
  }, [])
}

// 落地窗外原本是空的，窗户看起来像贴在墙上的蓝色板子。
// 补一层中景树和远景天际线，让窗外有纵深；两者都靠雾自然淡化，不破坏悬浮地台的干净背景。
export default function Surroundings() {
  const skyline = useSkyline()
  const trees = useTrees()

  return (
    <group>
      {/* 远景：天际线剪影 */}
      {skyline.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial
            color={`rgb(${Math.round(74 * b.tone + 34)}, ${Math.round(84 * b.tone + 38)}, ${Math.round(96 * b.tone + 44)})`}
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}

      {/* 中景：树 */}
      {trees.map((t, i) => (
        <group key={i} position={t.pos}>
          <mesh position={[0, 1.1 * t.scale, 0]}>
            <cylinderGeometry args={[0.11 * t.scale, 0.16 * t.scale, 2.2 * t.scale, 7]} />
            <meshStandardMaterial color="#3b332a" roughness={1} />
          </mesh>
          {t.crowns.map((c, j) => (
            <mesh key={j} position={[c.off[0], c.y, c.off[1]]}>
              <icosahedronGeometry args={[c.r, 1]} />
              <meshStandardMaterial
                color={`rgb(${Math.round(40 * t.tone + 12)}, ${Math.round(52 * t.tone + 16)}, ${Math.round(43 * t.tone + 14)})`}
                roughness={1}
                flatShading
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

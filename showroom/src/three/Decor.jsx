import { RoundedBox } from '@react-three/drei'
import { getTextures } from './textures'
import { usePlan } from '../ha/store'
import { latheGeometry, PROFILES } from './shapes'

let TURNED = null
function turned() {
  if (!TURNED) {
    TURNED = {
      vase: latheGeometry(PROFILES.vase, 28),
      mug: latheGeometry(PROFILES.mug, 22),
      bowl: latheGeometry(PROFILES.bowl, 26),
    }
  }
  return TURNED
}

// 样板间的"住过人"的感觉全在这些小东西上：空墙和空台面是未完工感的主要来源。
function Box({ p, s, c, r = 0.7, m = 0, radius = 0.008, rot }) {
  return (
    <RoundedBox
      args={s}
      radius={Math.min(radius, Math.min(...s) * 0.32)}
      smoothness={2}
      position={p}
      rotation={rot}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={c} roughness={r} metalness={m} />
    </RoundedBox>
  )
}

// 挂画：画框 + 程序化生成的画芯
function Art({ p, w, h, frame = '#4a4038', art = 'art1', axis = 'x', flip = false }) {
  const d = 0.035
  const map = getTextures()[art]
  const size = axis === 'x' ? [d, h, w] : [w, h, d]
  const face = axis === 'x' ? [h - 0.1, w - 0.1] : [w - 0.1, h - 0.1]
  const offset = (flip ? -1 : 1) * (d * 0.55)
  const off = axis === 'x' ? [offset, 0, 0] : [0, 0, offset]
  const rot = axis === 'x' ? [0, (flip ? -1 : 1) * Math.PI / 2, Math.PI / 2] : [0, flip ? Math.PI : 0, 0]
  return (
    <group position={p}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
      <mesh position={off} rotation={rot}>
        <planeGeometry args={face} />
        <meshStandardMaterial map={map} roughness={0.88} />
      </mesh>
    </group>
  )
}

function Books({ p, rot = 0, colors: colorsIn, palette = ['#8a5f4a', '#4f5f6b', '#c2b49a'] }) {
  const colors = colorsIn ?? palette
  return (
    <group position={p} rotation={[0, rot, 0]}>
      {colors.map((c, i) => (
        <Box
          key={i}
          p={[i * 0.012, 0.019 + i * 0.032, i * 0.008]}
          s={[0.21 - i * 0.014, 0.03, 0.15 - i * 0.008]}
          c={c}
          r={0.85}
          rot={[0, i * 0.09, 0]}
        />
      ))}
    </group>
  )
}

function Vase({ p, c = '#b8ada0', flowers = '#7d8f6e' }) {
  return (
    <group position={p}>
      <mesh geometry={turned().vase} position={[0, -0.12, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={c} roughness={0.35} />
      </mesh>
      {[[-0.03, 0.02], [0.02, -0.03], [0.01, 0.03]].map(([dx, dz], i) => (
        <group key={i} position={[dx, 0.2, dz]} rotation={[dz * 3, 0, -dx * 3]}>
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.005, 0.006, 0.22, 6]} />
            <meshStandardMaterial color="#5c6b4d" roughness={1} />
          </mesh>
          <mesh position={[0, 0.24, 0]} castShadow>
            <icosahedronGeometry args={[0.052, 0]} />
            <meshStandardMaterial color={flowers} roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Bowl({ p, r = 1, c = '#e4ddd2' }) {
  return (
    <mesh geometry={turned().bowl} position={p} scale={r} castShadow receiveShadow>
      <meshStandardMaterial color={c} roughness={0.32} />
    </mesh>
  )
}

function Mug({ p, c: cIn }) {
  const c = cIn ?? '#cfc6bb'
  return (
    <group position={p}>
      <mesh geometry={turned().mug} position={[0, -0.048, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={c} roughness={0.3} />
      </mesh>
      <mesh position={[0.046, 0.005, 0]} rotation={[Math.PI / 2, 0, -0.2]} castShadow>
        <torusGeometry args={[0.026, 0.0055, 8, 16, Math.PI * 1.25]} />
        <meshStandardMaterial color={c} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Jars({ p }) {
  return [0, 1, 2].map((i) => (
    <mesh key={i} position={[p[0] + i * 0.12, p[1], p[2]]} castShadow>
      <cylinderGeometry args={[0.028, 0.028, 0.12, 10]} />
      <meshStandardMaterial color={['#8e7b60', '#a8946f', '#6f6a58'][i]} roughness={0.5} />
    </mesh>
  ))
}

// 软装按户型写在 plans/<户型>.json 的 decor 里
export default function Decor() {
  const { decor = [] } = usePlan()
  return (
    <group>
      {decor.map((d, i) => {
        const rot = ((d.rot ?? 0) * Math.PI) / 180
        switch (d.type) {
          case 'art':
            return <Art key={i} p={d.pos} w={d.w} h={d.h} axis={d.axis} flip={d.flip} art={d.art} frame={d.frame} />
          case 'books':
            return <Books key={i} p={d.pos} rot={rot} colors={d.colors} />
          case 'mug':
            return <Mug key={i} p={d.pos} c={d.color} />
          case 'vase':
            return <Vase key={i} p={d.pos} />
          case 'bowl':
            return <Bowl key={i} p={d.pos} r={0.85} />
          case 'runner':
            return <Box key={i} p={d.pos} s={d.size} c="#a8967f" r={0.95} radius={0.004} />
          case 'board':
            return <Box key={i} p={d.pos} s={[0.32, 0.02, 0.22]} c="#a37f52" r={0.7} radius={0.01} />
          case 'jars':
            return <Jars key={i} p={d.pos} />
          default:
            return null
        }
      })}
    </group>
  )
}

import { RoundedBox } from '@react-three/drei'
import { getTextures } from './textures'
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

function Books({ p, rot = 0, colors = ['#8a5f4a', '#4f5f6b', '#c2b49a'] }) {
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

function Mug({ p, c = '#cfc6bb' }) {
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

export default function Decor() {
  return (
    <group>
      <Art p={[-1.08, 1.5, -3.45]} w={0.62} h={0.78} axis="x" frame="#5a4e40" art="art1" flip />
      <Books p={[-4.15, 0.4, -2.55]} rot={0.2} />
      <Mug p={[-4.5, 0.45, -2.25]} />
      <Box p={[-4.55, 0.74, 0.15]} s={[0.32, 0.008, 0.22]} c="#a8967f" r={0.95} radius={0.004} />
      <Vase p={[-3.95, 0.86, 0.35]} />

      <Books p={[2.28, 0.42, -3.62]} rot={-0.2} colors={['#6b7f8a', '#c9b7a0']} />
      <Art p={[4.9, 1.55, -4.06]} w={0.36} h={0.48} frame="#6b5c4a" art="art2" axis="z" />

      <Box p={[-4.7, 0.94, 3.4]} s={[0.32, 0.02, 0.22]} c="#a37f52" r={0.7} radius={0.01} />
      <Bowl p={[-4.15, 0.95, 4.05]} r={0.85} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-4.55, 0.98, 2.7 + i * 0.12]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.12, 10]} />
          <meshStandardMaterial color={['#8e7b60', '#a8946f', '#6f6a58'][i]} roughness={0.5} />
        </mesh>
      ))}

      <Mug p={[-0.35, 0.88, 1.95]} c="#dfe3e2" />
    </group>
  )
}

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
      {/* ---------- 客厅 ---------- */}
      {/* 西墙挂画（避开落地窗） */}
      <Art p={[-5.9, 1.6, 2.3]} w={0.78} h={1.02} axis="x" art="art1" />
      <Art p={[-5.9, 1.5, -3.2]} w={0.62} h={0.78} axis="x" frame="#6b5c4a" art="art2" />

      {/* 茶几：书 + 托盘 + 杯子 */}
      <Books p={[-3.34, 0.39, -0.62]} rot={0.22} />
      <Box p={[-2.72, 0.395, -0.58]} s={[0.34, 0.018, 0.24]} c="#7a6a55" r={0.55} radius={0.006} />
      <Mug p={[-2.72, 0.452, -0.58]} />

      {/* 电视柜摆件 */}
      <Vase p={[-4.02, 0.5, -3.52]} c="#9aa39c" flowers="#8b9c74" />
      <Box p={[-2.1, 0.5, -3.5]} s={[0.14, 0.16, 0.11]} c="#6f6355" r={0.5} radius={0.012} />

      {/* 餐桌：花瓶 + 餐垫 */}
      <Box p={[-3.6, 0.756, 2.9]} s={[0.36, 0.007, 0.26]} c="#a8967f" r={0.95} radius={0.004} />
      <Box p={[-2.8, 0.756, 2.9]} s={[0.36, 0.007, 0.26]} c="#a8967f" r={0.95} radius={0.004} />
      <Vase p={[-3.2, 0.87, 2.9]} />

      {/* 沙发扶手搭毯 */}
      <Box
        p={[-1.5, 0.68, 1.02]}
        s={[0.3, 0.045, 0.86]}
        c="#a8836a"
        r={1}
        radius={0.02}
        rot={[0, 0, 0.04]}
      />

      {/* ---------- 主卧 ---------- */}
      <Art p={[3.42, 1.62, -2.1]} w={0.66} h={0.86} axis="x" frame="#5a4e40" art="art3" flip />
      <Books p={[0.52, 0.45, -3.4]} rot={-0.3} colors={['#6b7f8a', '#c9b7a0']} />
      <Mug p={[2.95, 0.49, -3.4]} c="#dcd3c6" />

      {/* ---------- 厨房 ---------- */}
      {/* 砧板 + 碗 */}
      <Box p={[4.35, 0.95, -3.66]} s={[0.42, 0.026, 0.28]} c="#a37f52" r={0.7} radius={0.012} rot={[0, 0.06, 0]} />
      <Bowl p={[5.25, 0.945, -3.62]} r={1} />
      <Bowl p={[4.62, 0.945, -0.62]} r={0.85} c="#cdd4cd" />
      {/* 台面调料罐 */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[5.02 + i * 0.1, 1.0, -3.85]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.14, 12]} />
          <meshStandardMaterial color={['#8e7b60', '#a8946f', '#6f6a58'][i]} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

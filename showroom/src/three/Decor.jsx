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
      {/* 西墙内表面在 x≈-8.92，窗洞占 z -3.2..1.8，画避开窗挂在两侧 */}
      <Art p={[-8.88, 1.6, 3.4]} w={0.78} h={1.02} axis="x" art="art1" />
      <Art p={[-8.88, 1.5, -4.4]} w={0.62} h={0.78} axis="x" frame="#6b5c4a" art="art2" />
      {/* 隔断墙内表面 x≈-1.08，画朝客厅一侧 */}
      <Art p={[-1.12, 1.55, -3.0]} w={0.7} h={0.9} axis="x" frame="#5a4e40" art="art3" flip />

      {/* 茶几：书 + 托盘 + 杯子 */}
      <Books p={[-5.74, 0.39, -0.62]} rot={0.22} />
      <Box p={[-5.12, 0.395, -0.58]} s={[0.34, 0.018, 0.24]} c="#7a6a55" r={0.55} radius={0.006} />
      <Mug p={[-5.12, 0.452, -0.58]} />

      {/* 电视柜摆件 */}
      <Vase p={[-6.42, 0.5, -5.0]} c="#9aa39c" flowers="#8b9c74" />
      <Box p={[-4.4, 0.5, -4.98]} s={[0.14, 0.16, 0.11]} c="#6f6355" r={0.5} radius={0.012} />

      {/* 餐桌：餐垫 + 花瓶 */}
      <Box p={[-5.02, 0.756, 3.3]} s={[0.36, 0.007, 0.26]} c="#a8967f" r={0.95} radius={0.004} />
      <Box p={[-4.18, 0.756, 3.3]} s={[0.36, 0.007, 0.26]} c="#a8967f" r={0.95} radius={0.004} />
      <Vase p={[-4.6, 0.87, 3.3]} />

      {/* ---------- 主卧 ---------- */}
      {/* 东侧隔断内表面 x≈3.92，画朝卧室一侧 */}
      <Art p={[3.88, 1.62, -3.6]} w={0.66} h={0.86} axis="x" frame="#5a4e40" art="art2" flip />
      <Books p={[0.15, 0.45, -4.7]} rot={-0.3} colors={['#6b7f8a', '#c9b7a0']} />
      <Mug p={[2.85, 0.49, -4.7]} c="#dcd3c6" />

      {/* ---------- 次卧 ---------- */}
      <Art p={[3.88, 1.55, 2.6]} w={0.58} h={0.74} axis="x" frame="#6b5c4a" art="art1" flip />
      <Books p={[3.5, 0.77, 4.5]} rot={0.15} colors={['#8a5f4a', '#7d8f6e']} />

      {/* ---------- 厨房 ---------- */}
      <Box p={[5.7, 0.95, -5.08]} s={[0.42, 0.026, 0.28]} c="#a37f52" r={0.7} radius={0.012} rot={[0, 0.06, 0]} />
      <Bowl p={[7.4, 0.945, -5.06]} r={1} />
      <Bowl p={[6.4, 0.945, -2.4]} r={0.85} c="#cdd4cd" />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[6.9 + i * 0.1, 1.0, -5.28]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.14, 12]} />
          <meshStandardMaterial color={['#8e7b60', '#a8946f', '#6f6a58'][i]} roughness={0.5} />
        </mesh>
      ))}

      {/* ---------- 卫生间 ---------- */}
      <Mug p={[5.95, 0.93, 5.1]} c="#dfe3e2" />
      <Box p={[7.1, 0.92, 5.08]} s={[0.16, 0.06, 0.12]} c="#cdd4cd" r={0.5} radius={0.01} />
    </group>
  )
}

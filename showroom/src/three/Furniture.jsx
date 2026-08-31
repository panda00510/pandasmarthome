import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useHA, isOn } from '../ha/store'
import { MAT, damp } from './utils'
import { getTextures, tiled } from './textures'
import SofaModel from './SofaModel'
import {
  pillowGeometry,
  cushionGeometry,
  slabGeometry,
  panelGeometry,
  curvePanel,
  legGeometry,
} from './shapes'

// 静态几何全部共享一份，避免每个实例各建一次
let CACHE = null
function geo() {
  if (CACHE) return CACHE
  CACHE = {
    sofaSeat: cushionGeometry(0.88, 0.22, 0.82, 0.26, 5),
    sofaBack: pillowGeometry(1.32, 0.62, 0.2, 4),
    sofaArm: pillowGeometry(0.26, 0.48, 0.95, 5.5),
    sofaBase: slabGeometry(2.86, 0.98, 0.16, 0.05),
    throwPillow: pillowGeometry(0.42, 0.42, 0.15, 3.2),
    blanketTop: pillowGeometry(0.3, 0.05, 0.6, 6),
    blanketFall: pillowGeometry(0.05, 0.36, 0.58, 6),

    chairSeat: slabGeometry(0.44, 0.44, 0.045, 0.05),
    chairBack: curvePanel(panelGeometry(0.42, 0.42, 0.032, 0.07), 0.055),
    chairLeg: legGeometry(0.019, 0.013, 0.44),

    tableTop: slabGeometry(1.42, 0.74, 0.05, 0.07),
    tableShelf: slabGeometry(1.2, 0.6, 0.032, 0.05),
    tableLeg: legGeometry(0.023, 0.016, 0.36),

    diningTop: slabGeometry(1.72, 0.96, 0.05, 0.06),
    diningLeg: legGeometry(0.035, 0.026, 0.7),

    bedBase: slabGeometry(1.92, 2.14, 0.18, 0.04),
    mattress: pillowGeometry(1.82, 0.26, 2.02, 6),
    headboard: pillowGeometry(1.96, 0.92, 0.14, 5),
    duvet: pillowGeometry(1.9, 0.12, 1.64, 8),
    pillow: pillowGeometry(0.62, 0.17, 0.38, 3.4),
  }
  return CACHE
}

// 通用长方体，带倒角
function B({ p, s, c = MAT.white, r = 0.8, m = 0, tex, soft = false, ...rest }) {
  const maps = useMemo(
    () => (tex ? tiled(getTextures()[tex], Math.max(1, s[0] / 0.5), Math.max(1, s[1] / 0.5)) : null),
    [tex, s[0], s[1]]
  )
  const radius = Math.min(soft ? 0.07 : 0.02, Math.min(s[0], s[1], s[2]) * 0.32)
  return (
    <RoundedBox args={s} radius={radius} smoothness={soft ? 3 : 2} position={p} castShadow receiveShadow {...rest}>
      <meshStandardMaterial color={c} roughness={r} metalness={m} normalScale={[0.7, 0.7]} {...(maps || {})} />
    </RoundedBox>
  )
}

// 共享几何 + 纹理的软包件
function Soft({ g, p, rot, tex = 'sofa', c, r = 0.97, repeat = 3 }) {
  const maps = useMemo(() => tiled(getTextures()[tex], repeat, repeat), [tex, repeat])
  return (
    <mesh geometry={g} position={p} rotation={rot} castShadow receiveShadow>
      <meshStandardMaterial color={c} roughness={r} metalness={0} normalScale={[0.9, 0.9]} {...maps} />
    </mesh>
  )
}

function Wood({ g, p, rot, c = MAT.woodLight, r = 0.55 }) {
  return (
    <mesh geometry={g} position={p} rotation={rot} castShadow receiveShadow>
      <meshStandardMaterial color={c} roughness={r} metalness={0} />
    </mesh>
  )
}

function Metal({ g, p, rot, c = MAT.metal }) {
  return (
    <mesh geometry={g} position={p} rotation={rot} castShadow receiveShadow>
      <meshStandardMaterial color={c} roughness={0.35} metalness={0.65} />
    </mesh>
  )
}

// 沙发有两套实现，切这个开关即可对比：
//   false = 程序化软包（当前默认，风格与整屋一致）
//   true  = Poly Haven「Sofa 03」CC0 实测模型（材质细节更强，但那是巴洛克古典风）
// 结论写在 README：CC0 免费库里几乎没有现代简约沙发，这类风格用程序化反而更搭。
const USE_MODEL_SOFA = false

function Sofa() {
  const g = geo()

  if (USE_MODEL_SOFA) {
    return (
      <group position={[-3, 0, 1.0]}>
        <SofaModel rotation={[0, Math.PI, 0]} />
      </group>
    )
  }

  return (
    <group position={[-3, 0, 1.0]}>
      <Wood g={g.sofaBase} p={[0, 0.24, 0]} c="#6f5540" r={0.65} />
      {[0, 1, 2, 3].map((i) => {
        const x = i < 2 ? -1.28 : 1.28
        const z = i % 2 === 0 ? -0.38 : 0.38
        return <Metal key={i} g={g.tableLeg} p={[x, 0.08, z]} c="#3e3830" />
      })}

      {[-0.92, 0, 0.92].map((x) => (
        <Soft key={x} g={g.sofaSeat} p={[x, 0.43, -0.03]} />
      ))}
      {[-0.66, 0.66].map((x) => (
        <Soft key={x} g={g.sofaBack} p={[x, 0.7, 0.39]} rot={[-0.13, 0, 0]} c="#8f99a5" />
      ))}
      {[-1.31, 1.31].map((x) => (
        <Soft key={x} g={g.sofaArm} p={[x, 0.48, 0]} />
      ))}

      <Soft g={g.throwPillow} p={[-0.94, 0.63, 0.19]} rot={[0.3, 0.22, 0.14]} tex="linen" c="#e0c9ac" repeat={2} />
      <Soft g={g.throwPillow} p={[0.96, 0.63, 0.19]} rot={[0.28, -0.2, -0.12]} tex="linen" c="#b9c4b4" repeat={2} />
      <Soft g={g.blanketTop} p={[1.31, 0.737, -0.06]} tex="linen" c="#a8836a" repeat={2} r={1} />
      <Soft g={g.blanketFall} p={[1.45, 0.56, -0.06]} rot={[0, 0, 0.06]} tex="linen" c="#a8836a" repeat={2} r={1} />
    </group>
  )
}

function Chair({ p, ry = 0 }) {
  const g = geo()
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Wood g={g.chairSeat} p={[0, 0.44, 0]} />
      <Wood g={g.chairBack} p={[0, 0.69, -0.2]} rot={[0.11, 0, 0]} />
      {[[-0.17, -0.17, -0.05, -0.05], [0.17, -0.17, 0.05, -0.05], [-0.17, 0.17, -0.05, 0.05], [0.17, 0.17, 0.05, 0.05]].map(
        ([x, z, rz, rx], i) => (
          <Wood key={i} g={g.chairLeg} p={[x, 0.22, z]} rot={[rx, 0, rz]} c={MAT.woodDark} r={0.6} />
        )
      )}
    </group>
  )
}

// 电视：开机时屏幕自发光并缓动
function Television() {
  const tv = useHA((s) => s.entities['media_player.living_tv'])
  const screen = useRef()
  const level = useRef(0)
  useFrame((state, dt) => {
    level.current = damp(level.current, isOn(tv) ? 1 : 0, 6, dt)
    if (screen.current) {
      const t = state.clock.elapsedTime
      const scene = 0.9 + Math.sin(t * 0.55) * 0.06
      screen.current.emissiveIntensity = level.current * scene * 0.6
      screen.current.emissive.setRGB(
        0.24 + Math.sin(t * 0.28) * 0.07,
        0.5 + Math.sin(t * 0.22) * 0.06,
        1.0
      )
    }
  })
  return (
    <group>
      <B p={[-5.4, 1.52, -5.3]} s={[2.02, 1.17, 0.07]} c="#15181c" r={0.4} />
      <mesh position={[-5.4, 1.52, -5.24]}>
        <planeGeometry args={[1.94, 1.09]} />
        <meshStandardMaterial ref={screen} color="#0d1014" emissive="#7fb8ff" emissiveIntensity={0} roughness={0.25} />
      </mesh>
    </group>
  )
}

export default function Furniture() {
  const g = geo()
  return (
    <group>
      {/* ---------------- 客厅 + 餐厅 ---------------- */}
      <B p={[-5.4, 0.22, -5.02]} s={[2.8, 0.44, 0.44]} c={MAT.woodDark} r={0.6} />
      <Television />
      <Sofa />

      {/* 茶几 */}
      <Wood g={g.tableTop} p={[-5.4, 0.38, -0.6]} />
      <Wood g={g.tableShelf} p={[-5.4, 0.14, -0.6]} c={MAT.woodDark} r={0.65} />
      {[[-5.98, -0.88], [-4.82, -0.88], [-5.98, -0.32], [-4.82, -0.32]].map(([x, z], i) => (
        <Metal key={i} g={g.tableLeg} p={[x, 0.18, z]} />
      ))}

      {/* 餐区 */}
      <Wood g={g.diningTop} p={[-4.6, 0.72, 3.3]} />
      {[[-5.32, 2.98], [-3.88, 2.98], [-5.32, 3.62], [-3.88, 3.62]].map(([x, z], i) => (
        <Wood key={i} g={g.diningLeg} p={[x, 0.35, z]} c={MAT.woodDark} r={0.6} />
      ))}
      <Chair p={[-5.15, 0, 2.68]} />
      <Chair p={[-4.05, 0, 2.68]} />
      <Chair p={[-5.15, 0, 3.92]} ry={Math.PI} />
      <Chair p={[-4.05, 0, 3.92]} ry={Math.PI} />

      {/* 边柜 + 绿植 */}
      <B p={[-8.6, 0.35, -2.6]} s={[0.42, 0.7, 1.8]} c={MAT.woodDark} r={0.6} />
      <mesh position={[-1.9, 0.22, 4.6]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.19, 0.44, 20]} />
        <meshStandardMaterial color="#b9b0a3" roughness={0.9} />
      </mesh>
      <mesh position={[-1.9, 0.78, 4.6]} castShadow>
        <sphereGeometry args={[0.42, 16, 14]} />
        <meshStandardMaterial color={MAT.green} roughness={1} />
      </mesh>

      {/* ---------------- 主卧 ---------------- */}
      <Wood g={g.bedBase} p={[1.5, 0.25, -3.3]} c="#6b4f35" r={0.7} />
      <Soft g={g.mattress} p={[1.5, 0.47, -3.3]} tex="linen" c="#efe9df" repeat={4} />
      <Soft g={g.headboard} p={[1.5, 0.8, -4.36]} tex="sofa" c="#d6c4ad" repeat={3} />
      <Soft g={g.duvet} p={[1.5, 0.64, -3.02]} tex="sofa" c="#c6d0da" repeat={3} />
      <Soft g={g.pillow} p={[1.09, 0.69, -4.04]} rot={[0, 0.06, 0]} tex="linen" c="#f4f1ea" repeat={2} />
      <Soft g={g.pillow} p={[1.91, 0.69, -4.04]} rot={[0, -0.06, 0]} tex="linen" c="#f4f1ea" repeat={2} />
      <B p={[0.15, 0.22, -4.7]} s={[0.45, 0.44, 0.4]} c={MAT.woodDark} r={0.6} />
      <B p={[2.85, 0.22, -4.7]} s={[0.45, 0.44, 0.4]} c={MAT.woodDark} r={0.6} />
      <B p={[3.55, 1.15, -1.6]} s={[0.62, 2.3, 2.1]} c="#cfc6b8" r={0.75} />

      {/* ---------------- 次卧 ---------------- */}
      <Wood g={g.bedBase} p={[1.4, 0.25, 3.6]} c="#6b4f35" r={0.7} scale={[0.72, 1, 0.92]} />
      <Soft g={g.mattress} p={[1.4, 0.45, 3.6]} tex="linen" c="#efe9df" repeat={3} scale={[0.72, 0.9, 0.92]} />
      <Soft g={g.headboard} p={[1.4, 0.74, 4.62]} tex="sofa" c="#c9bda9" repeat={3} scale={[0.72, 0.86, 1]} />
      <Soft g={g.duvet} p={[1.4, 0.6, 3.35]} tex="sofa" c="#b7c2ac" repeat={3} scale={[0.72, 1, 0.9]} />
      <Soft g={g.pillow} p={[1.4, 0.64, 4.34]} tex="linen" c="#f4f1ea" repeat={2} scale={[0.9, 1, 0.9]} />
      {/* 书桌 */}
      <Wood g={g.tableTop} p={[3.5, 0.74, 4.8]} rot={[0, Math.PI / 2, 0]} />
      {[[3.22, 4.28], [3.78, 4.28], [3.22, 5.32], [3.78, 5.32]].map(([x, z], i) => (
        <Metal key={i} g={g.diningLeg} p={[x, 0.36, z]} />
      ))}
      <Chair p={[2.85, 0, 4.8]} ry={Math.PI / 2} />

      {/* ---------------- 厨房 ---------------- */}
      <B p={[6.5, 0.44, -5.12]} s={[3.6, 0.88, 0.62]} c="#e2ded6" r={0.6} />
      <B p={[6.5, 0.91, -5.12]} s={[3.66, 0.06, 0.68]} c="#3f4348" r={0.35} m={0.2} />
      <B p={[6.5, 1.95, -5.28]} s={[3.4, 0.7, 0.36]} c="#e2ded6" r={0.6} />
      <B p={[8.4, 0.9, -3.8]} s={[0.75, 1.85, 0.7]} c="#b9bec4" r={0.35} m={0.55} />
      <B p={[6.4, 0.44, -2.4]} s={[1.7, 0.88, 0.85]} c={MAT.woodDark} r={0.6} />
      <B p={[6.4, 0.91, -2.4]} s={[1.8, 0.06, 0.95]} c="#3f4348" r={0.35} m={0.2} />
      <mesh position={[6.0, 1.02, -2.4]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.26, 12]} />
        <meshStandardMaterial color="#c8ced4" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* ---------------- 卫生间 ---------------- */}
      <B p={[6.5, 0.42, 5.12]} s={[1.8, 0.85, 0.55]} c="#e4e0d9" r={0.5} />
      <B p={[6.5, 0.87, 5.12]} s={[1.86, 0.05, 0.6]} c="#cfd4d6" r={0.25} m={0.15} />
      {/* 镜子 */}
      <mesh position={[6.5, 1.62, 5.44]}>
        <planeGeometry args={[1.5, 0.9]} />
        <meshStandardMaterial color="#aebcc4" roughness={0.06} metalness={0.85} />
      </mesh>
      {/* 淋浴房玻璃 */}
      <mesh position={[7.55, 1.05, 2.6]}>
        <boxGeometry args={[0.04, 2.1, 1.6]} />
        <meshStandardMaterial color="#b8ccd4" roughness={0.05} metalness={0.1} transparent opacity={0.22} />
      </mesh>
      <mesh position={[8.25, 1.05, 1.82]}>
        <boxGeometry args={[1.4, 2.1, 0.04]} />
        <meshStandardMaterial color="#b8ccd4" roughness={0.05} metalness={0.1} transparent opacity={0.22} />
      </mesh>
      <B p={[8.25, 0.03, 2.6]} s={[1.4, 0.06, 1.6]} c="#dcd8d2" r={0.4} />
      {/* 马桶 */}
      <B p={[4.6, 0.2, 4.9]} s={[0.4, 0.4, 0.62]} c="#f2efe9" r={0.3} />
      <B p={[4.6, 0.52, 5.16]} s={[0.4, 0.36, 0.2]} c="#f2efe9" r={0.3} />
    </group>
  )
}

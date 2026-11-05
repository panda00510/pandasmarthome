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

function Sofa({ position, rotation = [0, 0, 0], scale = 1 }) {
  const g = geo()

  if (USE_MODEL_SOFA) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <SofaModel rotation={[0, Math.PI, 0]} />
      </group>
    )
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
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

function Bed({ position, rotation = [0, 0, 0], scale = 1 }) {
  const g = geo()
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Wood g={g.bedBase} p={[0, 0.25, 0]} c="#6b4f35" r={0.7} />
      <Soft g={g.mattress} p={[0, 0.47, 0]} tex="linen" c="#efe9df" repeat={4} />
      <Soft g={g.headboard} p={[0, 0.8, -1.06]} tex="sofa" c="#d6c4ad" repeat={3} />
      <Soft g={g.duvet} p={[0, 0.64, 0.28]} tex="sofa" c="#c6d0da" repeat={3} />
      <Soft g={g.pillow} p={[-0.41, 0.69, -0.74]} rot={[0, 0.06, 0]} tex="linen" c="#f4f1ea" repeat={2} />
      <Soft g={g.pillow} p={[0.41, 0.69, -0.74]} rot={[0, -0.06, 0]} tex="linen" c="#f4f1ea" repeat={2} />
    </group>
  )
}

// 电视：开机时屏幕自发光并缓动。本地 +Z 为屏幕朝向。
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
      <B p={[0, 1.12, 0.02]} s={[1.55, 0.9, 0.06]} c="#15181c" r={0.4} />
      <mesh position={[0, 1.12, 0.06]}>
        <planeGeometry args={[1.46, 0.82]} />
        <meshStandardMaterial ref={screen} color="#0d1014" emissive="#7fb8ff" emissiveIntensity={0} roughness={0.25} />
      </mesh>
    </group>
  )
}

function GlassBox({ position, args }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#b8ccd4" roughness={0.05} metalness={0.1} transparent opacity={0.22} />
    </mesh>
  )
}

export default function Furniture() {
  const g = geo()
  return (
    <group>
      {/* ---------------- 客餐厅：电视靠西墙，沙发朝西 ---------------- */}
      <group position={[-5.02, 0, -2.35]} rotation={[0, Math.PI / 2, 0]}>
        <B p={[0, 0.2, -0.02]} s={[1.7, 0.4, 0.38]} c={MAT.woodDark} r={0.6} />
        <Television />
      </group>
      <Sofa position={[-3.45, 0, -2.4]} rotation={[0, Math.PI / 2, 0]} scale={0.78} />

      <group position={[-4.32, 0, -2.4]} rotation={[0, Math.PI / 2, 0]}>
        <Wood g={g.tableTop} p={[0, 0.36, 0]} />
        <Wood g={g.tableShelf} p={[0, 0.14, 0]} c={MAT.woodDark} r={0.65} />
        {[[-0.55, -0.28], [0.55, -0.28], [-0.55, 0.28], [0.55, 0.28]].map(([x, z], i) => (
          <Metal key={i} g={g.tableLeg} p={[x, 0.18, z]} />
        ))}
      </group>

      <Wood g={g.diningTop} p={[-3.95, 0.72, 0.35]} />
      {[[-4.65, 0.02], [-3.25, 0.02], [-4.65, 0.68], [-3.25, 0.68]].map(([x, z], i) => (
        <Wood key={i} g={g.diningLeg} p={[x, 0.35, z]} c={MAT.woodDark} r={0.6} />
      ))}
      <Chair p={[-4.45, 0, -0.28]} />
      <Chair p={[-3.45, 0, -0.28]} />
      <Chair p={[-4.45, 0, 0.98]} ry={Math.PI} />
      <Chair p={[-3.45, 0, 0.98]} ry={Math.PI} />

      <mesh position={[-1.55, 0.18, 1.7]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.36, 16]} />
        <meshStandardMaterial color="#b9b0a3" roughness={0.9} />
      </mesh>
      <mesh position={[-1.55, 0.62, 1.7]} castShadow>
        <sphereGeometry args={[0.32, 14, 12]} />
        <meshStandardMaterial color={MAT.green} roughness={1} />
      </mesh>

      {/* ---------------- 主卧：床头靠西墙 ---------------- */}
      <Bed position={[3.15, 0, -2.9]} rotation={[0, Math.PI / 2, 0]} scale={0.9} />
      <B p={[2.28, 0.2, -3.62]} s={[0.4, 0.4, 0.36]} c={MAT.woodDark} r={0.6} />
      <B p={[4.82, 1.05, -3.2]} s={[0.48, 2.05, 1.25]} c="#cfc6b8" r={0.75} />

      {/* ---------------- 朝北的次卧 ---------------- */}
      <Bed position={[0.35, 0, -3.25]} scale={0.7} />
      <B p={[1.35, 0.2, -2.35]} s={[0.38, 0.4, 0.36]} c={MAT.woodDark} r={0.6} />

      {/* ---------------- 朝走廊的卧室 ---------------- */}
      <Bed position={[0.15, 0, 3.22]} scale={0.76} />
      <mesh position={[0.5, 2.46, 3.3]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 20]} />
        <meshStandardMaterial color="#f3f0ea" roughness={0.6} />
      </mesh>

      {/* ---------------- 厨房 ---------------- */}
      <B p={[-4.88, 0.44, 3.15]} s={[0.55, 0.86, 2.15]} c="#e2ded6" r={0.6} />
      <B p={[-4.88, 0.9, 3.15]} s={[0.6, 0.05, 2.2]} c="#3f4348" r={0.35} m={0.2} />
      <B p={[-4.88, 1.7, 3.15]} s={[0.32, 0.55, 2.0]} c="#e2ded6" r={0.6} />
      <B p={[-4.15, 0.44, 4.18]} s={[1.5, 0.86, 0.5]} c="#e2ded6" r={0.6} />
      <B p={[-4.15, 0.9, 4.18]} s={[1.55, 0.05, 0.55]} c="#3f4348" r={0.35} m={0.2} />
      <B p={[-4.9, 0.85, 1.72]} s={[0.62, 1.7, 0.62]} c="#b9bec4" r={0.35} m={0.55} />

      {/* ---------------- 服务阳台：洗衣机 + 晾杆 ---------------- */}
      <B p={[-2.2, 0.42, 2.78]} s={[0.58, 0.84, 0.58]} c="#d5dbe0" r={0.4} m={0.25} />
      <B p={[-2.2, 0.88, 2.78]} s={[0.6, 0.06, 0.6]} c="#8e98a0" r={0.35} m={0.4} />
      {[-1.55, -1.9].map((x) => (
        <mesh key={x} position={[x, 0.85, 4.12]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
          <meshStandardMaterial color="#8d8378" roughness={0.45} metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[-1.72, 1.5, 4.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#8d8378" roughness={0.45} metalness={0.4} />
      </mesh>

      {/* ---------------- 公共卫生间 ---------------- */}
      <B p={[-0.08, 0.4, 1.95]} s={[1.15, 0.78, 0.42]} c="#e4e0d9" r={0.5} />
      <B p={[-0.08, 0.82, 1.95]} s={[1.2, 0.04, 0.46]} c="#cfd4d6" r={0.25} m={0.15} />
      <mesh position={[-0.08, 1.42, 2.12]}>
        <planeGeometry args={[0.95, 0.62]} />
        <meshStandardMaterial color="#aebcc4" roughness={0.06} metalness={0.85} />
      </mesh>
      <B p={[-0.62, 0.18, 0.85]} s={[0.36, 0.36, 0.52]} c="#f2efe9" r={0.3} />
      <B p={[-0.62, 0.42, 1.05]} s={[0.36, 0.28, 0.16]} c="#f2efe9" r={0.3} />
      <GlassBox position={[-0.72, 1.0, 1.45]} args={[0.04, 1.7, 0.7]} />

      {/* ---------------- 主卫 ---------------- */}
      <B p={[4.85, 0.4, -0.2]} s={[0.42, 0.78, 0.8]} c="#e4e0d9" r={0.5} />
      <B p={[4.85, 0.82, -0.2]} s={[0.46, 0.04, 0.86]} c="#cfd4d6" r={0.25} m={0.15} />
      <mesh position={[5.08, 1.35, -0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.62, 0.5]} />
        <meshStandardMaterial color="#aebcc4" roughness={0.06} metalness={0.85} />
      </mesh>
      <B p={[3.78, 0.18, 0.45]} s={[0.36, 0.36, 0.48]} c="#f2efe9" r={0.3} />
      <GlassBox position={[3.62, 1.0, 0.15]} args={[0.04, 1.5, 0.7]} />

      {/* ---------------- 玄关鞋柜 / 避难所储物 ---------------- */}
      <B p={[2.22, 0.45, 2.6]} s={[0.32, 0.9, 1.15]} c={MAT.woodDark} r={0.65} />
      <B p={[4.7, 0.7, 3.15]} s={[0.7, 1.3, 0.35]} c="#c8c2b6" r={0.7} />
      <B p={[4.55, 0.28, 3.7]} s={[0.4, 0.32, 0.4]} c="#8a7b68" r={0.8} />
      <B p={[4.15, 0.22, 4.05]} s={[0.45, 0.28, 0.35]} c="#6f6358" r={0.85} />
    </group>
  )
}

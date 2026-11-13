import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useHA, isOn, usePlan } from '../ha/store'
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

// ---------------- 按户型数据摆放的家具 ----------------
// 每件家具都在自己的本地坐标里建模：正面朝 +z，长度沿 x。
// 户型 JSON 里给 pos（地面中心）、rot（角度）、len / scale 等参数。

const QUARTZ = '#3f4348'
const CABINET = '#e2ded6'

function TvUnit() {
  return (
    <group>
      <B p={[0, 0.2, -0.02]} s={[1.7, 0.4, 0.38]} c={MAT.woodDark} r={0.6} />
      <Television />
    </group>
  )
}

function CoffeeTable() {
  const g = geo()
  return (
    <group>
      <Wood g={g.tableTop} p={[0, 0.36, 0]} />
      <Wood g={g.tableShelf} p={[0, 0.14, 0]} c={MAT.woodDark} r={0.65} />
      {[[-0.55, -0.28], [0.55, -0.28], [-0.55, 0.28], [0.55, 0.28]].map(([x, z], i) => (
        <Metal key={i} g={g.tableLeg} p={[x, 0.18, z]} />
      ))}
    </group>
  )
}

// 四人餐桌，长边沿 x
function DiningSet() {
  const g = geo()
  return (
    <group>
      <Wood g={g.diningTop} p={[0, 0.72, 0]} />
      {[[-0.7, -0.33], [0.7, -0.33], [-0.7, 0.33], [0.7, 0.33]].map(([x, z], i) => (
        <Wood key={i} g={g.diningLeg} p={[x, 0.35, z]} c={MAT.woodDark} r={0.6} />
      ))}
      <Chair p={[-0.5, 0, -0.63]} />
      <Chair p={[0.5, 0, -0.63]} />
      <Chair p={[-0.5, 0, 0.63]} ry={Math.PI} />
      <Chair p={[0.5, 0, 0.63]} ry={Math.PI} />
    </group>
  )
}

function Nightstand() {
  return <B p={[0, 0.2, 0]} s={[0.4, 0.4, 0.36]} c={MAT.woodDark} r={0.6} />
}

// 到顶衣柜：柜体 + 门缝 + 拉手条
function Wardrobe({ len = 1.6 }) {
  const doors = Math.max(2, Math.round(len / 0.5))
  return (
    <group>
      <B p={[0, 1.07, 0]} s={[len, 2.14, 0.58]} c="#d6cdbf" r={0.7} />
      {Array.from({ length: doors - 1 }, (_, i) => -len / 2 + (len * (i + 1)) / doors).map((x) => (
        <mesh key={x} position={[x, 1.07, 0.292]}>
          <boxGeometry args={[0.006, 2.04, 0.004]} />
          <meshStandardMaterial color="#9c9286" roughness={0.8} />
        </mesh>
      ))}
      <B p={[0, 1.05, 0.3]} s={[len - 0.08, 0.02, 0.02]} c="#8d8378" r={0.35} m={0.7} />
    </group>
  )
}

function Desk({ len = 1.1 }) {
  return (
    <group>
      <B p={[0, 0.735, 0]} s={[len, 0.03, 0.55]} c={MAT.woodLight} r={0.55} />
      {[-1, 1].map((sx) => (
        <B key={sx} p={[sx * (len / 2 - 0.03), 0.36, 0]} s={[0.03, 0.72, 0.5]} c={MAT.metal} r={0.4} m={0.5} />
      ))}
    </group>
  )
}

// 厨柜：地柜 + 石英石台面，可带水槽或电磁炉
function Counter({ len = 2, sink, hob }) {
  return (
    <group>
      <B p={[0, 0.06, 0.02]} s={[len, 0.12, 0.5]} c="#b9b2a7" r={0.8} />
      <B p={[0, 0.5, 0]} s={[len, 0.76, 0.56]} c={CABINET} r={0.6} />
      <B p={[0, 0.905, 0]} s={[len + 0.02, 0.04, 0.6]} c={QUARTZ} r={0.3} m={0.15} />
      {sink != null && (
        <group position={[sink, 0.928, 0.02]}>
          <mesh>
            <boxGeometry args={[0.62, 0.006, 0.4]} />
            <meshStandardMaterial color="#9ea4a8" roughness={0.25} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.16, -0.22]}>
            <cylinderGeometry args={[0.014, 0.014, 0.32, 10]} />
            <meshStandardMaterial color="#c4c8cb" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      )}
      {hob != null && (
        <mesh position={[hob, 0.927, 0.02]}>
          <boxGeometry args={[0.6, 0.006, 0.5]} />
          <meshStandardMaterial color="#121416" roughness={0.12} metalness={0.3} />
        </mesh>
      )}
    </group>
  )
}

// 吊柜：pos.y 是柜底高度
function Upper({ len = 1.5 }) {
  return <B p={[0, 0.35, 0]} s={[len, 0.7, 0.35]} c={CABINET} r={0.6} />
}

function Fridge() {
  return (
    <group>
      <B p={[0, 0.88, 0]} s={[0.65, 1.76, 0.65]} c="#b9bec4" r={0.3} m={0.6} />
      <mesh position={[0, 1.18, 0.328]}>
        <boxGeometry args={[0.6, 0.006, 0.004]} />
        <meshStandardMaterial color="#6e7378" />
      </mesh>
      <B p={[0.26, 1.0, 0.345]} s={[0.025, 0.5, 0.025]} c="#8a8f94" r={0.3} m={0.8} />
    </group>
  )
}

// 前开式洗衣机
function Washer() {
  return (
    <group>
      <B p={[0, 0.42, 0]} s={[0.6, 0.84, 0.58]} c="#e9ecee" r={0.4} m={0.1} />
      <mesh position={[0, 0.4, 0.292]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.03, 10, 28]} />
        <meshStandardMaterial color="#9aa2a8" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.4, 0.29]}>
        <circleGeometry args={[0.15, 28]} />
        <meshStandardMaterial color="#2c3a44" roughness={0.1} metalness={0.2} />
      </mesh>
    </group>
  )
}

// 吊顶晾衣架：两根杆沿本地 z
function Rack({ len = 1.6 }) {
  return (
    <group>
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, len, 8]} />
          <meshStandardMaterial color="#c4c8cb" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      {[-len / 2 + 0.1, len / 2 - 0.1].map((z) => (
        <mesh key={z} position={[0, 0.15, z]} castShadow>
          <boxGeometry args={[0.34, 0.3, 0.02]} />
          <meshStandardMaterial color="#c4c8cb" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      <mesh position={[0.15, -0.28, 0.2]} castShadow>
        <boxGeometry args={[0.02, 0.55, 0.5]} />
        <meshStandardMaterial color="#d9cfc2" roughness={1} side={DoubleSide} />
      </mesh>
    </group>
  )
}

// 悬挂浴室柜 + 台盆 + 镜子（镜子贴背墙，本地 -z）
function Vanity({ len = 0.8 }) {
  return (
    <group>
      <B p={[0, 0.62, 0]} s={[len, 0.42, 0.46]} c="#7a6553" r={0.6} />
      <B p={[0, 0.85, 0]} s={[len + 0.02, 0.04, 0.48]} c="#efedea" r={0.25} />
      <mesh position={[0, 0.875, 0.03]}>
        <cylinderGeometry args={[0.17, 0.15, 0.01, 24]} />
        <meshStandardMaterial color="#f7f6f3" roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.45, -0.225]}>
        <planeGeometry args={[len * 0.92, 0.72]} />
        <meshStandardMaterial color="#aebcc4" roughness={0.05} metalness={0.9} />
      </mesh>
    </group>
  )
}

// 坐便器：水箱靠背墙（本地 -z）
function Toilet() {
  return (
    <group>
      <B p={[0, 0.2, 0.02]} s={[0.36, 0.4, 0.5]} c="#f2efe9" r={0.3} />
      <B p={[0, 0.5, -0.2]} s={[0.38, 0.32, 0.16]} c="#f2efe9" r={0.3} />
    </group>
  )
}

// 悬浮鞋柜：离地 15cm，下面放拖鞋
function ShoeCabinet({ len = 1.2 }) {
  return (
    <group>
      <B p={[0, 0.65, 0]} s={[len, 1.0, 0.35]} c={MAT.woodDark} r={0.6} />
      <B p={[0, 1.165, 0]} s={[len + 0.02, 0.03, 0.37]} c="#d9d2c6" r={0.4} />
      <B p={[-len / 4, 0.03, 0.05]} s={[0.26, 0.04, 0.1]} c="#8d7d6d" r={0.9} />
    </group>
  )
}

function Plant({ scale = 1 }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.36, 16]} />
        <meshStandardMaterial color="#b9b0a3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <sphereGeometry args={[0.32, 14, 12]} />
        <meshStandardMaterial color={MAT.green} roughness={1} />
      </mesh>
    </group>
  )
}

// 阳台长条花槽
function Planter({ len = 2 }) {
  return (
    <group>
      <B p={[0, 0.2, 0]} s={[len, 0.4, 0.3]} c="#8f8a82" r={0.85} />
      {Array.from({ length: Math.round(len / 0.4) }, (_, i) => -len / 2 + 0.2 + i * 0.4).map((x, i) => (
        <mesh key={x} position={[x, 0.48 + (i % 2) * 0.05, 0]} castShadow>
          <sphereGeometry args={[0.17, 10, 8]} />
          <meshStandardMaterial color={i % 2 ? '#5d7f52' : MAT.green} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

// 吸顶装饰灯盘（不接实体）
function Disc() {
  return (
    <mesh position={[0, -0.1, 0]}>
      <cylinderGeometry args={[0.18, 0.18, 0.03, 20]} />
      <meshStandardMaterial color="#f3f0ea" roughness={0.6} />
    </mesh>
  )
}

const PIECES = {
  tv: TvUnit,
  sofa: ({ scale }) => <Sofa position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={scale} />,
  coffee: CoffeeTable,
  dining: DiningSet,
  chair: () => <Chair p={[0, 0, 0]} />,
  bed: ({ scale }) => <Bed position={[0, 0, 0]} scale={scale} />,
  nightstand: Nightstand,
  wardrobe: Wardrobe,
  desk: Desk,
  counter: Counter,
  upper: Upper,
  fridge: Fridge,
  washer: Washer,
  rack: Rack,
  vanity: Vanity,
  toilet: Toilet,
  shoe: ShoeCabinet,
  plant: Plant,
  planter: Planter,
  disc: Disc,
}

export default function Furniture() {
  const { furniture } = usePlan()
  return (
    <group>
      {furniture.map((f, i) => {
        if (f.type === 'glass') return <GlassBox key={i} position={f.pos} args={f.size} />
        if (f.type === 'box') return <B key={i} p={f.pos} s={f.size} c={f.color} r={0.75} />
        const Piece = PIECES[f.type]
        if (!Piece) return null
        // 缩放类家具（床、沙发）自己处理 scale，其余整组缩放
        const own = f.type === 'bed' || f.type === 'sofa' || f.type === 'plant'
        return (
          <group key={i} position={f.pos} rotation={[0, ((f.rot ?? 0) * Math.PI) / 180, 0]} scale={own ? 1 : f.scale ?? 1}>
            <Piece {...f} scale={f.scale ?? 1} />
          </group>
        )
      })}
    </group>
  )
}

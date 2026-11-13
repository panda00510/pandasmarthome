import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { PANDA_PATH } from '../ui/PandaLogo'
import { useHA, isOn, usePlan } from '../ha/store'
import { MAT, damp } from './utils'
import { getMat, metersUV } from './materials'
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
  // 软包件基于 BoxGeometry，UV 是每面 0..1；改成按米，布纹密度才与尺寸无关
  for (const k of ['sofaSeat', 'sofaBack', 'sofaArm', 'throwPillow', 'blanketTop', 'blanketFall', 'mattress', 'headboard', 'duvet', 'pillow']) metersUV(CACHE[k])
  return CACHE
}

// 通用长方体，带倒角。mat 选 materials.js 里的材质，c / r / m 覆盖颜色、粗糙度、金属度。
// RoundedBox 是 ExtrudeGeometry，UV 天生按米，木皮 / 石英石纹理密度不随尺寸变。
function B({ p, s, c, r, m, mat = 'lacquer', soft = false, ...rest }) {
  const o = {}
  if (c != null) o.color = c
  if (r != null) o.roughness = r
  if (m != null) o.metalness = m
  const radius = Math.min(soft ? 0.07 : 0.02, Math.min(s[0], s[1], s[2]) * 0.32)
  return (
    <RoundedBox args={s} radius={radius} smoothness={soft ? 3 : 2} position={p} castShadow receiveShadow
      material={getMat(mat, Object.keys(o).length ? o : undefined)} {...rest} />
  )
}

// 共享几何 + 织物材质（sheen）的软包件
function Soft({ g, p, rot, tex = 'fabric', c }) {
  return <mesh geometry={g} position={p} rotation={rot} castShadow receiveShadow material={getMat(tex, c ? { color: c } : undefined)} />
}

function Wood({ g, p, rot, c = MAT.woodLight }) {
  return <mesh geometry={g} position={p} rotation={rot} castShadow receiveShadow material={getMat('veneer', { color: c })} />
}

function Metal({ g, p, rot, c = MAT.metal }) {
  return <mesh geometry={g} position={p} rotation={rot} castShadow receiveShadow material={getMat('blackMetal', { color: c, roughness: 0.35 })} />
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
      <Wood g={g.sofaBase} p={[0, 0.24, 0]} c="#6f5540" />
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

      <Soft g={g.throwPillow} p={[-0.94, 0.63, 0.19]} rot={[0.3, 0.22, 0.14]} tex="linen" c="#e0c9ac" />
      <Soft g={g.throwPillow} p={[0.96, 0.63, 0.19]} rot={[0.28, -0.2, -0.12]} tex="linen" c="#b9c4b4" />
      <Soft g={g.blanketTop} p={[1.31, 0.737, -0.06]} tex="linen" c="#a8836a" />
      <Soft g={g.blanketFall} p={[1.45, 0.56, -0.06]} rot={[0, 0, 0.06]} tex="linen" c="#a8836a" />
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
          <Wood key={i} g={g.chairLeg} p={[x, 0.22, z]} rot={[rx, 0, rz]} c={MAT.woodDark} />
        )
      )}
    </group>
  )
}

function Bed({ position, rotation = [0, 0, 0], scale = 1 }) {
  const g = geo()
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Wood g={g.bedBase} p={[0, 0.25, 0]} c="#8a6a4c" />
      <Soft g={g.mattress} p={[0, 0.47, 0]} tex="linen" c="#efe9df" />
      <Soft g={g.headboard} p={[0, 0.8, -1.06]} tex="fabric" c="#d6c4ad" />
      <Soft g={g.duvet} p={[0, 0.64, 0.28]} tex="fabric" c="#c6d0da" />
      <Soft g={g.pillow} p={[-0.41, 0.69, -0.74]} rot={[0, 0.06, 0]} tex="linen" c="#f4f1ea" />
      <Soft g={g.pillow} p={[0.41, 0.69, -0.74]} rot={[0, -0.06, 0]} tex="linen" c="#f4f1ea" />
    </group>
  )
}

// 电视开机画面：深色品牌画面 + 居中熊猫标识 + smartpanda 字样，画到 16:9 的 CanvasTexture 上，
// 作为 emissiveMap。亮度峰值压在 Bloom 阈值附近，不会糊成一团白。
let TV_TEX = null
function tvTexture() {
  if (TV_TEX) return TV_TEX
  const W = 1024
  const H = 576
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const bg = g.createRadialGradient(W / 2, H * 0.42, 20, W / 2, H / 2, W * 0.7)
  bg.addColorStop(0, '#16352a')
  bg.addColorStop(0.55, '#0b1a15')
  bg.addColorStop(1, '#05090a')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)
  // 熊猫标识：与页头同一条 path（viewBox 28 58 418 354），必须 evenodd 才有镂空
  const logoH = 190
  const k = logoH / 354
  g.save()
  g.translate(W / 2 - (418 * k) / 2 - 28 * k, H * 0.4 - logoH / 2 - 58 * k)
  g.scale(k, k)
  g.fillStyle = '#6fd3a4'
  g.fill(new Path2D(PANDA_PATH), 'evenodd')
  g.restore()
  g.textAlign = 'center'
  g.fillStyle = '#e9f3ee'
  g.font = '500 64px "DM Mono", ui-monospace, Menlo, monospace'
  g.fillText('smartpanda', W / 2, H * 0.4 + logoH / 2 + 78)
  g.fillStyle = 'rgba(200,225,214,0.6)'
  g.font = '28px "DM Mono", ui-monospace, Menlo, monospace'
  g.fillText('smartpanda.sg', W / 2, H * 0.4 + logoH / 2 + 124)
  TV_TEX = new CanvasTexture(c)
  TV_TEX.colorSpace = SRGBColorSpace
  TV_TEX.anisotropy = 4
  return TV_TEX
}

const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 电视：开机时屏幕显示品牌画面并淡入；关机是黑色镜面（清漆层反射环境），右下角一个待机红点。
// 本地 +Z 为屏幕朝向，平面 UV 标准方向，所以画面不镜像、不倒置（三个户型的电视朝向靠家具 rot 统一处理）。
function Television() {
  const screen = useRef()
  const standby = useRef()
  const level = useRef(0)
  const map = useMemo(() => tvTexture(), [])
  useFrame((state, dt) => {
    const tv = useHA.getState().entities['media_player.living_tv']
    const on = isOn(tv)
    level.current = damp(level.current, on ? 1 : 0, 3.2, dt)
    if (screen.current) {
      // 很慢的呼吸（±3%），尊重减少动态效果
      const breathe = REDUCED_MOTION ? 1 : 0.97 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03
      screen.current.emissiveIntensity = level.current * 0.95 * breathe
    }
    if (standby.current) standby.current.visible = !on
  })
  return (
    <group>
      <B p={[0, 1.12, 0.02]} s={[1.55, 0.9, 0.06]} mat="blackMetal" c="#15181c" r={0.4} m={0.3} />
      <mesh position={[0, 1.12, 0.0505]}>
        <planeGeometry args={[1.46, 0.82]} />
        <meshPhysicalMaterial ref={screen} color="#050608" emissive="#ffffff" emissiveMap={map} emissiveIntensity={0}
          roughness={0.06} clearcoat={1} clearcoatRoughness={0.03} toneMapped={false} />
      </mesh>
      {/* 待机红点：毫米级，不照亮环境、不进 Bloom */}
      <mesh ref={standby} position={[0.7, 0.69, 0.051]}>
        <circleGeometry args={[0.005, 12]} />
        <meshBasicMaterial color="#7a1c14" toneMapped={false} />
      </mesh>
    </group>
  )
}

function GlassBox({ position, args }) {
  return (
    <mesh position={position} material={getMat('showerGlass')}>
      <boxGeometry args={args} />
    </mesh>
  )
}

// ---------------- 按户型数据摆放的家具 ----------------
// 每件家具都在自己的本地坐标里建模：正面朝 +z，长度沿 x。
// 户型 JSON 里给 pos（地面中心）、rot（角度）、len / scale 等参数。

const CABINET = '#e2ded6'

function TvUnit() {
  return (
    <group>
      <B p={[0, 0.2, -0.02]} s={[1.7, 0.4, 0.38]} c={MAT.woodDark} />
      <Television />
    </group>
  )
}

function CoffeeTable() {
  const g = geo()
  return (
    <group>
      <Wood g={g.tableTop} p={[0, 0.36, 0]} />
      <Wood g={g.tableShelf} p={[0, 0.14, 0]} c={MAT.woodDark} />
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
        <Wood key={i} g={g.diningLeg} p={[x, 0.35, z]} c={MAT.woodDark} />
      ))}
      <Chair p={[-0.5, 0, -0.63]} />
      <Chair p={[0.5, 0, -0.63]} />
      <Chair p={[-0.5, 0, 0.63]} ry={Math.PI} />
      <Chair p={[0.5, 0, 0.63]} ry={Math.PI} />
    </group>
  )
}

function Nightstand() {
  return <B p={[0, 0.2, 0]} s={[0.4, 0.4, 0.36]} c={MAT.woodDark} />
}

// 到顶衣柜：柜体 + 门缝 + 拉手条
function Wardrobe({ len = 1.6 }) {
  const doors = Math.max(2, Math.round(len / 0.5))
  return (
    <group>
      <B p={[0, 1.07, 0]} s={[len, 2.14, 0.58]} mat="veneer" c="#e3d6c4" />
      {Array.from({ length: doors - 1 }, (_, i) => -len / 2 + (len * (i + 1)) / doors).map((x) => (
        <mesh key={x} position={[x, 1.07, 0.292]} material={getMat('lacquer', { color: '#8c8072', roughness: 0.8 })}>
          <boxGeometry args={[0.006, 2.04, 0.004]} />
        </mesh>
      ))}
      <B p={[0, 1.05, 0.3]} s={[len - 0.08, 0.02, 0.02]} mat="brass" />
    </group>
  )
}

function Desk({ len = 1.1 }) {
  return (
    <group>
      <B p={[0, 0.735, 0]} s={[len, 0.03, 0.55]} mat="veneer" c={MAT.woodLight} />
      {[-1, 1].map((sx) => (
        <B key={sx} p={[sx * (len / 2 - 0.03), 0.36, 0]} s={[0.03, 0.72, 0.5]} mat="blackMetal" c={MAT.metal} r={0.4} />
      ))}
    </group>
  )
}

// 厨柜：地柜 + 石英石台面，可带水槽或电磁炉
function Counter({ len = 2, sink, hob }) {
  return (
    <group>
      <B p={[0, 0.06, 0.02]} s={[len, 0.12, 0.5]} c="#b9b2a7" r={0.8} />
      <B p={[0, 0.5, 0]} s={[len, 0.76, 0.56]} c={CABINET} />
      {/* 柜门分缝 */}
      {Array.from({ length: Math.max(1, Math.round(len / 0.5)) - 1 }, (_, i) => -len / 2 + (len * (i + 1)) / Math.max(1, Math.round(len / 0.5))).map((x) => (
        <mesh key={x} position={[x, 0.5, 0.281]} material={getMat('lacquer', { color: '#a69d90', roughness: 0.8 })}>
          <boxGeometry args={[0.005, 0.72, 0.003]} />
        </mesh>
      ))}
      <B p={[0, 0.905, 0]} s={[len + 0.02, 0.04, 0.6]} mat="quartz" />
      {sink != null && (
        <group position={[sink, 0.928, 0.02]}>
          <mesh material={getMat('steel', { roughness: 0.32 })}>
            <boxGeometry args={[0.62, 0.006, 0.4]} />
          </mesh>
          <mesh position={[0, 0.16, -0.22]} material={getMat('steel')}>
            <cylinderGeometry args={[0.014, 0.014, 0.32, 10]} />
          </mesh>
        </group>
      )}
      {hob != null && (
        <mesh position={[hob, 0.927, 0.02]} material={getMat('screen')}>
          <boxGeometry args={[0.6, 0.006, 0.5]} />
        </mesh>
      )}
    </group>
  )
}

// 吊柜：pos.y 是柜底高度
function Upper({ len = 1.5 }) {
  return <B p={[0, 0.35, 0]} s={[len, 0.7, 0.35]} c={CABINET} />
}

function Fridge() {
  return (
    <group>
      <B p={[0, 0.88, 0]} s={[0.65, 1.76, 0.65]} mat="steel" c="#b9bec4" r={0.34} />
      <mesh position={[0, 1.18, 0.328]}>
        <boxGeometry args={[0.6, 0.006, 0.004]} />
        <meshStandardMaterial color="#6e7378" />
      </mesh>
      <B p={[0.26, 1.0, 0.345]} s={[0.025, 0.5, 0.025]} mat="steel" c="#8a8f94" />
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

// 悬挂浴室柜 + 台盆 + 镜子（镜子贴背墙，本地 -z）
function Vanity({ len = 0.8 }) {
  return (
    <group>
      <B p={[0, 0.62, 0]} s={[len, 0.42, 0.46]} mat="veneer" c="#8a6f58" />
      <B p={[0, 0.85, 0]} s={[len + 0.02, 0.04, 0.48]} mat="ceramic" c="#efedea" />
      <mesh position={[0, 0.875, 0.03]} material={getMat('ceramic')}>
        <cylinderGeometry args={[0.17, 0.15, 0.01, 24]} />
      </mesh>
      <mesh position={[0, 0.95, -0.17]} material={getMat('steel')}>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />
      </mesh>
      <mesh position={[0, 1.45, -0.225]} material={getMat('mirror')}>
        <planeGeometry args={[len * 0.92, 0.72]} />
      </mesh>
    </group>
  )
}

// 坐便器：水箱靠背墙（本地 -z）
function Toilet() {
  return (
    <group>
      <B p={[0, 0.2, 0.02]} s={[0.36, 0.4, 0.5]} mat="ceramic" />
      <B p={[0, 0.5, -0.2]} s={[0.38, 0.32, 0.16]} mat="ceramic" />
    </group>
  )
}

// 悬浮鞋柜：离地 15cm，下面放拖鞋
function ShoeCabinet({ len = 1.2 }) {
  return (
    <group>
      <B p={[0, 0.65, 0]} s={[len, 1.0, 0.35]} c={MAT.woodDark} />
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
  vanity: Vanity,
  toilet: Toilet,
  shoe: ShoeCabinet,
  plant: Plant,
  planter: Planter,
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

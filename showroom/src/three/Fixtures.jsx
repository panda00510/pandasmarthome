import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DoubleSide, AdditiveBlending, CanvasTexture } from 'three'
import { MOBILE_QUERY } from '../hooks'
import { useHA, lightLevel, usePlan } from '../ha/store'
import { kelvinToColor, rgbArrayToColor, damp } from './utils'
import { latheGeometry, PROFILES } from './shapes'
import { SHELL_LAYER } from './layers'

// 竖向渐隐（上亮下暗）的小贴图，给灯槽洗墙光用
function washGradient() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 64
  const g = c.getContext('2d')
  const grd = g.createLinearGradient(0, 0, 0, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 4, 64)
  return new CanvasTexture(c)
}

// 灯罩是典型的旋转体，用轮廓转出来比堆圆柱像得多
let SHADES = null
function shades() {
  if (!SHADES) {
    SHADES = {
      ceiling: latheGeometry(PROFILES.ceilingDisc, 36),
      floor: latheGeometry(PROFILES.floorShade, 32),
      table: latheGeometry(PROFILES.tableShade, 28),
    }
  }
  return SHADES
}

// 灯具位置来自当前户型的 plans/<户型>.json。
// 壳体的漫反射由烘焙贴图提供，这些实时点光源主要负责照亮家具和产生高光。
const POWER_TO_CANDELA = 0.27

const toLamp = (l) => ({
  id: l.id,
  kind: l.kind,
  pos: l.pos,
  size: l.size,
  along: l.along || 'x',
  span: l.span ?? 1.2,
  power: l.power * POWER_TO_CANDELA,
  wash: l.wash,
  dist: l.kind === 'table' ? 3.2 : l.kind === 'floor' ? 4.2 : l.kind === 'spots' ? 4.4 : l.kind === 'pendant' ? 4.2 : 6.2,
})

// 实时壳体没有烘焙遮挡，主灯要投射阴影，灯才不会穿墙照到隔壁。
// 关键：开关灯绝不能改变"有几盏灯 / 几盏投影"——light.visible 或 castShadow 一变，
// three 会把场景里所有材质的 shader 重新编译一遍（点一下卡 100–300 ms，就是老板说的"延迟"）。
// 所以：所有灯始终挂载、始终 visible，只改 intensity；投影灯在户型加载时固定选好，之后不变。
// 壳体和家具是静态的，点光源阴影只渲染一次（autoUpdate = false），每盏投影灯省掉每帧 6 次场景重绘。
const MAX_POINT_SHADOWS = typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches ? 2 : 4

function pickShadowLamps(lamps) {
  return new Set(
    lamps
      .filter((l) => l.kind === 'ceiling')
      .sort((a, b) => b.power - a.power)
      .slice(0, MAX_POINT_SHADOWS)
      .map((l) => l.id)
  )
}

// 点光源阴影：静态烘一次。挂载后等两帧（家具都已上场）再要求更新一次。
function useStaticShadow(ref, enabled) {
  useEffect(() => {
    const light = ref.current
    if (!light || !enabled) return
    light.castShadow = true
    light.shadow.autoUpdate = false
    light.shadow.needsUpdate = true      // 第一帧就要分配阴影贴图，否则 shader 里的阴影采样器拿不到纹理
    let n = 0
    let id = requestAnimationFrame(function tick() {
      if (++n < 3) id = requestAnimationFrame(tick)
      else light.shadow.needsUpdate = true
    })
    return () => cancelAnimationFrame(id)
  }, [ref, enabled])
}

// 灯光渐变的跟手程度：12 ≈ 90% 在 0.2 s 内到位，仍保留一点柔和
const LIGHT_LAMBDA = 12

function Fixture({ kind, matRef, span = 1.2, along = 'z' }) {
  const S = shades()
  const emissive = (
    <meshStandardMaterial
      ref={matRef}
      color="#fdf6e8"
      emissive="#ffdcae"
      emissiveIntensity={0}
      roughness={0.4}
      side={DoubleSide}
      toneMapped={false}
    />
  )
  switch (kind) {
    case 'ceiling':
      return (
        <group>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.22, 10]} />
            <meshStandardMaterial color="#8a8178" roughness={0.45} metalness={0.5} />
          </mesh>
          <mesh geometry={S.ceiling}>{emissive}</mesh>
        </group>
      )
    case 'spots':
      return (
        <group>
          {[-span / 2, 0, span / 2].map((offset) => (
            <group key={offset} position={along === 'x' ? [offset, 0, 0] : [0, 0, offset]}>
              <mesh>
                <cylinderGeometry args={[0.075, 0.095, 0.055, 20]} />
                <meshStandardMaterial color="#8a8178" roughness={0.4} metalness={0.55} />
              </mesh>
              <mesh position={[0, -0.032, 0]}>
                <cylinderGeometry args={[0.065, 0.065, 0.012, 20]} />
                {offset === 0 ? (
                  emissive
                ) : (
                  <meshStandardMaterial color="#fdf6e8" emissive="#ffdcae" emissiveIntensity={0} toneMapped={false} />
                )}
              </mesh>
            </group>
          ))}
        </group>
      )
    case 'floor':
      return (
        <group>
          <mesh position={[0, 0.015, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.21, 0.03, 24]} />
            <meshStandardMaterial color="#3a3630" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.78, 0]} castShadow>
            <cylinderGeometry args={[0.017, 0.021, 1.53, 12]} />
            <meshStandardMaterial color="#3a3630" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh geometry={S.floor} position={[0, 1.42, 0]} castShadow>{emissive}</mesh>
        </group>
      )
    case 'pendant':
      return (
        <group>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.72, 8]} />
            <meshStandardMaterial color="#8a8178" roughness={0.4} metalness={0.55} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.13, 22, 16]} />
            {emissive}
          </mesh>
        </group>
      )
    case 'table':
      return (
        <group>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.098, 0.04, 20]} />
            <meshStandardMaterial color="#4a4038" roughness={0.55} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.012, 0.014, 0.24, 10]} />
            <meshStandardMaterial color="#4a4038" roughness={0.55} metalness={0.35} />
          </mesh>
          <mesh geometry={S.table} position={[0, 0.24, 0]} castShadow>{emissive}</mesh>
        </group>
      )
    default:
      return null
  }
}

function Lamp({ conf, shadow }) {
  const lightRef = useRef()
  const matRef = useRef()
  const level = useRef(0)
  const color = useMemo(() => new Color('#ffffff'), [])

  // 每帧直接读 store，不靠 React 重渲染：开关一个灯不会让其他组件跟着重渲
  useFrame((_, dt) => {
    const entity = useHA.getState().entities[conf.id]
    if (!entity) return
    level.current = damp(level.current, lightLevel(entity), LIGHT_LAMBDA, dt)
    const a = entity.attributes
    if (a.rgb_color) rgbArrayToColor(a.rgb_color, color)
    else kelvinToColor(a.color_temp_kelvin ?? 3000, color)

    if (lightRef.current) {
      lightRef.current.intensity = level.current * conf.power
      lightRef.current.color.copy(color)
    }
    if (matRef.current) {
      matRef.current.emissive.copy(color)
      // 灯罩亮度封顶 1.8：仍会有一点光晕，但不再是过曝的白斑
      matRef.current.emissiveIntensity = 0.04 + level.current * 1.8
    }
  })

  const lightY = conf.kind === 'floor' ? 1.55 : conf.kind === 'table' ? 0.33 : -0.06

  useStaticShadow(lightRef, shadow)

  return (
    <group position={conf.pos}>
      <Fixture kind={conf.kind} matRef={matRef} span={conf.span} along={conf.along} />
      <pointLight
        ref={lightRef}
        position={[0, lightY, 0]}
        distance={conf.dist}
        decay={2}
        intensity={0}
        castShadow={shadow}
        shadow-mapSize={[512, 512]}
        shadow-camera-near={0.08}
        shadow-camera-far={conf.dist}
        shadow-bias={-0.002}
        shadow-normalBias={0.03}
        shadow-radius={4}
      />
    </group>
  )
}

// 灯带：沿客厅北墙顶部的一条发光条，用两颗点光源铺开
function LightStrip({ conf, center }) {
  const matRef = useRef()
  const l1 = useRef()
  const l2 = useRef()
  const level = useRef(0)
  const color = useMemo(() => new Color('#ffffff'), [])

  useFrame((_, dt) => {
    const entity = useHA.getState().entities[conf.id]
    if (!entity) return
    level.current = damp(level.current, lightLevel(entity), LIGHT_LAMBDA, dt)
    const a = entity.attributes
    if (a.rgb_color) rgbArrayToColor(a.rgb_color, color)
    else kelvinToColor(a.color_temp_kelvin ?? 2800, color)
    for (const ref of [l1, l2]) {
      if (ref.current) {
        ref.current.intensity = level.current * conf.power * 0.7
        ref.current.color.copy(color)
      }
    }
    if (matRef.current) {
      matRef.current.emissive.copy(color)
      matRef.current.emissiveIntensity = 0.03 + level.current * 1.6
    }
    if (washRef.current) {
      washRef.current.color.copy(color).multiplyScalar(level.current * 0.22)
    }
  })

  const along = conf.along || 'x'
  const length = Array.isArray(conf.size) ? conf.size[0] : 1.2
  const thick = Array.isArray(conf.size) ? conf.size[1] : 0.04
  const args = along === 'z' ? [thick, 0.035, length] : [length, 0.035, thick]
  const [x, y, z] = conf.pos
  const spread = Math.min(length * 0.32, 0.85)
  // 点光源从灯条往房间里挪 25 cm：贴着墙放会在亮面瓷砖 / 玻璃上打出一个过曝的白斑
  const off = along === 'z' ? Math.sign(center[0] - x) * 0.25 : Math.sign(center[1] - z) * 0.25
  const p1 = along === 'z' ? [x + off, y - 0.08, z - spread] : [x - spread, y - 0.08, z + off]
  const p2 = along === 'z' ? [x + off, y - 0.08, z + spread] : [x + spread, y - 0.08, z + off]
  const reach = 4.2

  const washRef = useRef()
  // 洗墙光晕：灯槽下方一条往下渐隐的竖向光带，让它读得出是"沿天花的线形灯槽"，而不是一个孤立的光点
  const washTex = useMemo(() => washGradient(), [])
  // conf.wash：灯槽到背后墙面的有向距离（米），洗墙光画在那面墙上；只照过梁那一段，不压到窗玻璃
  const wallSide = conf.wash ?? 0
  const washH = 0.24
  const washPos = along === 'z' ? [x + wallSide, y - washH / 2 + 0.03, z] : [x, y - washH / 2 + 0.03, z + wallSide]

  return (
    <group>
      <mesh position={conf.pos}>
        <boxGeometry args={args} />
        <meshStandardMaterial ref={matRef} color="#fff2dd" emissive="#ffb066" emissiveIntensity={0} toneMapped={false} />
      </mesh>
      {wallSide !== 0 && (
        <mesh position={washPos} rotation={along === 'z' ? [0, wallSide < 0 ? Math.PI / 2 : -Math.PI / 2, 0] : [0, wallSide < 0 ? 0 : Math.PI, 0]}>
          <planeGeometry args={[length * 1.05, washH]} />
          <meshBasicMaterial ref={washRef} color="#000000" map={washTex} transparent blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      <pointLight
        ref={l1}
        position={p1}
        distance={reach}
        decay={2}
        intensity={0}
      />
      <pointLight
        ref={l2}
        position={p2}
        distance={reach}
        decay={2}
        intensity={0}
      />
    </group>
  )
}

// 电视开机时，从屏幕向前（朝沙发）投出的一点柔和冷光。始终挂载，只改强度。
function ScreenGlow({ position }) {
  const ref = useRef()
  const level = useRef(0)
  useFrame((_, dt) => {
    const tv = useHA.getState().entities['media_player.living_tv']
    level.current = damp(level.current, tv?.state === 'on' ? 1 : 0, 5, dt)
    if (ref.current) ref.current.intensity = level.current * 3.2
  })
  return <pointLight ref={ref} position={position} color="#9cc6ff" distance={3.6} decay={2} intensity={0} />
}

// 室外日光：强度与色温随时间变化，窗帘因投影自然遮挡
function Daylight() {
  const timeOfDay = useHA((s) => s.timeOfDay)
  const sun = useRef()
  const hemi = useRef()
  const amb = useRef()
  const color = useMemo(() => new Color(), [])

  // 壳体在 layer 1，客厅那三盏点光源照不到它（避免和烘焙光叠加），
  // 但日光和天光必须照到，否则白天窗边不亮。
  useEffect(() => {
    sun.current?.layers.enable(SHELL_LAYER)
    hemi.current?.layers.enable(SHELL_LAYER)
    amb.current?.layers.enable(SHELL_LAYER)
  }, [])

  useFrame((_, dt) => {
    // 6:00 日出 / 18:00 日落，映射到 0..1
    const t = timeOfDay
    const day = Math.max(0, Math.sin((t - 0.25) * Math.PI * 2) * 0.5 + 0.5)
    const elevation = Math.max(0.02, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.25) / 0.5))))
    const warm = 1 - elevation
    kelvinToColor(6500 - warm * 3400, color)

    if (sun.current) {
      const target = Math.pow(day, 1.5) * 4.6
      sun.current.intensity = damp(sun.current.intensity, target, 4, dt)
      sun.current.color.copy(color)
      // 北立面是客厅和卧室的窗，日光从北侧打进来
      sun.current.position.set(
        Math.cos((t - 0.25) * Math.PI * 2) * 7,
        3 + elevation * 10,
        -10
      )
    }
    if (hemi.current) {
      hemi.current.intensity = damp(hemi.current.intensity, 0.04 + day * 0.3, 4, dt)
    }
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#bcd4ef', '#5c5a52', 0.1]} />
      <directionalLight
        ref={sun}
        castShadow
        intensity={0}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-bias={-0.0009}
        shadow-normalBias={0.03}
      />
      <ambientLight ref={amb} intensity={0.05} color="#8f9dad" />
    </>
  )
}

export default function Fixtures() {
  const plan = usePlan()
  const LAMPS = useMemo(() => plan.lamps.map(toLamp), [plan])
  const shadows = useMemo(() => pickShadowLamps(plan.lamps), [plan])
  return (
    <group>
      {LAMPS.filter((c) => c.kind !== 'strip').map((conf) => (
        <Lamp key={conf.id} conf={conf} shadow={shadows.has(conf.id)} />
      ))}
      {LAMPS.filter((c) => c.kind === 'strip').map((conf) => (
        <LightStrip key={conf.id} conf={conf} center={plan.center} />
      ))}
      {plan.tvGlow && <ScreenGlow position={plan.tvGlow} />}
      <Daylight />
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DoubleSide } from 'three'
import { useHA, lightLevel } from '../ha/store'
import { kelvinToColor, rgbArrayToColor, damp, PLAN } from './utils'
import { latheGeometry, PROFILES } from './shapes'
import { SHELL_LAYER } from './BakedShell'

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

// 灯具位置来自 src/plan.json（和 Blender 烘焙共用同一份）。
// 壳体的漫反射由烘焙贴图提供，这些实时点光源主要负责照亮家具和产生高光。
const POWER_TO_CANDELA = 0.27

export const LAMPS = PLAN.lamps.map((l) => ({
  id: l.id,
  kind: l.kind,
  pos: l.pos,
  power: l.power * POWER_TO_CANDELA,
  dist: l.kind === 'table' ? 4 : l.kind === 'floor' ? 6.5 : 9,
  shadow: l.id === 'light.living_main',
}))

function Fixture({ kind, matRef }) {
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
          {[-0.85, 0, 0.85].map((z) => (
            <group key={z} position={[0, 0, z]}>
              <mesh>
                <cylinderGeometry args={[0.075, 0.095, 0.055, 20]} />
                <meshStandardMaterial color="#8a8178" roughness={0.4} metalness={0.55} />
              </mesh>
              <mesh position={[0, -0.032, 0]}>
                <cylinderGeometry args={[0.065, 0.065, 0.012, 20]} />
                {z === 0 ? (
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

function Lamp({ conf }) {
  const entity = useHA((s) => s.entities[conf.id])
  const lightRef = useRef()
  const matRef = useRef()
  const level = useRef(0)
  const color = useMemo(() => new Color('#ffffff'), [])

  useFrame((_, dt) => {
    level.current = damp(level.current, lightLevel(entity), 7, dt)
    const a = entity.attributes
    if (a.rgb_color) rgbArrayToColor(a.rgb_color, color)
    else kelvinToColor(a.color_temp_kelvin ?? 3000, color)

    if (lightRef.current) {
      lightRef.current.intensity = level.current * conf.power
      lightRef.current.color.copy(color)
      lightRef.current.visible = level.current > 0.004
    }
    if (matRef.current) {
      matRef.current.emissive.copy(color)
      matRef.current.emissiveIntensity = 0.05 + level.current * 2.6
    }
  })

  const lightY = conf.kind === 'floor' ? 1.55 : conf.kind === 'table' ? 0.33 : -0.06

  return (
    <group position={conf.pos}>
      <Fixture kind={conf.kind} matRef={matRef} />
      <pointLight
        ref={lightRef}
        position={[0, lightY, 0]}
        distance={conf.dist}
        decay={2}
        intensity={0}
        castShadow={!!conf.shadow}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0016}
        shadow-normalBias={0.02}
      />
    </group>
  )
}

// 灯带：沿客厅北墙顶部的一条发光条，用两颗点光源铺开
function LightStrip({ conf }) {
  const entity = useHA((s) => s.entities[conf.id])
  const matRef = useRef()
  const l1 = useRef()
  const l2 = useRef()
  const level = useRef(0)
  const color = useMemo(() => new Color('#ffffff'), [])

  useFrame((_, dt) => {
    level.current = damp(level.current, lightLevel(entity), 7, dt)
    const a = entity.attributes
    if (a.rgb_color) rgbArrayToColor(a.rgb_color, color)
    else kelvinToColor(a.color_temp_kelvin ?? 2800, color)
    for (const ref of [l1, l2]) {
      if (ref.current) {
        ref.current.intensity = level.current * 13
        ref.current.color.copy(color)
        ref.current.visible = level.current > 0.004
      }
    }
    if (matRef.current) {
      matRef.current.emissive.copy(color)
      matRef.current.emissiveIntensity = 0.05 + level.current * 3.2
    }
  })

  return (
    <group>
      <mesh position={[-5.4, 2.56, -5.28]}>
        <boxGeometry args={[5.6, 0.05, 0.05]} />
        <meshStandardMaterial ref={matRef} color="#fff2dd" emissive="#ffb066" emissiveIntensity={0} toneMapped={false} />
      </mesh>
      <pointLight ref={l1} position={[-6.8, 2.5, -5.0]} distance={7} decay={2} intensity={0} />
      <pointLight ref={l2} position={[-4.0, 2.5, -5.0]} distance={7} decay={2} intensity={0} />
    </group>
  )
}

// 电视开机时对客厅的补光
function ScreenGlow() {
  const tv = useHA((s) => s.entities['media_player.living_tv'])
  const ref = useRef()
  const level = useRef(0)
  useFrame((state, dt) => {
    const on = tv.state === 'on' ? 1 : 0
    level.current = damp(level.current, on, 5, dt)
    if (ref.current) {
      // 轻微闪烁，模拟画面变化
      // 保留一点点画面变化的感觉，但幅度压到基本察觉不到
      const flicker = 0.95 + Math.sin(state.clock.elapsedTime * 0.7) * 0.05
      ref.current.intensity = level.current * 12.5 * flicker
      ref.current.visible = level.current > 0.01
    }
  })
  return <pointLight ref={ref} position={[-5.4, 1.5, -4.6]} color="#8fc4ff" distance={6} decay={2} intensity={0} />
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
      sun.current.position.set(
        Math.cos((t - 0.25) * Math.PI * 2) * -14,
        2 + elevation * 13,
        9 + (1 - elevation) * 5
      )
      sun.current.visible = sun.current.intensity > 0.01
    }
    if (hemi.current) {
      hemi.current.intensity = damp(hemi.current.intensity, 0.05 + day * 0.16, 4, dt)
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
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
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
  return (
    <group>
      {LAMPS.filter((c) => c.kind !== 'strip').map((conf) => (
        <Lamp key={conf.id} conf={conf} />
      ))}
      {LAMPS.filter((c) => c.kind === 'strip').map((conf) => (
        <LightStrip key={conf.id} conf={conf} />
      ))}
      <ScreenGlow />
      <Daylight />
    </group>
  )
}

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing'
import { Vector3, Color, Fog } from 'three'
import { useHA } from '../ha/store'
import hdriUrl from '../assets/hdri/studio_small_09_1k.hdr?url'
import { useIsMobile } from '../hooks'
import Shell from './Shell'
import Furniture from './Furniture'
import Fixtures from './Fixtures'
import Curtains from './Curtains'
import Devices from './Devices'
import Decor from './Decor'
import Hotspots from './Hotspots'
import ExternalHouse from './ExternalHouse'
import HdriEnvironment from './HdriEnvironment'
import { SHELL_LAYER } from './layers'
import Surroundings from './Surroundings'

// 换成自己的模型：在 .env 里设置 VITE_HOUSE_MODEL=/house.glb
const MODEL_URL = import.meta.env.VITE_HOUSE_MODEL || null

export const VIEWS = {
  // 12.6 m × 7.4 m 的长条户型：从南侧偏东俯视，1440×900 开面板时约占空闲区宽度的 83%
  overview: { name: { en: 'Overview', zh: '全屋' }, pos: [4.5, 16.5, 16.5], target: [-0.5, 0, 0.6] },
  // 房间视角是从南侧上方俯视的“剖面”机位：模型没有天花板，站在房间里用 36° 视场角只能看到家具局部。
  // 俯角 64°–74°，近侧 2.6 m 的墙只挡住约 1 m 的地面。
  living: { name: { en: 'Living', zh: '客厅' }, pos: [-3.0, 9.9, 2.9], target: [-4.4, 0.5, -1.5] },
  bedroom: { name: { en: 'Master', zh: '主卧' }, pos: [6.2, 9.5, 2.6], target: [4.9, 0.5, -1.6] },
  second: { name: { en: 'Bed 2', zh: '次卧' }, pos: [0.1, 8.7, 1.3], target: [-1.0, 0.5, -2.2] },
  kitchen: { name: { en: 'Kitchen', zh: '厨房' }, pos: [2.1, 8.7, 5.5], target: [1.0, 0.5, 2.0] },
  bath: { name: { en: 'Bath', zh: '卫生间' }, pos: [4.1, 7.2, 3.4], target: [3.55, 0.5, 1.55] },
}

// 手机画布只有屏幕上方 62%，换一个更高、更正的机位
const MOBILE_OVERVIEW = { pos: [3.2, 16.5, 13.5], target: [-0.35, 1.5, -0.9] }

const MOBILE_FOV = 60
const DESKTOP_FOV = 36

/**
 * The canvas fills the whole window and the side panel floats over it. The
 * projection is shifted by half the panel's width, so the house is centred in
 * the part of the window that is actually free instead of being cut off
 * behind the panel (or leaving a dark column beside it).
 */
function ViewOffset({ isMobile }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const focus = useHA((s) => s.focusMode)
  const collapsed = useHA((s) => s.panelCollapsed)
  useEffect(() => {
    const reserved = isMobile || focus ? 0 : collapsed ? 130 : 340
    if (reserved) camera.setViewOffset(size.width, size.height, reserved / 2, 0, size.width, size.height)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, isMobile, focus, collapsed])
  return null
}

function CameraRig({ views, isMobile }) {
  const view = useHA((s) => s.view)
  const setView = useHA((s) => s.setView)
  const controls = useThree((s) => s.controls)
  const camera = useThree((s) => s.camera)
  const p = useMemo(() => new Vector3(), [])
  const t = useMemo(() => new Vector3(), [])

  // 竖屏画幅窄得多，换更大的视场角才装得下整套户型
  useEffect(() => {
    camera.fov = isMobile ? MOBILE_FOV : DESKTOP_FOV
    camera.updateProjectionMatrix()
    camera.layers.enable(SHELL_LAYER)   // 否则烘焙壳体不可见
  }, [camera, isMobile])

  // 用户一旦手动操作就退出预设视角
  useEffect(() => {
    if (!controls) return
    const onStart = () => setView(null)
    controls.addEventListener('start', onStart)
    return () => controls.removeEventListener('start', onStart)
  }, [controls, setView])

  useFrame((_, dt) => {
    if (!view || !controls) return
    const v = views[view]
    if (!v) return
    const k = 1 - Math.exp(-3.2 * dt)
    p.set(...v.pos)
    t.set(...v.target)
    camera.position.lerp(p, k)
    controls.target.lerp(t, k)
    controls.update()
  })
  return null
}

// 背景与雾随时间变化，让远处地面自然融进天色
const NIGHT = new Color('#070a10')
const DUSK = new Color('#4a3a35')
const DAY = new Color('#a8bccd')

function Atmosphere() {
  const timeOfDay = useHA((s) => s.timeOfDay)
  const scene = useThree((s) => s.scene)
  const current = useMemo(() => new Color('#a8bccd'), [])
  const target = useMemo(() => new Color(), [])

  useEffect(() => {
    scene.background = current
    scene.fog = new Fog(current, 46, 130)
  }, [scene, current])

  useFrame((_, dt) => {
    const day = Math.max(0, Math.sin((timeOfDay - 0.25) * Math.PI * 2) * 0.5 + 0.5)
    if (day < 0.4) target.copy(NIGHT).lerp(DUSK, day / 0.4)
    else target.copy(DUSK).lerp(DAY, (day - 0.4) / 0.6)
    current.lerp(target, 1 - Math.exp(-3 * dt))
    if (scene.fog) scene.fog.color.copy(current)
    // HDRI 本身是固定的白天环境，夜里要压下来，否则屋里怎么关灯都亮
    scene.environmentIntensity = 0.05 + day * 0.32
  })
  return null
}

function World() {
  const bindings = useRef(null)
  return (
    <>
      {MODEL_URL ? (
        <ExternalHouse url={MODEL_URL} onBindings={(m) => (bindings.current = m)} />
      ) : (
        <>
          <Shell />
          <Furniture />
          <Curtains />
          <Devices />
          <Decor />
        </>
      )}
      <Fixtures />
      <Surroundings />
      <Hotspots />
    </>
  )
}

export default function Scene() {
  const isMobile = useIsMobile()
  const views = useMemo(
    () =>
      isMobile
        ? { ...VIEWS, overview: { ...VIEWS.overview, ...MOBILE_OVERVIEW } }
        : VIEWS,
    [isMobile]
  )

  return (
    <Canvas
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{
        position: isMobile ? MOBILE_OVERVIEW.pos : VIEWS.overview.pos,
        fov: isMobile ? MOBILE_FOV : DESKTOP_FOV,
        near: 0.1,
        far: 400,
      }}
    >
      <Atmosphere />

      <Suspense fallback={null}>
        <World />
        {/* 环境光照来自 Poly Haven 的 CC0 HDRI（1K），给所有材质提供真实的反射与柔光 */}
        <HdriEnvironment url={hdriUrl} />
      </Suspense>

      <ContactShadows position={[0, -0.31, 0]} opacity={0.45} scale={18} blur={2.6} far={5} resolution={512} color="#05070b" />

      <OrbitControls
        makeDefault
        target={VIEWS.overview.target}
        minDistance={2.0}
        maxDistance={64}
        maxPolarAngle={Math.PI / 2.12}
        minPolarAngle={0.12}
        enableDamping
        dampingFactor={0.08}
        panSpeed={0.6}
      />
      <CameraRig views={views} isMobile={isMobile} />
      <ViewOffset isMobile={isMobile} />

      <EffectComposer disableNormalPass multisampling={isMobile ? 0 : 4}>
        {/* 环境光遮蔽：没有它，家具底部和墙角均匀发亮，物体像浮在地面上 */}
        <N8AO
          aoRadius={0.55}
          distanceFalloff={0.7}
          intensity={2.6}
          color="#150e06"
          quality={isMobile ? 'low' : 'medium'}
          halfRes={isMobile}
        />
        <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.45} intensity={0.7} levels={isMobile ? 5 : 6} />
        <Vignette offset={0.26} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  )
}

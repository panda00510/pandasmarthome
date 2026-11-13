import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, N8AO, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { Vector3, Color, Fog } from 'three'
import { useHA, usePlan } from '../ha/store'
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
import { startTextures, startProceduralTextures } from './materials'

// 换成自己的模型：在 .env 里设置 VITE_HOUSE_MODEL=/house.glb
const MODEL_URL = import.meta.env.VITE_HOUSE_MODEL || null

// 相机预设视角按户型写在 plans/<户型>.json 的 views 里（机位都在房间内部，视线不穿实墙）。

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
    // 房间视角可以给更广的视场角（小房间里 36° 只看得到一张床）；手机本来就是 60°
    const base = isMobile ? MOBILE_FOV : DESKTOP_FOV
    const fov = Math.max(base, v.fov ?? base)
    if (Math.abs(camera.fov - fov) > 0.05) {
      camera.fov += (fov - camera.fov) * k
      camera.updateProjectionMatrix()
    }
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

// 挂在 Suspense 里面：HDRI、户型几何都就绪后才会挂载。useFrame 在渲染前调用，
// 数到第 2 帧时第 1 帧已经真正画出来了，此时通知加载屏淡出，再开始后台生成纹理。
function FirstFrame() {
  const n = useRef(0)
  useFrame(() => {
    if (++n.current !== 2) return
    useHA.getState().setSceneReady(true)
    startProceduralTextures()
  })
  return null
}

function World() {
  const bindings = useRef(null)
  const planId = useHA((s) => s.planId)
  const [cx, cz] = usePlan().center
  // 按户型整组重挂：灯、家具、热点都从新户型的数据重建
  return (
    <group key={planId}>
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
      {/* 地台下的接触阴影只算一次（场景静态），不再每帧重绘 */}
      <ContactShadows position={[cx, -0.31, cz]} opacity={0.45} scale={18} blur={2.6} far={5} resolution={512} color="#05070b" frames={1} />
      <FirstFrame />
    </group>
  )
}

export default function Scene() {
  const isMobile = useIsMobile()
  const plan = usePlan()
  const views = useMemo(
    () =>
      isMobile && plan.views.overview.mobile
        ? { ...plan.views, overview: { ...plan.views.overview, ...plan.views.overview.mobile } }
        : plan.views,
    [isMobile, plan]
  )
  const start = views.overview

  return (
    <Canvas
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={(state) => {
        startTextures(state.gl)
        // 仅开发环境：给截图 / 排查脚本一个拿相机的入口，生产构建会被摇树掉
        if (import.meta.env.DEV) window.__r3f = state.get
      }}
      camera={{
        position: start.pos,
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


      <OrbitControls
        makeDefault
        target={start.target}
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
        {/* 只有真正的灯罩（自发光 > 1）会起光晕；热点、指示灯、电视画面都压在阈值以下 */}
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.3} intensity={0.55} levels={isMobile ? 4 : 6} />
        <Vignette offset={0.26} darkness={0.5} />
        {/* 合成器把渲染器的 toneMapping 关掉了，必须在最后补一道，否则高光直接截断发白 */}
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </Canvas>
  )
}

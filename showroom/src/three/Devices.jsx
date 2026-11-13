import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Color, DoubleSide } from 'three'
import { useHA, isOn, usePlan } from '../ha/store'
import { damp, kelvinToColor } from './utils'
import { getMat } from './materials'

// 原则：只有 light 域的实体可以"发光照明"。其他设备的开 / 关反馈是它自己真实的样子 ——
// 导风板、叶片、门扇、屏幕、毫米级指示灯。指示灯一律 meshBasic + 颜色值压在 Bloom 阈值以下，
// 不照亮环境、不起光晕。3D 组件在 useFrame 里用 getState() 读状态，开关一个设备不会触发 React 重渲染。

const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ent = (id) => useHA.getState().entities[id]

// 毫米级指示灯：颜色乘 0.75，永远低于 Bloom 阈值（1.0）
const LED_COLORS = { green: '#3fae6e', red: '#c0392b', amber: '#c9953f', blue: '#3f7fc9', off: '#2a2a2a' }
function Led({ ledRef, color = 'off', r = 0.005, ...p }) {
  return (
    <mesh {...p}>
      <sphereGeometry args={[r, 10, 8]} />
      <meshBasicMaterial ref={ledRef} color={LED_COLORS[color]} toneMapped={false} />
    </mesh>
  )
}
const setLed = (ref, key) => ref.current && ref.current.color.set(LED_COLORS[key])

// 壁挂分体机。本地 -X 是出风方向，用 group 的 rotation 对准房间。
// 开机：导风板打开 + 出风口下方几条很淡的气流细纹往下飘（制冷偏冷色、送风白色、除湿稀疏缓慢）+ 机身小绿灯。
const STREAKS = 6
function SplitUnit({ id, position, rotation = [0, 0, 0], scale = 1 }) {
  const vane = useRef()
  const led = useRef()
  const streaks = useRef([])
  const lvl = useRef(0)
  const tint = useMemo(() => new Color(), [])

  useFrame((state, dt) => {
    const e = ent(id)
    const on = isOn(e)
    lvl.current = damp(lvl.current, on ? 1 : 0, 5, dt)
    // 导风板绕自身长轴（本地 z）转，出风侧（-x）往下翻开
    if (vane.current) vane.current.rotation.z = lvl.current * 0.9
    setLed(led, on ? 'green' : 'off')
    const mode = e?.state
    const speed = mode === 'dry' ? 0.18 : 0.4
    tint.set(mode === 'fan_only' ? '#ffffff' : '#cfe6ff')
    const t = REDUCED_MOTION ? 0.5 : state.clock.elapsedTime * speed
    streaks.current.forEach((m, i) => {
      if (!m) return
      const dense = mode === 'dry' ? i % 2 === 0 : true
      const ph = (t + i / STREAKS) % 1
      m.position.set(-0.12 - ph * 0.35, -0.2 - ph * 0.45, -0.36 + (i / (STREAKS - 1)) * 0.72)
      m.material.opacity = dense ? Math.sin(ph * Math.PI) * 0.28 * lvl.current : 0
      m.material.color.copy(tint)
      m.visible = lvl.current > 0.02
    })
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[0.22, 0.28, 0.92]} radius={0.04} smoothness={3} castShadow material={getMat('plastic')} />
      <mesh ref={vane} position={[0, -0.13, 0]} material={getMat('plastic', { color: '#dcd8d2' })}>
        <boxGeometry args={[0.16, 0.025, 0.82]} />
      </mesh>
      <Led ledRef={led} position={[-0.112, -0.07, 0.36]} r={0.004} />
      {Array.from({ length: STREAKS }, (_, i) => (
        <mesh key={i} ref={(m) => (streaks.current[i] = m)} rotation={[0, 0, 0.7]} visible={false}>
          <planeGeometry args={[0.012, 0.32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// 吊扇：转速随档位。停着不转。
function CeilingFan({ id, position }) {
  const blades = useRef()
  const spd = useRef(0)

  useFrame((_, dt) => {
    const e = ent(id)
    const target = isOn(e) ? (e.attributes.percentage ?? 66) / 100 : 0
    spd.current = damp(spd.current, target, 2.2, dt)
    if (blades.current) blades.current.rotation.y += spd.current * dt * 7.5
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.14, 0]} material={getMat('brass', { color: '#8a847c' })}>
        <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow material={getMat('blackMetal', { color: '#4e4a45' })}>
        <cylinderGeometry args={[0.09, 0.11, 0.07, 16]} />
      </mesh>
      <group ref={blades}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <mesh position={[0.36, 0, 0]} rotation={[0.22, 0, 0]} castShadow material={getMat('veneer', { color: '#5a4e44' })}>
              <boxGeometry args={[0.62, 0.018, 0.14]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// 浴室储水式热水器：通电只亮一个毫米级红色加热指示灯。
// 横挂：罐体沿本地 x，指示灯朝本地 -z。
function StorageHeater({ id, position, rotation }) {
  const led = useRef()
  useFrame(() => setLed(led, isOn(ent(id)) ? 'red' : 'off'))
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={getMat('plastic', { color: '#e7e1d8', roughness: 0.35 })}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 20]} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} material={getMat('steel', { color: '#8d8680', roughness: 0.4 })}>
        <cylinderGeometry args={[0.155, 0.155, 0.08, 20]} />
      </mesh>
      <Led ledRef={led} position={[0.12, -0.08, -0.15]} r={0.006} />
    </group>
  )
}

// 可视门铃（门外，朝 +z）：按钮外圈的细环在"正在查看"时微亮
function Doorbell({ id, position, rotation }) {
  const ring = useRef()
  useFrame(() => ring.current?.color.set(isOn(ent(id)) ? '#5a8fc4' : '#1c2a38'))
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.09, 0.16, 0.04]} radius={0.01} smoothness={2} castShadow material={getMat('blackMetal', { color: '#23272b' })} />
      <mesh position={[0, 0.035, 0.021]} material={getMat('screen')}>
        <circleGeometry args={[0.014, 16]} />
      </mesh>
      <mesh position={[0, -0.035, 0.021]}>
        <ringGeometry args={[0.012, 0.015, 24]} />
        <meshBasicMaterial ref={ring} color="#1c2a38" toneMapped={false} />
      </mesh>
    </group>
  )
}

// 玄关室内小屏：查看门外时屏幕微亮（暗蓝，远低于 Bloom 阈值）
function Monitor({ id, position, rotation }) {
  const scr = useRef()
  useFrame(() => scr.current?.color.set(isOn(ent(id)) ? '#24496b' : '#0d1013'))
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.11, 0.16, 0.02]} radius={0.006} smoothness={2} material={getMat('plastic', { color: '#2c3136' })} />
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.08, 0.11]} />
        <meshBasicMaterial ref={scr} color="#0d1013" toneMapped={false} />
      </mesh>
    </group>
  )
}

// 智能晾衣架（服务阳台吊顶）：cover 控升降（100 = 顶），fan 控风干（吊机前端的风扇格栅转动），
// light 控照明（这是 light 域，可以真的照亮阳台）。晾杆沿本地 z。
function LaundryRack({ position, rotation, len = 1.6 }) {
  const bars = useRef()
  const fanRef = useRef()
  const lampMat = useRef()
  const lamp = useRef()
  const h = useRef(1)
  const spin = useRef(0)
  const lv = useRef(0)
  const col = useMemo(() => new Color(), [])
  const DROP = 0.85

  useFrame((_, dt) => {
    const cover = ent('cover.yard_rack')
    const fan = ent('fan.yard_rack_dry')
    const light = ent('light.yard_rack')
    h.current = damp(h.current, (cover?.attributes.current_position ?? 100) / 100, 1.6, dt)
    if (bars.current) bars.current.position.y = -0.12 - (1 - h.current) * DROP
    spin.current = damp(spin.current, isOn(fan) ? 1 : 0, 2, dt)
    if (fanRef.current) fanRef.current.rotation.z += spin.current * dt * 14
    lv.current = damp(lv.current, isOn(light) ? (light.attributes.brightness ?? 255) / 255 : 0, 12, dt)
    kelvinToColor(light?.attributes.color_temp_kelvin ?? 5000, col)
    if (lamp.current) {
      lamp.current.intensity = lv.current * 5
      lamp.current.color.copy(col)
    }
    if (lampMat.current) {
      lampMat.current.emissive.copy(col)
      lampMat.current.emissiveIntensity = 0.03 + lv.current * 1.4
    }
  })

  const steel = getMat('steel', { roughness: 0.3 })
  return (
    <group position={position} rotation={rotation}>
      {/* 吊顶电机盒 + 照明面板 + 风干格栅 */}
      <RoundedBox args={[0.42, 0.08, len]} radius={0.02} smoothness={2} castShadow material={getMat('plastic', { color: '#ecebe8' })} />
      <mesh position={[0, -0.042, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.16, len * 0.55]} />
        <meshStandardMaterial ref={lampMat} color="#f6f4ef" emissive="#ffffff" emissiveIntensity={0} toneMapped={false} />
      </mesh>
      <group position={[0, -0.042, len / 2 - 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={getMat('blackMetal', { color: '#9a9ea2' })}>
          <circleGeometry args={[0.07, 20]} />
        </mesh>
        <group ref={fanRef} position={[0, 0, 0.002]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0]} material={getMat('blackMetal', { color: '#3a3d40' })}>
              <planeGeometry args={[0.012, 0.12]} />
            </mesh>
          ))}
        </group>
      </group>
      <pointLight ref={lamp} position={[0, -0.25, 0]} distance={3} decay={2} intensity={0} />
      {/* 升降的晾杆 + 钢索 + 一件衣服 */}
      <group ref={bars} position={[0, -0.12, 0]}>
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow material={steel}>
            <cylinderGeometry args={[0.015, 0.015, len, 8]} />
          </mesh>
        ))}
        <mesh position={[0.15, -0.28, 0.2]} castShadow material={getMat('linen', { color: '#d9cfc2', side: DoubleSide })}>
          <boxGeometry args={[0.02, 0.55, 0.5]} />
        </mesh>
        <mesh position={[-0.15, -0.22, -0.35]} castShadow material={getMat('linen', { color: '#9fb2c4', side: DoubleSide })}>
          <boxGeometry args={[0.02, 0.42, 0.36]} />
        </mesh>
      </group>
      <Cables bars={bars} len={len} />
    </group>
  )
}

// 钢索跟着晾杆伸缩
function Cables({ bars, len }) {
  const refs = useRef([])
  useFrame(() => {
    const y = bars.current?.position.y ?? -0.12
    refs.current.forEach((m) => {
      if (!m) return
      m.scale.y = Math.max(0.01, -y)
      m.position.y = y / 2
    })
  })
  return [-len / 2 + 0.1, len / 2 - 0.1].map((z, i) => (
    <mesh key={z} ref={(m) => (refs.current[i] = m)} position={[0, -0.06, z]} material={getMat('steel')}>
      <cylinderGeometry args={[0.003, 0.003, 1, 4]} />
    </mesh>
  ))
}

// 扫地机器人：清扫时沿房间里一条简单的回字形路径走，回充时直线回座，停靠时在充电座上。
// 机身顶部一个毫米级状态灯：清扫绿、回充琥珀、停靠灭。
function RobotVacuum({ position, path }) {
  const body = useRef()
  const led = useRef()
  const brush = useRef()
  const st = useRef({ s: 0, x: position[0], z: position[2], heading: 0 })
  const pts = useMemo(() => path ?? [[position[0], position[2]]], [path, position])
  const seg = useMemo(() => {
    const out = []
    let total = 0
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % pts.length]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      out.push({ a, b, l, start: total })
      total += l
    }
    return { out, total }
  }, [pts])

  useFrame((_, dt) => {
    const e = ent('vacuum.robot')
    const s = st.current
    let tx = position[0]
    let tz = position[2]
    if (e?.state === 'cleaning' && seg.total > 0) {
      s.s = (s.s + dt * 0.28) % seg.total
      const g = seg.out.find((q) => s.s >= q.start && s.s < q.start + q.l) ?? seg.out[0]
      const k = (s.s - g.start) / (g.l || 1)
      tx = g.a[0] + (g.b[0] - g.a[0]) * k
      tz = g.a[1] + (g.b[1] - g.a[1]) * k
    } else if (e?.state === 'docked') {
      s.s = 0
    }
    const dx = tx - s.x
    const dz = tz - s.z
    const d = Math.hypot(dx, dz)
    const step = Math.min(d, dt * (e?.state === 'cleaning' ? 0.6 : 0.35))
    if (d > 1e-3) {
      s.x += (dx / d) * step
      s.z += (dz / d) * step
      s.heading = Math.atan2(dx, dz)
    }
    if (body.current) {
      body.current.position.set(s.x, 0, s.z)
      body.current.rotation.y = s.heading
    }
    if (brush.current && e?.state !== 'docked') brush.current.rotation.y += dt * 18
    setLed(led, e?.state === 'cleaning' ? 'green' : e?.state === 'returning' ? 'amber' : 'off')
  })

  return (
    <group>
      {/* 充电座贴墙，正面朝 +z（由 rot 调整到房间里） */}
      <group position={position}>
        <RoundedBox args={[0.24, 0.1, 0.08]} radius={0.02} smoothness={2} position={[0, 0.05, -0.18]} castShadow material={getMat('plastic', { color: '#2b2e31' })} />
      </group>
      <group ref={body} position={position}>
        <mesh position={[0, 0.045, 0]} castShadow receiveShadow material={getMat('plastic', { color: '#e9e7e2', roughness: 0.3 })}>
          <cylinderGeometry args={[0.17, 0.17, 0.08, 32]} />
        </mesh>
        <mesh position={[0, 0.095, -0.03]} material={getMat('blackMetal', { color: '#3a3d40' })}>
          <cylinderGeometry args={[0.045, 0.045, 0.022, 20]} />
        </mesh>
        <group ref={brush} position={[0.11, 0.008, 0.1]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0, 0, 0]} material={getMat('blackMetal')}>
              <boxGeometry args={[0.1, 0.003, 0.006]} />
            </mesh>
          ))}
        </group>
        <Led ledRef={led} position={[0, 0.087, 0.11]} r={0.005} />
      </group>
    </group>
  )
}

// 除湿机（卧室落地）：开机时顶部格栅后的小风扇转动 + 面板绿色运行灯。
function Dehumidifier({ id, position, rotation }) {
  const led = useRef()
  const fan = useRef()
  useFrame((_, dt) => {
    const on = isOn(ent(id))
    setLed(led, on ? 'green' : 'off')
    if (fan.current && on) fan.current.rotation.y += dt * 10
  })
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.34, 0.56, 0.24]} radius={0.04} smoothness={3} position={[0, 0.28, 0]} castShadow receiveShadow material={getMat('plastic')} />
      <mesh position={[0, 0.561, 0]} rotation={[-Math.PI / 2, 0, 0]} material={getMat('blackMetal', { color: '#5d6166' })}>
        <planeGeometry args={[0.24, 0.14]} />
      </mesh>
      <group ref={fan} position={[0, 0.563, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, (i * Math.PI * 2) / 3]} material={getMat('blackMetal')}>
            <planeGeometry args={[0.012, 0.1]} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.44, 0.121]} material={getMat('screen')}>
        <planeGeometry args={[0.12, 0.05]} />
      </mesh>
      <Led ledRef={led} position={[0.09, 0.44, 0.123]} r={0.004} />
      {/* 水箱 */}
      <mesh position={[0, 0.12, 0.121]} material={getMat('glass', { opacity: 0.35, color: '#c8d6dc' })}>
        <planeGeometry args={[0.26, 0.16]} />
      </mesh>
    </group>
  )
}

// 智能插座：墙面插座面板 + 毫米级蓝色通电指示（本地 +z 朝外）
function SmartPlug({ id, position, rotation }) {
  const led = useRef()
  useFrame(() => setLed(led, isOn(ent(id)) ? 'blue' : 'off'))
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.086, 0.086, 0.012]} radius={0.006} smoothness={2} material={getMat('plastic')} />
      <RoundedBox args={[0.05, 0.05, 0.03]} radius={0.008} smoothness={2} position={[0, 0, 0.016]} castShadow material={getMat('plastic', { color: '#f6f5f2' })} />
      <Led ledRef={led} position={[0.017, 0.017, 0.032]} r={0.0028} />
    </group>
  )
}

// 吸顶 / 贴墙的小传感器（烟雾燃气、人体存在、门磁、漏水）：
// 只读设备，报警 / 触发时状态灯变色（红 = 烟雾 / 漏水报警，蓝 = 有人，门磁不亮灯）。
function Sensor({ id, position, rotation, kind = 'smoke' }) {
  const led = useRef()
  useFrame((state) => {
    const on = ent(id)?.state === 'on'
    const blink = REDUCED_MOTION || Math.sin(state.clock.elapsedTime * 6) > 0
    if (kind === 'motion') setLed(led, on ? 'blue' : 'off')
    else if (kind === 'contact') setLed(led, 'off')
    else setLed(led, on && blink ? 'red' : 'off')
  })
  const white = getMat('plastic')
  if (kind === 'leak') {
    return (
      <group position={position} rotation={rotation}>
        <mesh position={[0, 0.012, 0]} castShadow material={white}>
          <cylinderGeometry args={[0.035, 0.038, 0.024, 20]} />
        </mesh>
        <Led ledRef={led} position={[0, 0.025, 0.02]} r={0.003} />
      </group>
    )
  }
  if (kind === 'contact') {
    return (
      <group position={position} rotation={rotation}>
        <RoundedBox args={[0.07, 0.02, 0.02]} radius={0.004} smoothness={2} material={white} />
        <Led ledRef={led} position={[0.03, 0, 0.011]} r={0.002} />
      </group>
    )
  }
  if (kind === 'motion') {
    return (
      <group position={position} rotation={rotation}>
        <mesh material={white}>
          <sphereGeometry args={[0.035, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh rotation={[Math.PI, 0, 0]} material={getMat('screen', { color: '#e8e6e0', roughness: 0.2 })}>
          <sphereGeometry args={[0.03, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <Led ledRef={led} position={[0.026, -0.012, 0]} r={0.003} />
      </group>
    )
  }
  // 壁挂烟雾 / 燃气探测器（燃气报警器装在灶台附近墙上、离顶 30 cm；本地 +z 朝外）
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0.016]} rotation={[Math.PI / 2, 0, 0]} material={white}>
        <cylinderGeometry args={[0.055, 0.06, 0.032, 24]} />
      </mesh>
      <Led ledRef={led} position={[0.03, 0, 0.033]} r={0.0035} />
    </group>
  )
}

const KINDS = {
  split: SplitUnit,
  fan: CeilingFan,
  heater: StorageHeater,
  doorbell: Doorbell,
  monitor: Monitor,
  rack: LaundryRack,
  vacuum: RobotVacuum,
  dehumidifier: Dehumidifier,
  plug: SmartPlug,
  smoke: (p) => <Sensor {...p} kind="smoke" />,
  leak: (p) => <Sensor {...p} kind="leak" />,
  motion: (p) => <Sensor {...p} kind="motion" />,
  contact: (p) => <Sensor {...p} kind="contact" />,
}

// 设备摆位按户型写在 plans/<户型>.json 的 devices 里，rot 为角度
export default function Devices() {
  const { devices = [] } = usePlan()
  return (
    <group>
      {devices.map((d, i) => {
        const Kind = KINDS[d.type]
        return Kind ? (
          <Kind key={i} id={d.id} position={d.pos} rotation={[0, ((d.rot ?? 0) * Math.PI) / 180, 0]} scale={d.scale} len={d.len} path={d.path} />
        ) : null
      })}
    </group>
  )
}

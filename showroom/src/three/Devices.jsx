import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useHA, isOn, usePlan } from '../ha/store'
import { damp } from './utils'

// 壁挂分体机。本地 -X 是出风方向，用 group 的 rotation 对准房间。
function SplitUnit({ id, position, rotation = [0, 0, 0], scale = 1 }) {
  const e = useHA((s) => s.entities[id])
  const vane = useRef()
  const glow = useRef()
  const lvl = useRef(0)

  useFrame((_, dt) => {
    const on = isOn(e) ? 1 : 0
    lvl.current = damp(lvl.current, on, 5, dt)
    if (vane.current) vane.current.rotation.x = -lvl.current * 0.9
    if (glow.current) {
      glow.current.material.opacity = lvl.current * 0.1
      glow.current.visible = lvl.current > 0.02
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[0.22, 0.28, 0.92]} radius={0.04} smoothness={3} castShadow>
        <meshStandardMaterial color="#f3f1ec" roughness={0.5} />
      </RoundedBox>
      <mesh ref={vane} position={[0, -0.13, 0]}>
        <boxGeometry args={[0.16, 0.025, 0.82]} />
        <meshStandardMaterial color="#dcd8d2" roughness={0.5} />
      </mesh>
      <mesh ref={glow} position={[-0.45, -0.6, 0]} rotation={[0, 0, 0.45]}>
        <planeGeometry args={[1.1, 1.05]} />
        <meshBasicMaterial color="#8fd4ff" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// 吊扇：三档风速对应叶片转速。停着的时候不转，避免空转闪烁。
function CeilingFan({ id, position }) {
  const e = useHA((s) => s.entities[id])
  const blades = useRef()
  const spd = useRef(0)

  useFrame((_, dt) => {
    const target = isOn(e) ? (e.attributes.percentage ?? 66) / 100 : 0
    spd.current = damp(spd.current, target, 2.2, dt)
    if (blades.current) blades.current.rotation.y += spd.current * dt * 7.5
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
        <meshStandardMaterial color="#8a847c" roughness={0.4} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.07, 16]} />
        <meshStandardMaterial color="#4e4a45" roughness={0.45} metalness={0.25} />
      </mesh>
      <group ref={blades}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <mesh position={[0.36, 0, 0]} rotation={[0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.62, 0.018, 0.14]} />
              <meshStandardMaterial color="#3c3834" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// 浴室储水式热水器，高挂在花洒一侧。通电只亮指示灯，不把整间浴室烤红。
// 横挂：罐体沿本地 x，指示灯朝本地 -z（贴墙装在 +z 一侧的墙上）。
function StorageHeater({ id, position, rotation }) {
  const e = useHA((s) => s.entities[id])
  const on = isOn(e)
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 20]} />
        <meshStandardMaterial color="#e7e1d8" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.155, 0.155, 0.08, 20]} />
        <meshStandardMaterial color="#8d8680" roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[0.12, -0.08, -0.14]}>
        <sphereGeometry args={[0.022, 12, 10]} />
        <meshStandardMaterial
          color={on ? '#e5b571' : '#6d675f'}
          emissive={on ? '#e5b571' : '#000000'}
          emissiveIntensity={on ? 2.2 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// 大门电子锁装在门扇内侧（本地 -z 朝屋内），可视门铃在门外门框旁（朝 +z），室内小屏在玄关墙上（朝 +z）。
function DoorLock({ id, position, rotation }) {
  const lock = useHA((s) => s.entities[id])
  const led = lock?.state === 'locked' ? '#58c191' : '#e5b571'
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.16, 0.28, 0.045]} radius={0.012} smoothness={2} castShadow>
        <meshStandardMaterial color="#2a2e33" roughness={0.4} metalness={0.55} />
      </RoundedBox>
      <mesh position={[0, 0.04, -0.03]}>
        <sphereGeometry args={[0.016, 12, 10]} />
        <meshStandardMaterial color={led} emissive={led} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Doorbell({ id, position, rotation }) {
  const live = isOn(useHA((s) => s.entities[id]))
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.09, 0.16, 0.04]} radius={0.01} smoothness={2} castShadow>
        <meshStandardMaterial color="#23272b" roughness={0.45} metalness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.03, 0.025]}>
        <circleGeometry args={[0.018, 16]} />
        <meshStandardMaterial color="#1a3a5c" emissive={live ? '#7eb6ff' : '#102033'} emissiveIntensity={live ? 1.4 : 0.2} />
      </mesh>
    </group>
  )
}

function Monitor({ id, position, rotation }) {
  const live = isOn(useHA((s) => s.entities[id]))
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.11, 0.16, 0.02]} radius={0.006} smoothness={2}>
        <meshStandardMaterial color="#2c3136" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.08, 0.11]} />
        <meshStandardMaterial
          color={live ? '#14324f' : '#1a1e22'}
          emissive={live ? '#6aa8e8' : '#000000'}
          emissiveIntensity={live ? 0.8 : 0}
        />
      </mesh>
    </group>
  )
}

const KINDS = { split: SplitUnit, fan: CeilingFan, heater: StorageHeater, lock: DoorLock, doorbell: Doorbell, monitor: Monitor }

// 设备摆位按户型写在 plans/<户型>.json 的 devices 里，rot 为角度
export default function Devices() {
  const { devices = [] } = usePlan()
  return (
    <group>
      {devices.map((d, i) => {
        const Kind = KINDS[d.type]
        return Kind ? (
          <Kind key={i} id={d.id} position={d.pos} rotation={[0, ((d.rot ?? 0) * Math.PI) / 180, 0]} scale={d.scale} />
        ) : null
      })}
    </group>
  )
}

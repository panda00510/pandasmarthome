import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useHA, isOn } from '../ha/store'
import { damp } from './utils'

// 壁挂空调：开机时导风叶片打开，并向下送出一层冷色微光
function AirConditioner() {
  const e = useHA((s) => s.entities['climate.living_ac'])
  const vane = useRef()
  const glow = useRef()
  const lvl = useRef(0)

  useFrame((_, dt) => {
    const on = isOn(e) ? 1 : 0
    lvl.current = damp(lvl.current, on, 5, dt)
    if (vane.current) vane.current.rotation.x = -lvl.current * 0.9
    if (glow.current) {
      glow.current.material.opacity = lvl.current * 0.11
      glow.current.visible = lvl.current > 0.02
    }
  })

  return (
    <group position={[-1.2, 2.3, -3.4]}>
      <RoundedBox args={[0.24, 0.32, 1.15]} radius={0.05} smoothness={3} castShadow>
        <meshStandardMaterial color="#f3f1ec" roughness={0.5} />
      </RoundedBox>
      <mesh ref={vane} position={[0, -0.15, 0]}>
        <boxGeometry args={[0.2, 0.03, 1.05]} />
        <meshStandardMaterial color="#dcd8d2" roughness={0.5} />
      </mesh>
      <mesh ref={glow} position={[-0.5, -0.75, 0]} rotation={[0, 0, 0.5]}>
        <planeGeometry args={[1.4, 1.3]} />
        <meshBasicMaterial color="#8fd4ff" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// 新风出风口：开启时扇叶缓慢旋转
function FreshAir() {
  const e = useHA((s) => s.entities['fan.fresh_air'])
  const blade = useRef()
  const spd = useRef(0)
  useFrame((_, dt) => {
    const target = isOn(e) ? (e.attributes.percentage ?? 50) / 100 : 0
    spd.current = damp(spd.current, target, 3, dt)
    if (blade.current) blade.current.rotation.z += spd.current * dt * 6
  })
  return (
    <group position={[-8.87, 2.35, 2.6]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[0.62, 0.42, 0.08]} />
        <meshStandardMaterial color="#e4e0d9" roughness={0.7} />
      </mesh>
      <group ref={blade} position={[0, 0, 0.06]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <boxGeometry args={[0.3, 0.05, 0.02]} />
            <meshStandardMaterial color="#9aa0a6" roughness={0.5} metalness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// 地暖：开启时卧室地面透出一层暖光
function FloorHeating() {
  const e = useHA((s) => s.entities['switch.floor_heating'])
  const ref = useRef()
  const lvl = useRef(0)
  useFrame((_, dt) => {
    lvl.current = damp(lvl.current, isOn(e) ? 1 : 0, 3, dt)
    if (ref.current) {
      ref.current.material.opacity = lvl.current * 0.27
      ref.current.visible = lvl.current > 0.02
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.03, -2.75]}>
      <planeGeometry args={[4.8, 5.3]} />
      <meshBasicMaterial color="#ff8c4a" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

export default function Devices() {
  return (
    <group>
      <AirConditioner />
      <FreshAir />
      <FloorHeating />
    </group>
  )
}

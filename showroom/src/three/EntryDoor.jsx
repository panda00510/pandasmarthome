import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useHA } from '../ha/store'
import { getMat } from './materials'
import { damp } from './utils'
import { DoorFrame, DoorLeaf } from './Shell'
import { shadowDirty } from './shadowBus'

// 组屋大门：门扇跟着门磁 binary_sensor.entry_door 开合（向屋内开），
// 电子锁锁体装在门扇内侧，随门一起转；锁面毫米级指示点：上锁红、开锁绿（不发光照明、不进 Bloom）。
// 开锁 → 门打开 → 几秒后关门 → 自动上锁，这条联动在 store.js 里（和真实电子锁的自动反锁一致）。
const OPEN_ANGLE = 0.36 * Math.PI

export default function EntryDoor(props) {
  const door = useHA((s) => s.entities['binary_sensor.entry_door'])
  const lock = useHA((s) => s.entities['lock.entry'])
  const leaf = useRef()
  const a = useRef(0)
  const base = props.axis === 'x' ? Math.PI / 2 : 0

  useFrame((_, dt) => {
    const target = door?.state === 'on' ? OPEN_ANGLE : 0
    a.current = damp(a.current, target, 2.6, dt)
    if (leaf.current) leaf.current.rotation.y = base + a.current
    if (Math.abs(a.current - target) > 0.001) {
      const mid = (props.from + props.to) / 2
      shadowDirty(props.axis === 'x' ? mid : props.at, 1, props.axis === 'x' ? props.at : mid)
    }
  })

  const len = props.to - props.from - 0.04
  const locked = lock?.state !== 'unlocked'
  const led = locked ? '#b8392c' : '#3fae6e'
  const y = 1.05 - (props.height / 2 - 0.02)

  return (
    <group>
      <DoorFrame {...props} kind="entry" />
      <DoorLeaf {...props} kind="entry" leafRef={leaf} handles={false}>
        {/* 室内侧锁体（本地 +x 朝屋内） */}
        <group position={[0.025 + 0.022, y, len - 0.17]} rotation={[0, Math.PI / 2, 0]}>
          <RoundedBox args={[0.075, 0.3, 0.04]} radius={0.01} smoothness={2} castShadow material={getMat('blackMetal', { roughness: 0.35 })} />
          <mesh position={[0, -0.02, 0.035]} rotation={[0, 0, Math.PI / 2]} material={getMat('steel')}>
            <cylinderGeometry args={[0.012, 0.012, 0.11, 10]} />
          </mesh>
          <mesh position={[0, 0.1, 0.021]}>
            <circleGeometry args={[0.005, 16]} />
            <meshBasicMaterial color={led} toneMapped={false} />
          </mesh>
        </group>
        {/* 室外侧：密码面板 + 拉手 */}
        <group position={[-0.025 - 0.02, y, len - 0.17]} rotation={[0, -Math.PI / 2, 0]}>
          <RoundedBox args={[0.07, 0.26, 0.03]} radius={0.01} smoothness={2} castShadow material={getMat('blackMetal', { roughness: 0.2 })} />
          <mesh position={[0, 0.04, 0.016]} material={getMat('screen')}>
            <planeGeometry args={[0.05, 0.08]} />
          </mesh>
          <mesh position={[0, -0.06, 0.016]}>
            <circleGeometry args={[0.004, 12]} />
            <meshBasicMaterial color={led} toneMapped={false} />
          </mesh>
        </group>
      </DoorLeaf>
    </group>
  )
}

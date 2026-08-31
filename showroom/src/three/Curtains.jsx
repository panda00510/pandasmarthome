import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlaneGeometry, DoubleSide } from 'three'
import { useHA } from '../ha/store'
import { damp } from './utils'
import { getTextures, tiled } from './textures'

const FOLDS = 7        // 褶皱数
const SEGMENTS = 40    // 横向细分，够画出圆滑的波

// 窗帘不是平板：布收拢时褶皱变深变密，展开时几乎摊平。
// 每帧按开合度重算顶点位移，这个几何很小，开销可以忽略。
function makeGeometry(height) {
  const g = new PlaneGeometry(1, height, SEGMENTS, 1)
  g.userData.base = Float32Array.from(g.attributes.position.array)
  return g
}

function Curtain({ entityId, x0, x1, z, top = 2.45, bottom = 0.04, color = '#e6ded1' }) {
  const entity = useHA((s) => s.entities[entityId])
  const h = top - bottom
  const half = (x1 - x0) / 2
  const openW = 0.3

  const maps = useMemo(() => tiled(getTextures().curtain, 2.2, Math.max(1, h / 0.5)), [h])
  const geoL = useMemo(() => makeGeometry(h), [h])
  const geoR = useMemo(() => makeGeometry(h), [h])

  const left = useRef()
  const right = useRef()
  const p = useRef(entity.attributes.current_position / 100)

  useFrame((_, dt) => {
    p.current = damp(p.current, entity.attributes.current_position / 100, 4.5, dt)
    const w = half + (openW - half) * p.current
    // 0 = 完全摊开, 1 = 完全收拢
    const gather = half > openW ? 1 - (w - openW) / (half - openW) : 1
    const amp = 0.015 + gather * 0.085

    const panels = [
      [left, geoL, x0 + w / 2],
      [right, geoR, x1 - w / 2],
    ]
    for (const [ref, geo, cx] of panels) {
      if (!ref.current) continue
      ref.current.scale.x = w
      ref.current.position.x = cx

      const attr = geo.attributes.position
      const base = geo.userData.base
      for (let i = 0; i < attr.count; i++) {
        const u = base[i * 3] + 0.5 // 0..1
        // 边缘收窄，避免布料在两端穿出窗框
        const edge = Math.sin(u * Math.PI)
        attr.array[i * 3 + 2] = Math.sin(u * Math.PI * 2 * FOLDS) * amp * edge
      }
      attr.needsUpdate = true
      geo.computeVertexNormals()
    }
  })

  return (
    <group>
      {/* 窗帘杆 */}
      <mesh position={[(x0 + x1) / 2, top + 0.09, z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, x1 - x0 + 0.3, 10]} />
        <meshStandardMaterial color="#4a4038" roughness={0.45} metalness={0.55} />
      </mesh>

      {[[left, geoL], [right, geoR]].map(([ref, geo], i) => (
        <mesh
          key={i}
          ref={ref}
          geometry={geo}
          position={[0, bottom + h / 2, z]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            roughness={0.98}
            metalness={0}
            side={DoubleSide}
            normalScale={[1.2, 1.2]}
            {...maps}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function Curtains() {
  return (
    <group>
      <Curtain entityId="cover.living_curtain" x0={-8.4} x1={-2.2} z={5.28} top={2.5} />
      <Curtain entityId="cover.second_curtain" x0={0.0} x1={3.4} z={5.28} top={2.5} color="#d8cfc2" />
      <Curtain entityId="cover.bedroom_curtain" x0={0.0} x1={3.4} z={-5.28} top={2.45} color="#d8cfc2" />
    </group>
  )
}

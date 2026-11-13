import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlaneGeometry } from 'three'
import { useHA, usePlan } from '../ha/store'
import { damp } from './utils'
import { getMat } from './materials'

const FOLDS = 7        // 褶皱数
const SEGMENTS = 40    // 横向细分，够画出圆滑的波

// 窗帘不是平板：布收拢时褶皱变深变密，展开时几乎摊平。
// 每帧按开合度重算顶点位移，这个几何很小，开销可以忽略。
function makeGeometry(height) {
  const g = new PlaneGeometry(1, height, SEGMENTS, 1)
  g.userData.base = Float32Array.from(g.attributes.position.array)
  // 布纹按米：横向按收拢前的整幅宽（约 1.6 m，褶皱里布更多），纵向按高度
  const uv = g.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 1.6, uv.getY(i) * height)
  return g
}

function Curtain({ entityId, x0, x1, z, top = 2.45, bottom = 0.04, color = '#e6ded1' }) {
  const entity = useHA((s) => s.entities[entityId])
  const h = top - bottom
  const half = (x1 - x0) / 2
  const openW = 0.3

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
    // 停稳后不再每帧重算顶点和法线
    if (Math.abs(amp - (left.current?.userData.amp ?? -1)) < 1e-5) return
    if (left.current) left.current.userData.amp = amp

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
      <mesh position={[(x0 + x1) / 2, top + 0.09, z]} rotation={[0, 0, Math.PI / 2]} material={getMat('brass', { color: '#4a4038' })}>
        <cylinderGeometry args={[0.022, 0.022, x1 - x0 + 0.3, 10]} />
      </mesh>

      {[[left, geoL], [right, geoR]].map(([ref, geo], i) => (
        <mesh
          key={i}
          ref={ref}
          geometry={geo}
          position={[0, bottom + h / 2, z]}
          castShadow
          receiveShadow
          material={getMat('curtain', { color })}
        />
      ))}
    </group>
  )
}

export default function Curtains() {
  const { curtains = [] } = usePlan()
  return (
    <group>
      {curtains.map((c) => (
        <Curtain key={c.id} entityId={c.id} x0={c.x0} x1={c.x1} z={c.z} top={c.top} color={c.color} />
      ))}
    </group>
  )
}

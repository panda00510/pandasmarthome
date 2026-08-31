import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { PLAN, MAT } from './utils'
import { getTextures, tiled } from './textures'
import BakedShell from './BakedShell'

// 墙体与地面全部来自 Blender 烘焙好的整屋壳体（BakedShell）。
// 这里只补壳体里没有的东西：玻璃、门扇、地台、地毯。

function Glass({ axis, at, from, to, y0, y1 }) {
  const len = to - from
  const h = y1 - y0
  const mid = (from + to) / 2
  const midY = (y0 + y1) / 2
  return (
    <mesh position={axis === 'x' ? [mid, midY, at] : [at, midY, mid]}>
      <boxGeometry args={axis === 'x' ? [len, h, 0.03] : [0.03, h, len]} />
      <meshStandardMaterial
        color={MAT.glass}
        roughness={0.08}
        metalness={0.1}
        transparent
        opacity={0.16}
        depthWrite={false}
      />
    </mesh>
  )
}

// 门洞空着整个户型像未完工。做成半开，既有实物感又不挡 dollhouse 视线。
function Door({ axis, at, from, to, height = 2.1, open = 0.32, swing = -1 }) {
  const leaf = (to - from) - 0.04
  const T = 0.21
  const frame = (pos, size) => (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#d9d2c6" roughness={0.75} />
    </mesh>
  )
  const isX = axis === 'x'
  return (
    <group>
      {frame(isX ? [from, height / 2, at] : [at, height / 2, from], isX ? [0.055, height + 0.06, T] : [T, height + 0.06, 0.055])}
      {frame(isX ? [to, height / 2, at] : [at, height / 2, to], isX ? [0.055, height + 0.06, T] : [T, height + 0.06, 0.055])}
      {frame(isX ? [(from + to) / 2, height + 0.03, at] : [at, height + 0.03, (from + to) / 2],
             isX ? [to - from, 0.06, T] : [T, 0.06, to - from])}

      <group
        position={isX ? [from + 0.03, height / 2 - 0.02, at] : [at, height / 2 - 0.02, from + 0.03]}
        rotation={[0, isX ? Math.PI / 2 + swing * open * Math.PI : swing * open * Math.PI, 0]}
      >
        <RoundedBox args={[0.042, height - 0.06, leaf]} radius={0.012} smoothness={2}
          position={[0, 0, leaf / 2]} castShadow receiveShadow>
          <meshStandardMaterial color="#e6dfd3" roughness={0.72} />
        </RoundedBox>
        <mesh position={[0.055, -0.02, leaf - 0.13]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.11, 10]} />
          <meshStandardMaterial color="#8d8378" roughness={0.35} metalness={0.75} />
        </mesh>
      </group>
    </group>
  )
}

function Rug({ x, z, w, d, tex = 'rug', color = '#ffffff' }) {
  const maps = useMemo(() => tiled(getTextures()[tex], w / 1.6, d / 1.6), [tex, w, d])
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.014, z]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} normalScale={[0.9, 0.9]} {...maps} />
    </mesh>
  )
}

export default function Shell() {
  const glass = useMemo(
    () => [...PLAN.exterior, ...PLAN.interior].flatMap((w) =>
      (w.holes ?? []).filter((h) => h.glass).map((h) => ({ axis: w.axis, at: w.at, ...h }))
    ),
    []
  )
  const doors = useMemo(
    () => PLAN.interior.flatMap((w) =>
      (w.holes ?? []).filter((h) => h.door).map((h) => ({ axis: w.axis, at: w.at, ...h }))
    ),
    []
  )

  return (
    <group>
      {/* 地台：房子坐落在一块独立基座上，背景保持干净 */}
      <mesh receiveShadow castShadow position={[0, -0.17, 0]}>
        <boxGeometry args={[PLAN.width + 1.2, 0.3, PLAN.depth + 1.2]} />
        <meshStandardMaterial color="#3d4148" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, -0.015, 0]}>
        <boxGeometry args={[PLAN.width + 0.5, 0.02, PLAN.depth + 0.5]} />
        <meshStandardMaterial color="#cdc7bd" roughness={0.95} />
      </mesh>

      <BakedShell />

      {glass.map((g, i) => (
        <Glass key={i} axis={g.axis} at={g.at} from={g.from} to={g.to} y0={g.y0} y1={g.y1} />
      ))}
      {doors.map((d, i) => (
        <Door key={i} axis={d.axis} at={d.at} from={d.from} to={d.to} height={d.y1} />
      ))}

      <Rug x={-5.4} z={-0.4} w={4.6} d={3.2} />
      <Rug x={1.5} z={-1.4} w={2.4} d={1.8} color="#b3a897" />
      <Rug x={1.4} z={4.4} w={2.0} d={1.5} color="#a8a196" />
    </group>
  )
}

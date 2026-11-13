import { lazy, Suspense, useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { MAT } from './utils'
import { usePlan } from '../ha/store'
import { getTextures, tiled } from './textures'
import ProceduralShell from './ProceduralShell'

// 只有 plan.gi === 'baked' 且贴图与当前户型同时烘过才挂烘焙壳体。
// 动态导入，避免把上一版户型的 glb / lightmap 打进默认包并画错墙。
const BakedShell = lazy(() => import('./BakedShell'))

// 墙体与地面：gi=baked 时用 Blender 壳体，否则按 plans/<户型>.json 实时生成（ProceduralShell）。
// 这里另外补玻璃、门扇、地台、地毯。

const ALU = '#55595e'        // HDB 常见的灰色铝合金窗框
const SILL = '#d8d2c8'       // 窗台石

// 窗：铝合金框 + 中梃（推拉窗两扇），离地窗下有内外窗台。slider = 落地推拉门。
function Glass({ axis, at, from, to, y0, y1, T, slider }) {
  const len = to - from
  const h = y1 - y0
  const mid = (from + to) / 2
  const midY = (y0 + y1) / 2
  const isX = axis === 'x'
  const place = (u, y) => (isX ? [u, y, at] : [at, y, u])
  const size = (l, hh, d) => (isX ? [l, hh, d] : [d, hh, l])
  const bar = 0.045
  const bars = [
    [place(mid, y1 - bar / 2), size(len, bar, 0.06)],
    [place(mid, y0 + bar / 2), size(len, bar, 0.06)],
    [place(from + bar / 2, midY), size(bar, h, 0.06)],
    [place(to - bar / 2, midY), size(bar, h, 0.06)],
  ]
  // 推拉扇：宽窗分两扇或三扇，中梃稍错开一点，像两条轨道上的扇
  const panes = slider ? Math.max(2, Math.round(len / 1.1)) : len > 0.75 ? 2 : 1
  for (let i = 1; i < panes; i++) bars.push([place(from + (len * i) / panes, midY), size(0.035, h, 0.07)])
  return (
    <group>
      <mesh position={place(mid, midY)}>
        <boxGeometry args={size(len, h, 0.02)} />
        <meshStandardMaterial color={MAT.glass} roughness={0.06} metalness={0.1} transparent opacity={0.16} depthWrite={false} />
      </mesh>
      {bars.map(([p, sz], i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={sz} />
          <meshStandardMaterial color={ALU} roughness={0.38} metalness={0.7} />
        </mesh>
      ))}
      {y0 > 0.3 && (
        <mesh position={place(mid, y0 - 0.018)} castShadow receiveShadow>
          <boxGeometry args={size(len + 0.1, 0.036, T + 0.1)} />
          <meshStandardMaterial color={SILL} roughness={0.5} />
        </mesh>
      )}
    </group>
  )
}

// 阳台矮墙压顶 + 不锈钢扶手
function Rail({ axis, at, from, to, y0, T }) {
  const len = to - from
  const mid = (from + to) / 2
  const isX = axis === 'x'
  const place = (y) => (isX ? [mid, y, at] : [at, y, mid])
  const size = (hh, d) => (isX ? [len, hh, d] : [d, hh, len])
  return (
    <group>
      <mesh position={place(y0 - 0.02)} castShadow receiveShadow>
        <boxGeometry args={size(0.04, T + 0.08)} />
        <meshStandardMaterial color={SILL} roughness={0.5} />
      </mesh>
      <mesh position={place(y0 + 0.08)} castShadow>
        <boxGeometry args={size(0.035, 0.05)} />
        <meshStandardMaterial color="#b8bcc0" roughness={0.25} metalness={0.85} />
      </mesh>
    </group>
  )
}

const DOOR_LOOK = {
  // 组屋大门：实木门 + 门外铁闸
  entry: { leaf: '#5d4636', frame: '#4a3a2e', thick: 0.05, r: 0.55 },
  // 避难所：厚钢门，喷漆
  shelter: { leaf: '#9aa1a5', frame: '#878e93', thick: 0.07, r: 0.45, m: 0.55 },
}

function Door({ axis, at, from, to, height = 2.1, open = 0.32, swing = -1, kind }) {
  const look = DOOR_LOOK[kind] ?? { leaf: '#e6dfd3', frame: '#d9d2c6', thick: 0.042, r: 0.72 }
  const leaf = (to - from) - 0.04
  const T = 0.21
  const frame = (pos, size) => (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={look.frame} roughness={0.7} metalness={look.m ?? 0} />
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
        <RoundedBox args={[look.thick, height - 0.06, leaf]} radius={0.012} smoothness={2}
          position={[0, 0, leaf / 2]} castShadow receiveShadow>
          <meshStandardMaterial color={look.leaf} roughness={look.r} metalness={look.m ?? 0} />
        </RoundedBox>
        {[1, -1].map((side) => (
          <mesh key={side} position={[side * (look.thick / 2 + 0.03), -0.02, leaf - 0.13]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.11, 10]} />
            <meshStandardMaterial color="#8d8378" roughness={0.35} metalness={0.75} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// 门外铁闸：组屋大门标配，竖向扁钢 + 上下横档
function Gate({ axis, at, from, to, height, out }) {
  const isX = axis === 'x'
  const off = at + out * 0.14
  const place = (u, y) => (isX ? [u, y, off] : [off, y, u])
  const len = to - from
  const n = Math.round(len / 0.11)
  const mat = <meshStandardMaterial color="#2c2e31" roughness={0.45} metalness={0.6} />
  return (
    <group>
      {[0.12, height / 2, height - 0.08].map((y) => (
        <mesh key={y} position={place((from + to) / 2, y)} castShadow>
          <boxGeometry args={isX ? [len, 0.04, 0.03] : [0.03, 0.04, len]} />
          {mat}
        </mesh>
      ))}
      {Array.from({ length: n + 1 }, (_, i) => from + (len * i) / n).map((u) => (
        <mesh key={u} position={place(u, height / 2)} castShadow>
          <boxGeometry args={isX ? [0.018, height - 0.04, 0.03] : [0.03, height - 0.04, 0.018]} />
          {mat}
        </mesh>
      ))}
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
  const PLAN = usePlan()
  const [cx, cz] = PLAN.center ?? [0, 0]
  const holes = useMemo(
    () => [...PLAN.exterior.map((w) => ({ ...w, ext: true })), ...PLAN.interior].flatMap((w) =>
      (w.holes ?? []).map((h) => ({
        axis: w.axis,
        at: w.at,
        T: w.thickness || PLAN.wallT,
        // 外墙洞口朝外的方向（铁闸装在外侧）
        out: w.ext ? Math.sign(w.at - (w.axis === 'x' ? cz : cx)) : 0,
        ...h,
      }))
    ),
    [PLAN, cx, cz]
  )

  return (
    <group>
      {/* 地台：房子坐落在一块独立基座上，背景保持干净 */}
      <mesh receiveShadow castShadow position={[cx, -0.17, cz]}>
        <boxGeometry args={[PLAN.width + 1.2, 0.3, PLAN.depth + 1.2]} />
        <meshStandardMaterial color="#3d4148" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[cx, -0.015, cz]}>
        <boxGeometry args={[PLAN.width + 0.5, 0.02, PLAN.depth + 0.5]} />
        <meshStandardMaterial color="#cdc7bd" roughness={0.95} />
      </mesh>

      {PLAN.gi === 'baked' ? (
        <Suspense fallback={null}>
          <BakedShell />
        </Suspense>
      ) : (
        <ProceduralShell />
      )}

      {holes.filter((h) => h.glass).map((g, i) => (
        <Glass key={i} {...g} />
      ))}
      {holes.filter((h) => h.rail).map((g, i) => (
        <Rail key={i} {...g} />
      ))}
      {holes.filter((h) => h.door).map((d, i) => (
        <Door key={i} axis={d.axis} at={d.at} from={d.from} to={d.to} height={d.y1} open={d.open ?? 0.32} swing={d.swing ?? -1} kind={d.door} />
      ))}
      {holes.filter((h) => h.door === 'entry').map((d, i) => (
        <Gate key={i} axis={d.axis} at={d.at} from={d.from} to={d.to} height={d.y1} out={d.out || 1} />
      ))}

      {(PLAN.rugs ?? []).map((r, i) => (
        <Rug key={i} {...r} />
      ))}
    </group>
  )
}

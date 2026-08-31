import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, TransformControls } from '@react-three/drei'
import { useHA, isOn } from '../ha/store'
import { stateText } from '../ha/format'
import { useT } from '../i18n'
import Icon, { iconFor } from '../ui/icons'
import { damp } from './utils'
import { useIsMobile } from '../hooks'

// 每个可控实体在 3D 空间里的锚点。开启标定模式后可拖动，坐标可导出回这张表。
export const HOTSPOTS = [
  { id: 'light.living_main', pos: [-5.4, 2.44, -1.6] },
  { id: 'light.living_strip', pos: [-4.2, 2.62, -5.28] },
  { id: 'light.dining_pendant', pos: [-4.6, 2.16, 3.3] },
  { id: 'light.living_floor', pos: [-8.1, 1.82, 0.6] },
  { id: 'media_player.living_tv', pos: [-5.4, 2.18, -5.2] },
  { id: 'cover.living_curtain', pos: [-6.6, 2.66, 5.28] },
  { id: 'climate.living_ac', pos: [-1.2, 2.5, -3.4] },
  { id: 'fan.fresh_air', pos: [-8.87, 2.62, 2.6] },

  { id: 'light.bedroom_main', pos: [1.5, 2.44, -3.0] },
  { id: 'light.bedroom_bedside', pos: [0.15, 0.86, -4.7] },
  { id: 'cover.bedroom_curtain', pos: [2.2, 2.5, -5.28] },
  { id: 'switch.floor_heating', pos: [2.9, 0.35, -1.4] },

  { id: 'light.second_main', pos: [1.5, 2.44, 3.5] },
  { id: 'cover.second_curtain', pos: [2.2, 2.6, 5.28] },

  { id: 'light.kitchen_spot', pos: [6.5, 2.44, -2.6] },
  { id: 'light.bath_mirror', pos: [6.5, 2.05, 5.2] },
  { id: 'light.hall_down', pos: [4.0, 2.44, 0.75] },
]

function Hotspot({ conf }) {
  const entity = useHA((s) => s.entities[conf.id])
  const toggle = useHA((s) => s.toggle)
  const setSelected = useHA((s) => s.setSelected)
  const selected = useHA((s) => s.selected)
  const showLabels = useHA((s) => s.showLabels)
  const calibrating = useHA((s) => s.calibrating)
  const calibTarget = useHA((s) => s.calibTarget)
  const setCalibTarget = useHA((s) => s.setCalibTarget)
  const setHotspotPos = useHA((s) => s.setHotspotPos)
  const override = useHA((s) => s.hotspotOverrides[conf.id])

  const t = useT()
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState(false)
  const group = useRef()
  const dot = useRef()
  const scale = useRef(1)

  const on = isOn(entity)
  const isCalibTarget = calibrating && calibTarget === conf.id
  const active = selected === conf.id || isCalibTarget
  const visible = showLabels || hovered || active
  const pos = override ?? conf.pos

  // 之前这里让亮着的锚点做呼吸缩放，但小球是自发光的、会被 Bloom 拾取，
  // 缩放一变光晕就跟着胀缩 —— 六个锚点同频跳动，看起来就是整个画面在闪。
  // 样板间要的是安静，动效只留 hover/选中的响应。
  useFrame((_, dt) => {
    const target = hovered || active ? 1.55 : 1
    scale.current = damp(scale.current, target, 10, dt)
    if (dot.current) dot.current.scale.setScalar(scale.current)
  })

  const color = calibrating ? (isCalibTarget ? '#86a9b4' : '#8a8175') : on ? '#e5b571' : '#7b7267'

  const handleClick = (e) => {
    e.stopPropagation()
    if (calibrating) setCalibTarget(isCalibTarget ? null : conf.id)
    else toggle(conf.id)
  }

  return (
    <>
      <group ref={group} position={pos}>
      <mesh
        ref={dot}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[isMobile ? 0.11 : 0.075, 18, 14]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={on || isCalibTarget ? 2.4 : 0.5}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={2.6}>
        <sphereGeometry args={[isMobile ? 0.11 : 0.075, 12, 10]} />
        <meshBasicMaterial color={color} transparent opacity={on || isCalibTarget ? 0.13 : 0.06} depthWrite={false} />
      </mesh>

        {visible && (
          <Html position={[0, 0.2, 0]} center zIndexRange={[8, 0]}>
            <button
              className={`hotspot-label${on ? ' is-on' : ''}${active ? ' is-active' : ''}`}
              onClick={(ev) => {
                ev.stopPropagation()
                if (calibrating) setCalibTarget(isCalibTarget ? null : conf.id)
                else setSelected(selected === conf.id ? null : conf.id)
              }}
            >
              <Icon name={iconFor(conf.id, entity.domain)} size={14} />
              <span className="hotspot-text">
                <em>{t.pick(entity.name)}</em>
                <i>{calibrating ? pos.map((n) => Number(n).toFixed(2)).join(', ') : stateText(entity, t)}</i>
              </span>
            </button>
          </Html>
        )}
      </group>

      {isCalibTarget && (
        <TransformControls
          object={group}
          mode="translate"
          size={0.6}
          onMouseUp={() => {
            const p = group.current.position
            setHotspotPos(conf.id, [p.x, p.y, p.z])
          }}
        />
      )}
    </>
  )
}

export default function Hotspots() {
  return (
    <group>
      {HOTSPOTS.map((conf) => (
        <Hotspot key={conf.id} conf={conf} />
      ))}
    </group>
  )
}

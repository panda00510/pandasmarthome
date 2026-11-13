import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, TransformControls, Billboard } from '@react-three/drei'
import { useHA, isOn, usePlan } from '../ha/store'
import { stateText } from '../ha/format'
import { useT } from '../i18n'
import Icon, { iconFor } from '../ui/icons'
import { damp } from './utils'
import { useIsMobile } from '../hooks'

// 每个可控实体在 3D 空间里的锚点在 plans/<户型>.json 的 hotspots 里。
// 开启标定模式后可拖动，坐标可导出回那张表。
// 选中房间视角时只亮出该视角 area 里前几个设备的标签。
const ROOM_LABEL_LIMIT = 5

function Hotspot({ conf, rank }) {
  const entity = useHA((s) => s.entities[conf.id])
  const toggle = useHA((s) => s.toggle)
  const setSelected = useHA((s) => s.setSelected)
  const selected = useHA((s) => s.selected)
  const showLabels = useHA((s) => s.showLabels)
  const view = useHA((s) => s.view)
  const calibrating = useHA((s) => s.calibrating)
  const calibTarget = useHA((s) => s.calibTarget)
  const setCalibTarget = useHA((s) => s.setCalibTarget)
  const setHotspotPos = useHA((s) => s.setHotspotPos)
  const override = useHA((s) => s.hotspotOverrides[`${s.planId}:${conf.id}`])
  const plan = usePlan()

  const t = useT()
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState(false)
  const group = useRef()
  const dot = useRef()
  const scale = useRef(1)

  const on = isOn(entity)
  const isCalibTarget = calibrating && calibTarget === conf.id
  const active = selected === conf.id || isCalibTarget
  const inRoom = plan.views[view]?.area === entity.area && rank < ROOM_LABEL_LIMIT
  const visible = showLabels || hovered || active || inRoom
  const pos = override ?? conf.pos

  // 之前这里让亮着的锚点做呼吸缩放，但小球是自发光的、会被 Bloom 拾取，
  // 缩放一变光晕就跟着胀缩 —— 六个锚点同频跳动，看起来就是整个画面在闪。
  // 样板间要的是安静，动效只留 hover/选中的响应。
  useFrame((_, dt) => {
    const target = hovered || active ? 1.55 : 1
    scale.current = damp(scale.current, target, 10, dt)
    if (dot.current) dot.current.scale.setScalar(scale.current)
  })

  // 热点只是"可点击的标记"，不是灯：不自发光、不进 Bloom（颜色值都压在 Bloom 阈值以下），
  // 开 / 关只用颜色区分 —— 开 = 琥珀实心 + 琥珀描边，关 = 灰色。
  // 以前这里 emissiveIntensity 2.4 + 一个半透明光晕球，被 Bloom 放大后，
  // 电视、空调、窗帘、门锁、门铃"开"的时候各自旁边都像多了一盏灯 —— 就是这一处通用代码。
  const color = calibrating ? (isCalibTarget ? '#86a9b4' : '#8a8175') : on ? '#c99a5c' : '#6f675d'

  const handleClick = (e) => {
    e.stopPropagation()
    if (calibrating) setCalibTarget(isCalibTarget ? null : conf.id)
    else toggle(conf.id)
  }

  return (
    <>
      <group ref={group} position={pos}>
      {/* 点击判定用的透明球，比可见圆点大一圈，好点 */}
      <mesh
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
        <sphereGeometry args={[isMobile ? 0.12 : 0.08, 10, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[isMobile ? 0.07 : 0.045, 18, 14]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* 描边环：始终朝向相机，标记"这里可以点"，本身不发光 */}
      <Billboard>
        <mesh>
          <ringGeometry args={[isMobile ? 0.085 : 0.058, isMobile ? 0.1 : 0.07, 32]} />
          <meshBasicMaterial color={on ? '#d7b07a' : '#d8d0c4'} transparent opacity={on ? 0.85 : 0.5} depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>

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

// 同一区域里排第几（用实体 id 的区域前缀分组，如 light.living_main → living）
const areaOf = (id) => id.split('.')[1].split('_')[0]
const rankInArea = (list, i) => list.slice(0, i).filter((other) => areaOf(other.id) === areaOf(list[i].id)).length

export default function Hotspots() {
  const { hotspots } = usePlan()
  return (
    <group>
      {hotspots.map((conf, i) => (
        <Hotspot key={conf.id} conf={conf} rank={rankInArea(hotspots, i)} />
      ))}
    </group>
  )
}

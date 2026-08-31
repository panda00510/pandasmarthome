// 线性图标，24×24，stroke 跟随 currentColor。
// 用 SVG 而不是 emoji：emoji 在不同系统渲染差异大，且与克制的界面语气不合。

const PATHS = {
  // 设备
  bulb: 'M9.5 18.5h5M10.5 21.5h3M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.3.8.9.8 1.5v.7h6v-.7c0-.6.3-1.2.8-1.5A6.5 6.5 0 0 0 12 2.5z',
  strip: 'M2.5 7.5h19M6 11v1.8M10 11v2.6M14 11v2.6M18 11v1.8',
  floorLamp: 'M12 21.5v-9.5M8.5 21.5h7M7.5 12l2.2-6.5h4.6L16.5 12z',
  curtain: 'M3.5 3.5h17M20.5 20.5h-4M7.5 20.5h-4M7.5 3.5v17c1.2-1.4 1.8-3.2 1.8-5.7 0-3.3-1.8-3.6-1.8-6.3 0-2 .6-3.6 1.8-5M16.5 3.5v17c-1.2-1.4-1.8-3.2-1.8-5.7 0-3.3 1.8-3.6 1.8-6.3 0-2-.6-3.6-1.8-5',
  climate: 'M12 2.5v19M4.2 7l15.6 10M19.8 7L4.2 17M12 6.2l2.2-2.2M12 6.2L9.8 4M12 17.8l2.2 2.2M12 17.8L9.8 20',
  tv: 'M3.5 5.5h17v11h-17zM8.5 21h7M12 16.5V21',
  power: 'M12 3.5v8M7.6 6.4a7 7 0 1 0 8.8 0',
  fan: 'M2.5 8h11a3 3 0 1 0-3-3M2.5 12h15.5a3 3 0 1 1-3 3M2.5 16h9',
  // 传感器
  thermo: 'M14 14.9V4.5a2 2 0 1 0-4 0v10.4a4 4 0 1 0 4 0z',
  droplet: 'M12 21.5a6.9 6.9 0 0 0 6.9-6.9c0-4-6.9-12.1-6.9-12.1S5.1 10.6 5.1 14.6A6.9 6.9 0 0 0 12 21.5z',
  haze: 'M3 16.5h13M3 20h8M6.5 13a4.5 4.5 0 1 1 9 0M18 16.5h3M14 20h7',
  // 场景
  home: 'M3.5 10.8L12 3.5l8.5 7.3M6 9.3V20.5h12V9.3M10 20.5v-6h4v6',
  film: 'M3.5 5h17v14h-17zM8 5v14M16 5v14M3.5 9.3H8M3.5 14.7H8M16 9.3h4.5M16 14.7h4.5',
  dining: 'M5.5 2.5v7a2.2 2.2 0 0 0 4.4 0v-7M7.7 11.7v9.8M18.5 2.5c-1.7 0-3 2.3-3 5.6 0 2.5.9 4 2.2 4.4v9',
  moon: 'M20.3 14.7A8.6 8.6 0 0 1 9.3 3.7a8.6 8.6 0 1 0 11 11z',
  exit: 'M14.5 3.5h-9v17h9M14 12H5.5M9.5 8.5L6 12l3.5 3.5M18.5 3.5v17',
  // 视角
  cube: 'M12 2.8l8.5 4.8v8.8L12 21.2l-8.5-4.8V7.6zM12 12.2l8.5-4.6M12 12.2v9M12 12.2L3.5 7.6',
  sofa: 'M4.5 12V9.3a2 2 0 0 1 4 0V12M15.5 12V9.3a2 2 0 0 1 4 0V12M3 12h18v5.5H3zM6.5 17.5v2.5M17.5 17.5v2.5',
  bed: 'M3 19v-8h18v8M3 11V6M7 11V9.2a1 1 0 0 1 1-1h3.2a1 1 0 0 1 1 1V11M21 19v2M3 19v2',
  fridge: 'M6.5 3h11v18h-11zM6.5 10.5h11M9.5 6.3v2.2M9.5 13.5v2.6',
  // 工具
  tag: 'M20.4 13.2l-7.2 7.2a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.2 7.2a1.7 1.7 0 0 1 0 2.4zM7.6 7.6h.01',
  crosshair: 'M12 2.5v4.2M12 17.3v4.2M2.5 12h4.2M17.3 12h4.2M12 6.7a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6z',
  undo: 'M3.5 12a8.5 8.5 0 1 0 2.9-6.4L3 8.4M3 3.2v5.2h5.2',
  sun: 'M12 6.4a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2zM12 1.5v2.4M12 20.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M1.5 12h2.4M20.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7',
  chevron: 'M8.5 5.5l7 6.5-7 6.5',
  close: 'M5.5 5.5l13 13M18.5 5.5l-13 13',
  expand: 'M8.5 3.5H3.5V8.5M15.5 3.5h5V8.5M8.5 20.5H3.5V15.5M15.5 20.5h5V15.5',
  collapse: 'M3.5 8.5h5V3.5M20.5 8.5h-5V3.5M3.5 15.5h5v5M20.5 15.5h-5v5',
  sliders: 'M4 6.5h10M18 6.5h2M4 12h4M12 12h8M4 17.5h10M18 17.5h2M14.5 6.5a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0M8.5 12a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0M14.5 17.5a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0',
}

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.5 }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

// 实体 -> 图标：先看具体实体，再退到 domain
const BY_ENTITY = {
  'light.living_strip': 'strip',
  'light.living_floor': 'floorLamp',
  'light.bedroom_bedside': 'floorLamp',
  'sensor.living_temperature': 'thermo',
  'sensor.living_humidity': 'droplet',
  'sensor.living_pm25': 'haze',
}

const BY_DOMAIN = {
  light: 'bulb',
  cover: 'curtain',
  climate: 'climate',
  media_player: 'tv',
  switch: 'power',
  fan: 'fan',
  sensor: 'thermo',
}

export const iconFor = (id, domain) => BY_ENTITY[id] ?? BY_DOMAIN[domain] ?? 'power'

export const SCENE_ICON = {
  'scene.home': 'home',
  'scene.movie': 'film',
  'scene.dining': 'dining',
  'scene.sleep': 'moon',
  'scene.away': 'exit',
}

export const VIEW_ICON = {
  overview: 'cube',
  living: 'sofa',
  bedroom: 'bed',
  second: 'bed',
  kitchen: 'fridge',
  bath: 'droplet',
}

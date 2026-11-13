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
  lock: 'M8 11V8.2a4 4 0 0 1 8 0V11M6.5 11h11v9h-11z',
  doorbell: 'M9 10.5a3 3 0 0 1 6 0c0 3.2 1.6 4.2 1.6 4.2H7.4S9 13.7 9 10.5M10.2 18.2a1.8 1.8 0 0 0 3.6 0',
  heater: 'M8 4.5h8v15H8zM10.2 8h3.6M10.2 11.2h3.6M10.2 14.4h3.6',
  rack: 'M3.5 4.5h17M7 4.5v4M17 4.5v4M4.5 8.5h15M7.5 8.5l-1.5 7h4l-1-7M14.5 8.5l1 9h3l-1.5-9',
  vacuum: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 3.5v4',
  dehumid: 'M7 3.5h10v17H7zM9.5 7h5M12 11.5c-1.4 1.8-2.1 3-2.1 3.9a2.1 2.1 0 0 0 4.2 0c0-.9-.7-2.1-2.1-3.9z',
  plug: 'M9 3.5v4M15 3.5v4M6.5 7.5h11v4a5.5 5.5 0 0 1-11 0zM12 17v3.5',
  door: 'M6 20.5V3.5h12v17M3.5 20.5h17M14.5 12h.01',
  smoke: 'M12 3.5a8.5 3 0 1 0 0 6 8.5 3 0 0 0 0-6zM5 12.5c1.2 1 2.4 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0M5 16.5c1.2 1 2.4 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0',
  leak: 'M12 3c-2.6 3.4-4 5.7-4 7.5a4 4 0 0 0 8 0C16 8.7 14.6 6.4 12 3zM4 19.5c1.3 1 2.7 1 4 0s2.7-1 4 0 2.7 1 4 0 2.7-1 4 0',
  motion: 'M13.5 4.5a1.5 1.5 0 1 0 0 .01M10 21l2.2-6.5 2.8 2.5v4.5M8.5 11l3-3.5 3.5 1.5 2 3.5M12.2 14.5L11.5 8',
  auto: 'M12 3.5a8.5 8.5 0 1 0 8.5 8.5M20.5 3.5v5h-5M9 15.5l3-7.5 3 7.5M10.1 13h3.8',
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
  whatsapp: 'M5.2 18.6 3.6 21.2l2.7-1A8.4 8.4 0 1 0 5.2 18.6z',
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
  'switch.bath_heater': 'heater',
  'lock.entry': 'lock',
  'camera.entry_doorbell': 'doorbell',
  'fan.living_ceiling': 'fan',
  'fan.bedroom_ceiling': 'fan',
  'fan.second_ceiling': 'fan',
  'switch.mbath_heater': 'heater',
  'light.lounge_floor': 'floorLamp',
  'cover.yard_rack': 'rack',
  'fan.yard_rack_dry': 'fan',
  'binary_sensor.entry_door': 'door',
  'binary_sensor.kitchen_smoke': 'smoke',
  'binary_sensor.yard_leak': 'leak',
  'binary_sensor.hall_motion': 'motion',
  'input_boolean.hall_auto': 'auto',
  'vacuum.robot': 'vacuum',
  'humidifier.bedroom_dehumidifier': 'dehumid',
  'switch.tv_plug': 'plug',
  'switch.desk_plug': 'plug',
}

const BY_DOMAIN = {
  light: 'bulb',
  cover: 'curtain',
  climate: 'climate',
  media_player: 'tv',
  switch: 'power',
  fan: 'fan',
  sensor: 'thermo',
  binary_sensor: 'door',
  vacuum: 'vacuum',
  humidifier: 'dehumid',
  input_boolean: 'auto',
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

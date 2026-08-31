// 模拟 Home Assistant 实体注册表。
// 实体 ID / 属性名与真实 HA 保持一致，将来换成真设备时只需替换 store 的传输层。

export const AREAS = {
  living: { en: 'Living Room', zh: '客厅' },
  bedroom: { en: 'Bedroom', zh: '主卧' },
  second: { en: 'Second Bedroom', zh: '次卧' },
  kitchen: { en: 'Kitchen', zh: '厨房' },
  bath: { en: 'Bathroom', zh: '卫生间' },
  hall: { en: 'Hallway', zh: '走廊' },
}

export const INITIAL_ENTITIES = {
  'light.living_main': {
    domain: 'light', area: 'living', name: { en: 'Ceiling Light', zh: '客厅主灯' },
    state: 'on',
    attributes: { brightness: 200, color_temp_kelvin: 3200, supported: ['brightness', 'color_temp'] },
  },
  'light.living_strip': {
    domain: 'light', area: 'living', name: { en: 'Cove Lighting', zh: '客厅灯带' },
    state: 'on',
    attributes: { brightness: 150, rgb_color: [255, 140, 60], supported: ['brightness', 'rgb'] },
  },
  'light.living_floor': {
    domain: 'light', area: 'living', name: { en: 'Floor Lamp', zh: '落地灯' },
    state: 'off',
    attributes: { brightness: 180, color_temp_kelvin: 2700, supported: ['brightness', 'color_temp'] },
  },
  'light.bedroom_main': {
    domain: 'light', area: 'bedroom', name: { en: 'Ceiling Light', zh: '卧室吸顶灯' },
    state: 'off',
    attributes: { brightness: 220, color_temp_kelvin: 4000, supported: ['brightness', 'color_temp'] },
  },
  'light.bedroom_bedside': {
    domain: 'light', area: 'bedroom', name: { en: 'Bedside Lamp', zh: '床头灯' },
    state: 'on',
    attributes: { brightness: 120, color_temp_kelvin: 2700, supported: ['brightness', 'color_temp'] },
  },
  'light.dining_pendant': {
    domain: 'light', area: 'living', name: { en: 'Dining Pendant', zh: '餐吊灯' },
    state: 'on',
    attributes: { brightness: 175, color_temp_kelvin: 2900, supported: ['brightness', 'color_temp'] },
  },
  'light.second_main': {
    domain: 'light', area: 'second', name: { en: 'Ceiling Light', zh: '次卧吸顶灯' },
    state: 'off',
    attributes: { brightness: 200, color_temp_kelvin: 4000, supported: ['brightness', 'color_temp'] },
  },
  'cover.second_curtain': {
    domain: 'cover', area: 'second', name: { en: 'Curtain', zh: '次卧窗帘' },
    state: 'open',
    attributes: { current_position: 70 },
  },
  'light.bath_mirror': {
    domain: 'light', area: 'bath', name: { en: 'Mirror Light', zh: '镜前灯' },
    state: 'off',
    attributes: { brightness: 230, color_temp_kelvin: 4300, supported: ['brightness', 'color_temp'] },
  },
  'light.hall_down': {
    domain: 'light', area: 'hall', name: { en: 'Downlights', zh: '走廊筒灯' },
    state: 'on',
    attributes: { brightness: 120, color_temp_kelvin: 3500, supported: ['brightness', 'color_temp'] },
  },
  'light.kitchen_spot': {
    domain: 'light', area: 'kitchen', name: { en: 'Spotlights', zh: '厨房射灯' },
    state: 'off',
    attributes: { brightness: 255, color_temp_kelvin: 5000, supported: ['brightness', 'color_temp'] },
  },
  'cover.living_curtain': {
    domain: 'cover', area: 'living', name: { en: 'Curtain', zh: '客厅窗帘' },
    state: 'open',
    attributes: { current_position: 100 },
  },
  'cover.bedroom_curtain': {
    domain: 'cover', area: 'bedroom', name: { en: 'Curtain', zh: '卧室窗帘' },
    state: 'closed',
    attributes: { current_position: 0 },
  },
  'media_player.living_tv': {
    domain: 'media_player', area: 'living', name: { en: 'Television', zh: '客厅电视' },
    state: 'off',
    attributes: { source: 'HDMI 1' },
  },
  'climate.living_ac': {
    domain: 'climate', area: 'living', name: { en: 'Air Conditioner', zh: '客厅空调' },
    state: 'cool',
    attributes: { temperature: 24, current_temperature: 27.4, hvac_modes: ['off', 'cool', 'heat', 'fan_only'] },
  },
  'switch.floor_heating': {
    domain: 'switch', area: 'bedroom', name: { en: 'Underfloor Heating', zh: '卧室地暖' },
    state: 'off',
    attributes: {},
  },
  'fan.fresh_air': {
    domain: 'fan', area: 'living', name: { en: 'Fresh Air System', zh: '新风系统' },
    state: 'on',
    attributes: { percentage: 40 },
  },
  'sensor.living_temperature': {
    domain: 'sensor', area: 'living', name: { en: 'Temperature', zh: '客厅温度' },
    state: '27.4',
    attributes: { unit_of_measurement: '°C', device_class: 'temperature' },
  },
  'sensor.living_humidity': {
    domain: 'sensor', area: 'living', name: { en: 'Humidity', zh: '客厅湿度' },
    state: '56',
    attributes: { unit_of_measurement: '%', device_class: 'humidity' },
  },
  'sensor.living_pm25': {
    domain: 'sensor', area: 'living', name: { en: 'PM2.5', zh: 'PM2.5' },
    state: '12',
    attributes: { unit_of_measurement: 'µg/m³', device_class: 'pm25' },
  },
}

// 场景 = 一组服务调用，和 HA 的 scene.apply 等价
export const SCENES = [
  {
    id: 'scene.home', name: { en: 'Home', zh: '回家' }, timeOfDay: 0.55, icon: '🏠',
    states: {
      'light.dining_pendant': { state: 'on', attributes: { brightness: 180 } },
      'light.second_main': { state: 'off' },
      'light.hall_down': { state: 'on', attributes: { brightness: 120 } },
      'light.bath_mirror': { state: 'off' },
      'cover.second_curtain': { attributes: { current_position: 70 } },
      'light.living_main': { state: 'on', attributes: { brightness: 210, color_temp_kelvin: 3300 } },
      'light.living_strip': { state: 'on', attributes: { brightness: 160 } },
      'light.living_floor': { state: 'off' },
      'light.bedroom_main': { state: 'off' },
      'light.bedroom_bedside': { state: 'on', attributes: { brightness: 110 } },
      'light.kitchen_spot': { state: 'on', attributes: { brightness: 200 } },
      'cover.living_curtain': { attributes: { current_position: 100 } },
      'media_player.living_tv': { state: 'off' },
      'climate.living_ac': { state: 'cool', attributes: { temperature: 24 } },
    },
  },
  {
    id: 'scene.movie', name: { en: 'Movie', zh: '观影' }, timeOfDay: 0.88, icon: '🎬',
    states: {
      'light.dining_pendant': { state: 'off' },
      'light.second_main': { state: 'off' },
      'light.hall_down': { state: 'on', attributes: { brightness: 40 } },
      'light.bath_mirror': { state: 'off' },
      'cover.second_curtain': { attributes: { current_position: 0 } },
      'light.living_main': { state: 'off' },
      'light.living_strip': { state: 'on', attributes: { brightness: 90, rgb_color: [90, 120, 255] } },
      'light.living_floor': { state: 'off' },
      'light.kitchen_spot': { state: 'off' },
      'light.bedroom_main': { state: 'off' },
      'light.bedroom_bedside': { state: 'off' },
      'cover.living_curtain': { attributes: { current_position: 0 } },
      'media_player.living_tv': { state: 'on' },
      'climate.living_ac': { state: 'cool', attributes: { temperature: 25 } },
    },
  },
  {
    id: 'scene.dining', name: { en: 'Dining', zh: '用餐' }, timeOfDay: 0.78, icon: '🍽️',
    states: {
      'light.dining_pendant': { state: 'on', attributes: { brightness: 220 } },
      'light.hall_down': { state: 'on', attributes: { brightness: 110 } },
      'light.second_main': { state: 'off' },
      'light.living_main': { state: 'on', attributes: { brightness: 180, color_temp_kelvin: 2900 } },
      'light.living_strip': { state: 'on', attributes: { brightness: 120, rgb_color: [255, 150, 70] } },
      'light.living_floor': { state: 'on', attributes: { brightness: 160 } },
      'light.kitchen_spot': { state: 'on', attributes: { brightness: 255 } },
      'media_player.living_tv': { state: 'off' },
      'cover.living_curtain': { attributes: { current_position: 60 } },
    },
  },
  {
    id: 'scene.sleep', name: { en: 'Sleep', zh: '睡眠' }, timeOfDay: 0.95, icon: '🌙',
    states: {
      'light.dining_pendant': { state: 'off' },
      'light.second_main': { state: 'off' },
      'light.hall_down': { state: 'on', attributes: { brightness: 25 } },
      'light.bath_mirror': { state: 'off' },
      'cover.second_curtain': { attributes: { current_position: 0 } },
      'light.living_main': { state: 'off' },
      'light.living_strip': { state: 'off' },
      'light.living_floor': { state: 'off' },
      'light.kitchen_spot': { state: 'off' },
      'light.bedroom_main': { state: 'off' },
      'light.bedroom_bedside': { state: 'on', attributes: { brightness: 40, color_temp_kelvin: 2400 } },
      'cover.living_curtain': { attributes: { current_position: 0 } },
      'cover.bedroom_curtain': { attributes: { current_position: 0 } },
      'media_player.living_tv': { state: 'off' },
      'switch.floor_heating': { state: 'on' },
      'climate.living_ac': { state: 'cool', attributes: { temperature: 26 } },
    },
  },
  {
    id: 'scene.away', name: { en: 'Away', zh: '离家' }, timeOfDay: 0.42, icon: '🚪',
    states: {
      'light.dining_pendant': { state: 'off' },
      'light.second_main': { state: 'off' },
      'light.hall_down': { state: 'off' },
      'light.bath_mirror': { state: 'off' },
      'cover.second_curtain': { attributes: { current_position: 0 } },
      'light.living_main': { state: 'off' },
      'light.living_strip': { state: 'off' },
      'light.living_floor': { state: 'off' },
      'light.bedroom_main': { state: 'off' },
      'light.bedroom_bedside': { state: 'off' },
      'light.kitchen_spot': { state: 'off' },
      'cover.living_curtain': { attributes: { current_position: 0 } },
      'cover.bedroom_curtain': { attributes: { current_position: 0 } },
      'media_player.living_tv': { state: 'off' },
      'climate.living_ac': { state: 'off' },
      'switch.floor_heating': { state: 'off' },
    },
  },
]

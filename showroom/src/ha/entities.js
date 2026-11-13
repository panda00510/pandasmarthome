// 模拟 Home Assistant 实体注册表。
// 实体 ID / 属性名与真实 HA 保持一致，将来换成真设备时只需替换 store 的传输层。

export const AREAS = {
  living: { en: 'Living & Dining', zh: '客餐厅', short: { en: 'Living', zh: '客餐厅' } },
  kitchen: { en: 'Kitchen', zh: '厨房', short: { en: 'Kitchen', zh: '厨房' } },
  bedroom: { en: 'Master Bedroom', zh: '主卧', short: { en: 'Master', zh: '主卧' } },
  second: { en: 'Common Bedroom', zh: '卧室', short: { en: 'Bed 2', zh: '卧室' } },
  bath: { en: 'Common Bathroom', zh: '公共卫生间', short: { en: 'Bath', zh: '公卫' } },
  third: { en: 'Bedroom 3', zh: '卧室 3', short: { en: 'Bed 3', zh: '卧室 3' } },
  study: { en: 'Study', zh: '书房', short: { en: 'Study', zh: '书房' } },
  mbath: { en: 'Master Bathroom', zh: '主卫', short: { en: 'M. Bath', zh: '主卫' } },
  hall: { en: 'Corridor', zh: '走廊', short: { en: 'Hall', zh: '走廊' } },
  entry: { en: 'Foyer', zh: '玄关', short: { en: 'Foyer', zh: '玄关' } },
  yard: { en: 'Service Yard', zh: '服务阳台', short: { en: 'Yard', zh: '阳台' } },
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
    domain: 'climate', area: 'living', name: { en: 'Aircon', zh: '客厅空调' },
    state: 'cool',
    // 分体机：制冷 / 除湿 / 送风。新加坡住宅几乎没有制热。
    attributes: { temperature: 25, current_temperature: 27.4, hvac_modes: ['off', 'cool', 'dry', 'fan_only'] },
  },
  'climate.bedroom_ac': {
    domain: 'climate', area: 'bedroom', name: { en: 'Aircon', zh: '主卧空调' },
    state: 'off',
    attributes: { temperature: 26, current_temperature: 28.6, hvac_modes: ['off', 'cool', 'dry', 'fan_only'] },
  },
  'climate.second_ac': {
    domain: 'climate', area: 'second', name: { en: 'Aircon', zh: '卧室空调' },
    state: 'off',
    attributes: { temperature: 26, current_temperature: 28.4, hvac_modes: ['off', 'cool', 'dry', 'fan_only'] },
  },
  'fan.living_ceiling': {
    domain: 'fan', area: 'living', name: { en: 'Ceiling Fan', zh: '客厅吊扇' },
    state: 'off',
    attributes: { percentage: 66 },
  },
  'fan.bedroom_ceiling': {
    domain: 'fan', area: 'bedroom', name: { en: 'Ceiling Fan', zh: '主卧吊扇' },
    state: 'off',
    attributes: { percentage: 33 },
  },
  'fan.second_ceiling': {
    domain: 'fan', area: 'second', name: { en: 'Ceiling Fan', zh: '卧室吊扇' },
    state: 'off',
    attributes: { percentage: 33 },
  },
  'switch.bath_heater': {
    domain: 'switch', area: 'bath', name: { en: 'Storage Heater', zh: '储水式热水器' },
    state: 'off',
    // auto_off_min：通电后到点自己关，和浴室里常见的定时热水器一样。
    attributes: { auto_off_min: 30 },
  },
  'lock.entry': {
    domain: 'lock', area: 'entry', name: { en: 'Digital Lock', zh: '大门电子锁' },
    state: 'locked',
    // auto_lock：门关上后自动反锁（新加坡常见的 Samsung / Yale 电子锁都有）
    attributes: { auto_lock: true },
  },
  // 门窗磁：客厅窗 / 推拉门、主卧窗。主卧窗初始是开着的，离家场景会提醒
  'binary_sensor.living_window': {
    domain: 'binary_sensor', area: 'living', name: { en: 'Window Contact', zh: '客厅窗磁' },
    state: 'off', attributes: { device_class: 'window' },
  },
  'binary_sensor.master_window': {
    domain: 'binary_sensor', area: 'bedroom', name: { en: 'Window Contact', zh: '主卧窗磁' },
    state: 'on', attributes: { device_class: 'window' },
  },
  'binary_sensor.entry_door': {
    domain: 'binary_sensor', area: 'entry', name: { en: 'Door Contact', zh: '大门门磁' },
    state: 'off',
    attributes: { device_class: 'door' },
  },
  'camera.entry_doorbell': {
    domain: 'camera', area: 'entry', name: { en: 'Video Doorbell', zh: '可视门铃' },
    state: 'off',
    attributes: {},
  },
  // ---- 主卫 ----
  'switch.mbath_heater': {
    domain: 'switch', area: 'mbath', name: { en: 'Storage Heater', zh: '主卫热水器' },
    state: 'off',
    attributes: { auto_off_min: 30, watts: 2500 },
  },
  'light.mbath_mirror': {
    domain: 'light', area: 'mbath', name: { en: 'Mirror Light', zh: '主卫镜前灯' },
    state: 'off',
    attributes: { brightness: 230, color_temp_kelvin: 4300, supported: ['brightness', 'color_temp'] },
  },

  // ---- 补齐夜景偏暗的房间 ----
  'light.bed3_main': {
    domain: 'light', area: 'third', name: { en: 'Ceiling Light', zh: '卧室 3 吸顶灯' },
    state: 'off',
    attributes: { brightness: 200, color_temp_kelvin: 4000, supported: ['brightness', 'color_temp'] },
  },
  'light.study_main': {
    domain: 'light', area: 'study', name: { en: 'Ceiling Light', zh: '书房吸顶灯' },
    state: 'off',
    attributes: { brightness: 220, color_temp_kelvin: 4500, supported: ['brightness', 'color_temp'] },
  },
  'light.lounge_floor': {
    domain: 'light', area: 'living', name: { en: 'Lounge Lamp', zh: '起居角落地灯' },
    state: 'off',
    attributes: { brightness: 170, color_temp_kelvin: 2700, supported: ['brightness', 'color_temp'] },
  },

  // ---- 服务阳台：智能晾衣架（升降 + 风干 + 照明），新加坡组屋几乎家家都装 ----
  'cover.yard_rack': {
    domain: 'cover', area: 'yard', name: { en: 'Laundry Rack', zh: '智能晾衣架' },
    // current_position：100 = 升到顶，0 = 降到晾衣高度
    state: 'open', attributes: { current_position: 100, device_class: 'rack' },
  },
  'fan.yard_rack_dry': {
    domain: 'fan', area: 'yard', name: { en: 'Rack Air-Dry', zh: '晾衣架风干' },
    state: 'off', attributes: { percentage: 66 },
  },
  'light.yard_rack': {
    domain: 'light', area: 'yard', name: { en: 'Rack Light', zh: '晾衣架照明' },
    state: 'off', attributes: { brightness: 200, color_temp_kelvin: 5000, supported: ['brightness'] },
  },
  'binary_sensor.yard_leak': {
    domain: 'binary_sensor', area: 'yard', name: { en: 'Leak Sensor', zh: '洗衣机漏水传感器' },
    state: 'off', attributes: { device_class: 'moisture' },
  },

  // ---- 厨房：烟雾 / 燃气（只显示状态）----
  'binary_sensor.kitchen_smoke': {
    domain: 'binary_sensor', area: 'kitchen', name: { en: 'Smoke & Gas', zh: '烟雾燃气报警' },
    state: 'off', attributes: { device_class: 'smoke' },
  },

  // ---- 走廊：人体存在 + 自动开灯 ----
  'binary_sensor.hall_motion': {
    domain: 'binary_sensor', area: 'hall', name: { en: 'Presence', zh: '走廊人体存在' },
    state: 'off', attributes: { device_class: 'occupancy' },
  },
  'input_boolean.hall_auto': {
    domain: 'input_boolean', area: 'hall', name: { en: 'Auto Lights', zh: '有人自动开灯' },
    state: 'off', attributes: {},
  },

  // ---- 客厅：扫地机器人 ----
  'vacuum.robot': {
    domain: 'vacuum', area: 'living', name: { en: 'Robot Vacuum', zh: '扫地机器人' },
    state: 'docked', attributes: { battery_level: 100 },
  },

  // ---- 主卧：除湿机（新加坡常年湿度 70%+）----
  'humidifier.bedroom_dehumidifier': {
    domain: 'humidifier', area: 'bedroom', name: { en: 'Dehumidifier', zh: '除湿机' },
    state: 'off', attributes: { device_class: 'dehumidifier', humidity: 55, current_humidity: 72, min_humidity: 40, max_humidity: 70, simulated: true },
  },

  // ---- 智能插座（带功率计量）----
  'switch.tv_plug': {
    domain: 'switch', area: 'living', name: { en: 'TV Smart Plug', zh: '电视柜插座' },
    state: 'on', attributes: { plug: true },
  },
  'switch.desk_plug': {
    domain: 'switch', area: 'second', name: { en: 'Desk Smart Plug', zh: '书桌插座' },
    state: 'off', attributes: { plug: true },
  },
  'sensor.tv_plug_power': {
    domain: 'sensor', area: 'living', name: { en: 'TV Plug Power', zh: '电视柜功率' }, requires: 'switch.tv_plug',
    state: '0.5', attributes: { unit_of_measurement: 'W', device_class: 'power' },
  },
  'sensor.desk_plug_power': {
    domain: 'sensor', area: 'second', name: { en: 'Desk Plug Power', zh: '书桌功率' }, requires: 'switch.desk_plug',
    state: '0', attributes: { unit_of_measurement: 'W', device_class: 'power' },
  },

  'sensor.living_temperature': {
    domain: 'sensor', area: 'living', name: { en: 'Temperature', zh: '客厅温度' },
    state: '27.4',
    attributes: { unit_of_measurement: '°C', device_class: 'temperature' },
  },
  'sensor.living_humidity': {
    domain: 'sensor', area: 'living', name: { en: 'Humidity', zh: '客厅湿度' },
    // 空调开着、室温还没降到位时，新加坡室内湿度通常仍在 60% 出头。
    state: '63',
    // 读数由 store.js 的湿度演示模拟驱动（空调除湿 / 制冷时缓慢下降）
    attributes: { unit_of_measurement: '%', device_class: 'humidity', value: 63, simulated: true },
  },
  'sensor.living_pm25': {
    domain: 'sensor', area: 'living', name: { en: 'PM2.5', zh: 'PM2.5' },
    state: '14',
    attributes: { unit_of_measurement: 'µg/m³', device_class: 'pm25' },
  },
}

// 场景 = 一组服务调用，和 HA 的 scene.apply 等价。数组顺序 = 面板上的顺序；hint 是磁贴上的一行说明
export const SCENES = [
  {
    id: 'scene.home', name: { en: 'Home', zh: '回家' }, timeOfDay: 0.55, icon: '🏠',
    hint: { en: 'Lights, curtains, aircon', zh: '开灯、开帘、开空调' },
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
      'climate.living_ac': { state: 'cool', attributes: { temperature: 25 } },
      'climate.bedroom_ac': { state: 'off' },
      'climate.second_ac': { state: 'off' },
      'fan.living_ceiling': { state: 'off' },
      'fan.bedroom_ceiling': { state: 'off' },
      'fan.second_ceiling': { state: 'off' },
      'switch.bath_heater': { state: 'off' },
      'lock.entry': { state: 'locked' },
      'camera.entry_doorbell': { state: 'off' },
      'switch.mbath_heater': { state: 'off' },
      'light.mbath_mirror': { state: 'off' },
      'light.bed3_main': { state: 'off' },
      'light.study_main': { state: 'off' },
      'light.lounge_floor': { state: 'on', attributes: { brightness: 150 } },
      'cover.yard_rack': { state: 'open', attributes: { current_position: 100 } },
      'fan.yard_rack_dry': { state: 'off' },
      'light.yard_rack': { state: 'off' },
      'input_boolean.hall_auto': { state: 'on' },
      'vacuum.robot': { state: 'docked' },
      'humidifier.bedroom_dehumidifier': { state: 'off' },
      'switch.tv_plug': { state: 'on' },
    },
  },
  {
    id: 'scene.away', name: { en: 'Away', zh: '离家' }, timeOfDay: 0.42, icon: '🚪',
    hint: { en: 'All off, door locked', zh: '全关、大门上锁' },
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
      'climate.bedroom_ac': { state: 'off' },
      'climate.second_ac': { state: 'off' },
      'fan.living_ceiling': { state: 'off' },
      'fan.bedroom_ceiling': { state: 'off' },
      'fan.second_ceiling': { state: 'off' },
      'switch.bath_heater': { state: 'off' },
      'lock.entry': { state: 'locked' },
      'camera.entry_doorbell': { state: 'off' },
      'switch.mbath_heater': { state: 'off' },
      'light.mbath_mirror': { state: 'off' },
      'light.bed3_main': { state: 'off' },
      'light.study_main': { state: 'off' },
      'light.lounge_floor': { state: 'off' },
      'light.yard_rack': { state: 'off' },
      // 离家：衣服升上去风干、机器人趁没人打扫、除湿机开着防霉、电视柜插座断电省待机功耗
      'cover.yard_rack': { state: 'open', attributes: { current_position: 100 } },
      'fan.yard_rack_dry': { state: 'on', attributes: { percentage: 66 } },
      'vacuum.robot': { state: 'cleaning' },
      'humidifier.bedroom_dehumidifier': { state: 'on', attributes: { humidity: 55 } },
      'switch.tv_plug': { state: 'off' },
      'switch.desk_plug': { state: 'off' },
      'input_boolean.hall_auto': { state: 'off' },
    },
  },
  {
    id: 'scene.sleep', name: { en: 'Sleep', zh: '睡眠' }, timeOfDay: 0.95, icon: '🌙',
    hint: { en: 'Lamp dim, aircon 26°C', zh: '床头灯调暗、空调 26°C' },
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
      'climate.living_ac': { state: 'off' },
      'climate.bedroom_ac': { state: 'cool', attributes: { temperature: 26 } },
      'climate.second_ac': { state: 'off' },
      'fan.living_ceiling': { state: 'off' },
      'fan.bedroom_ceiling': { state: 'on', attributes: { percentage: 33 } },
      'fan.second_ceiling': { state: 'off' },
      'switch.bath_heater': { state: 'off' },
      'lock.entry': { state: 'locked' },
      'switch.mbath_heater': { state: 'off' },
      'light.mbath_mirror': { state: 'off' },
      'light.bed3_main': { state: 'off' },
      'light.study_main': { state: 'off' },
      'light.lounge_floor': { state: 'off' },
      'light.yard_rack': { state: 'off' },
      'input_boolean.hall_auto': { state: 'on' },
      'humidifier.bedroom_dehumidifier': { state: 'on', attributes: { humidity: 55 } },
      'vacuum.robot': { state: 'docked' },
      'switch.desk_plug': { state: 'off' },
    },
  },
  {
    id: 'scene.movie', name: { en: 'Movie', zh: '观影' }, timeOfDay: 0.88, icon: '🎬',
    hint: { en: 'Curtains shut, TV on', zh: '合上窗帘、开电视' },
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
      'climate.living_ac': { state: 'cool', attributes: { temperature: 24 } },
      'climate.bedroom_ac': { state: 'off' },
      'climate.second_ac': { state: 'off' },
      'fan.living_ceiling': { state: 'off' },
      'fan.bedroom_ceiling': { state: 'off' },
      'fan.second_ceiling': { state: 'off' },
      'switch.bath_heater': { state: 'off' },
      'switch.tv_plug': { state: 'on' },
      'lock.entry': { state: 'locked' },
      'light.lounge_floor': { state: 'off' },
      'light.study_main': { state: 'off' },
      'light.bed3_main': { state: 'off' },
      'light.yard_rack': { state: 'off' },
      'vacuum.robot': { state: 'docked' },
      'input_boolean.hall_auto': { state: 'off' },
    },
  },
  {
    id: 'scene.dining', name: { en: 'Dining', zh: '用餐' }, timeOfDay: 0.78, icon: '🍽️',
    hint: { en: 'Warm light, fan low', zh: '暖光、吊扇低速' },
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
      'climate.living_ac': { state: 'cool', attributes: { temperature: 26 } },
      'fan.living_ceiling': { state: 'on', attributes: { percentage: 33 } },
      'fan.bedroom_ceiling': { state: 'off' },
      'fan.second_ceiling': { state: 'off' },
      'switch.bath_heater': { state: 'off' },
      'light.lounge_floor': { state: 'on', attributes: { brightness: 130 } },
      'vacuum.robot': { state: 'docked' },
    },
  },
]

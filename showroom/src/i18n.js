import { useHA } from './ha/store'

// 界面文案。设备名、区域名、场景名放在 entities.js 里（跟着数据走），
// 这里只放界面自己的字符串。
export const STRINGS = {
  en: {
    brand_name: 'Panda Smart Home',
    brand_sub: 'Showroom · Demo',

    tool_labels_on: 'Hide device labels',
    tool_labels_off: 'Show device labels',
    tool_calibrate: 'Calibrate hotspot positions',
    tool_reset: 'Reset to initial state',
    tool_focus: 'Focus mode — hide the interface',
    tool_lang: '切换到中文',

    views: 'Views',
    panel_eyebrow: 'Current scene',
    panel_custom: 'Custom',
    panel_running: (on, total) => `${on} of ${total} devices running`,
    panel_collapse: 'Collapse panel',
    panel_expand: 'Expand device panel',
    sheet_open: 'Expand device panel',
    sheet_close: 'Collapse device panel',

    metric_temp: 'Temp',
    metric_humidity: 'Humidity',
    metric_pm25: 'PM2.5',

    ctl_brightness: 'Brightness',
    ctl_temperature: 'Colour temp',
    ctl_colour: 'Colour',
    ctl_position: 'Position',
    ctl_target: 'Target',
    ctl_airflow: 'Airflow',
    ctl_room: (t) => `Room ${t}°C`,

    cover_open: 'Open',
    cover_half: 'Half',
    cover_shut: 'Closed',

    colour_warm: 'Warm',
    colour_day: 'Daylight',
    colour_cyan: 'Cyan',
    colour_magenta: 'Magenta',
    colour_green: 'Green',

    log_title: 'state_changed',
    log_empty: 'Operate any device and events will appear here',

    focus_exit: 'Exit focus mode · Esc',

    calib_badge: 'Calibrating',
    calib_hint_pick: 'Click any hotspot to start adjusting',
    calib_hint_drag: 'Drag the arrows, or edit the numbers directly',
    calib_close: 'Exit calibration',
    calib_copy: 'Copy coordinates',
    calib_copied: 'Copied to clipboard',
    calib_changes: (n) => ` (${n} changed)`,
    calib_reset: 'Restore defaults',
    calib_fallback: 'The browser blocked clipboard access — press ⌘C to copy this:',

    state_on: 'On',
    state_off: 'Off',
    state_standby: 'Standby',
    state_playing: 'Playing',
    state_closed: 'Closed',
    hvac_off: 'Off',
    hvac_cool: 'Cooling',
    hvac_heat: 'Heating',
    hvac_fan_only: 'Fan only',
  },

  zh: {
    brand_name: 'Panda 智能家居',
    brand_sub: '样板间 · 演示模式',

    tool_labels_on: '隐藏设备标签',
    tool_labels_off: '显示设备标签',
    tool_calibrate: '标定热点位置',
    tool_reset: '恢复初始状态',
    tool_focus: '专注模式：隐藏界面只看房子',
    tool_lang: 'Switch to English',

    views: '视角',
    panel_eyebrow: '当前场景',
    panel_custom: '自定义',
    panel_running: (on, total) => `${on} 个设备运行中 · 共 ${total} 个`,
    panel_collapse: '收起面板',
    panel_expand: '展开设备面板',
    sheet_open: '展开设备面板',
    sheet_close: '收起设备面板',

    metric_temp: '温度',
    metric_humidity: '湿度',
    metric_pm25: 'PM2.5',

    ctl_brightness: '亮度',
    ctl_temperature: '色温',
    ctl_colour: '颜色',
    ctl_position: '开合度',
    ctl_target: '目标温度',
    ctl_airflow: '风量',
    ctl_room: (t) => `室温 ${t}°C`,

    cover_open: '全开',
    cover_half: '一半',
    cover_shut: '闭合',

    colour_warm: '暖白',
    colour_day: '日光',
    colour_cyan: '青蓝',
    colour_magenta: '紫红',
    colour_green: '翠绿',

    log_title: 'state_changed',
    log_empty: '操作任意设备，事件会实时出现在这里',

    focus_exit: '退出专注模式 · Esc',

    calib_badge: '标定模式',
    calib_hint_pick: '点击任意热点开始调整',
    calib_hint_drag: '拖动箭头调整位置，或直接修改数值',
    calib_close: '退出标定',
    calib_copy: '复制坐标表',
    calib_copied: '已复制到剪贴板',
    calib_changes: (n) => `（${n} 处改动）`,
    calib_reset: '还原默认',
    calib_fallback: '浏览器不允许直接写剪贴板，按 ⌘C 复制下面这段：',

    state_on: '开',
    state_off: '关',
    state_standby: '待机',
    state_playing: '播放中',
    state_closed: '闭合',
    hvac_off: '关闭',
    hvac_cool: '制冷',
    hvac_heat: '制热',
    hvac_fan_only: '送风',
  },
}

/** 取双语字段：数据里的 name 写成 { en, zh } */
export const pick = (value, lang) =>
  value && typeof value === 'object' ? value[lang] ?? value.en : value

export function useT() {
  const lang = useHA((s) => s.lang)
  const table = STRINGS[lang] ?? STRINGS.en
  const t = (key, ...args) => {
    const v = table[key]
    return typeof v === 'function' ? v(...args) : v ?? key
  }
  t.lang = lang
  t.pick = (value) => pick(value, lang)
  return t
}

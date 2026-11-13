import { pick } from '../i18n'

export const pct = (brightness) => Math.round(((brightness ?? 255) / 255) * 100)

/** 设备状态的一句话描述。t 来自 useT()，需要它才能出正确语言。 */
export function stateText(e, t) {
  if (!e) return '—'
  const on = t('state_on')
  const off = t('state_off')
  switch (e.domain) {
    case 'light':
      return e.state === 'on' ? `${on} · ${pct(e.attributes.brightness)}%` : off
    case 'cover':
      if (e.attributes.device_class === 'rack') {
        const p = e.attributes.current_position
        return p >= 100 ? t('rack_up') : p <= 0 ? t('rack_down') : t('rack_at', p)
      }
      return e.attributes.current_position > 0
        ? `${on} ${e.attributes.current_position}%`
        : t('state_closed')
    case 'climate':
      return e.state === 'off' ? off : `${t('hvac_' + e.state)} · ${e.attributes.temperature}°C`
    case 'media_player':
      return e.state === 'on' ? `${t('state_playing')} · ${e.attributes.source}` : t('state_standby')
    case 'fan': {
      if (e.state !== 'on') return off
      const p = e.attributes.percentage ?? 0
      const speed = p >= 80 ? t('fan_high') : p >= 50 ? t('fan_med') : t('fan_low')
      return `${on} · ${speed}`
    }
    case 'switch':
      return e.state === 'on' && e.attributes.auto_off_min
        ? `${on} · ${t('heater_left', e.attributes.auto_off_min)}`
        : e.state === 'on' ? on : off
    case 'lock':
      return e.state === 'locked' ? t('state_locked') : t('state_unlocked')
    case 'camera':
      return e.state === 'on' ? t('state_live') : t('state_idle')
    case 'sensor':
      return `${e.state} ${e.attributes.unit_of_measurement ?? ''}`.trim()
    case 'binary_sensor':
      return t(`bs_${e.attributes.device_class}_${e.state}`)
    case 'vacuum':
      return t(`vac_${e.state}`)
    case 'humidifier':
      return e.state === 'on' ? `${on} · ${t('hum_target', e.attributes.humidity)}` : off
    case 'input_boolean':
      return e.state === 'on' ? t('auto_on') : off
    default:
      return e.state
  }
}

export const entityName = (e, lang) => pick(e?.name, lang)

// ---- 全屋用电概览（演示估算：按设备状态 × 典型额定功率推算，不是实测）----
// 电视的功率记在电视柜插座的计量里，不单独再算一次
const LIGHT_W = 12           // LED 吸顶 / 筒灯一路满亮约 12 W
const STRIP_W = 18
export function estimatePower(entities) {
  const items = []
  for (const [id, e] of Object.entries(entities)) {
    let w = 0
    const a = e.attributes
    switch (e.domain) {
      case 'light':
        if (e.state === 'on') w = ((a.brightness ?? 255) / 255) * (id.includes('strip') ? STRIP_W : LIGHT_W)
        break
      case 'climate':
        w = { cool: 900, dry: 450, fan_only: 60 }[e.state] ?? 0
        break
      case 'fan':
        if (e.state === 'on') w = id.includes('rack') ? 60 : 8 + (a.percentage ?? 66) * 0.4
        break
      case 'switch':
        if (e.state === 'on' && a.auto_off_min != null) w = a.watts ?? 2500
        break
      case 'sensor':
        if (a.device_class === 'power') w = Number(e.state) || 0
        break
      case 'humidifier':
        if (e.state === 'on') w = 220
        break
      case 'vacuum':
        w = { cleaning: 40, returning: 30, docked: 3 }[e.state] ?? 0
        break
      case 'camera':
        w = e.state === 'on' ? 4 : 1.5
        break
      default:
        break
    }
    if (w > 0) items.push({ id, w })
  }
  items.sort((x, y) => y.w - x.w)
  return { total: items.reduce((s, i) => s + i.w, 0), items }
}

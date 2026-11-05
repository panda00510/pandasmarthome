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
    default:
      return e.state
  }
}

export const entityName = (e, lang) => pick(e?.name, lang)

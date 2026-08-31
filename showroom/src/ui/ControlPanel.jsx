import { useHA, isOn } from '../ha/store'
import { AREAS, SCENES } from '../ha/entities'
import { stateText, pct } from '../ha/format'
import { useT } from '../i18n'
import { useIsMobile } from '../hooks'
import Icon, { iconFor } from './icons'

function Slider({ label, value, unit = '', min, max, step = 1, cool, onChange }) {
  return (
    <div className="ctl">
      <div className="ctl-head">
        <span className="ctl-label">{label}</span>
        <span className="ctl-value">{value}{unit}</span>
      </div>
      <input
        type="range"
        className={cool ? 'is-cool' : ''}
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}

const COLORS = [
  ['colour_warm', [255, 180, 110]],
  ['colour_day', [255, 240, 220]],
  ['colour_cyan', [90, 160, 255]],
  ['colour_magenta', [220, 110, 220]],
  ['colour_green', [110, 230, 150]],
]

function Detail({ entity, id }) {
  const t = useT()
  const call = useHA((s) => s.callService)
  const a = entity.attributes

  if (entity.domain === 'light') {
    return (
      <div className="dev-detail">
        <Slider
          label={t('ctl_brightness')} unit="%" min={1} max={100}
          value={pct(a.brightness)}
          onChange={(v) => call('light', 'turn_on', id, { brightness: Math.round((v / 100) * 255) })}
        />
        {a.supported?.includes('color_temp') && (
          <Slider
            label={t('ctl_temperature')} unit="K" min={2200} max={6500} step={100} cool
            value={a.color_temp_kelvin ?? 3000}
            onChange={(v) => call('light', 'turn_on', id, { color_temp_kelvin: v })}
          />
        )}
        {a.supported?.includes('rgb') && (
          <div className="ctl">
            <div className="ctl-head"><span className="ctl-label">颜色</span></div>
            <div className="swatches">
              {COLORS.map(([key, rgb]) => (
                <button
                  key={key}
                  title={t(key)}
                  aria-label={t(key)}
                  className={`swatch${String(a.rgb_color) === String(rgb) ? ' is-on' : ''}`}
                  style={{ background: `rgb(${rgb.join(',')})` }}
                  onClick={() => call('light', 'turn_on', id, { rgb_color: rgb })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (entity.domain === 'cover') {
    return (
      <div className="dev-detail">
        <Slider
          label={t('ctl_position')} unit="%" min={0} max={100} step={5} cool
          value={a.current_position}
          onChange={(v) => call('cover', 'set_cover_position', id, { position: v })}
        />
        <div className="ctl seg">
          {[['cover_open', 100], ['cover_half', 50], ['cover_shut', 0]].map(([key, p]) => (
            <button
              key={key}
              className={a.current_position === p ? 'is-on' : ''}
              onClick={() => call('cover', 'set_cover_position', id, { position: p })}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (entity.domain === 'climate') {
    return (
      <div className="dev-detail">
        <div className="ctl">
          <div className="ctl-head"><span className="ctl-label">{t('ctl_target')}</span></div>
          <div className="stepper">
            <button
              onClick={() => call('climate', 'set_temperature', id, { temperature: Math.max(16, a.temperature - 1) })}
              aria-label={t('ctl_target')}
            >−</button>
            <span className="stepper-value">{a.temperature}<i>°C</i></span>
            <button
              onClick={() => call('climate', 'set_temperature', id, { temperature: Math.min(30, a.temperature + 1) })}
              aria-label={t('ctl_target')}
            >+</button>
            <span className="stepper-note">{t('ctl_room', a.current_temperature)}</span>
          </div>
        </div>
        <div className="ctl seg">
          {a.hvac_modes.map((m) => (
            <button
              key={m}
              className={entity.state === m ? 'is-on' : ''}
              onClick={() => call('climate', 'set_hvac_mode', id, { hvac_mode: m })}
            >
              {t('hvac_' + m)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (entity.domain === 'fan') {
    return (
      <div className="dev-detail">
        <Slider
          label={t('ctl_airflow')} unit="%" min={10} max={100} step={10} cool
          value={a.percentage ?? 40}
          onChange={(v) => call('fan', 'turn_on', id, { percentage: v })}
        />
      </div>
    )
  }

  return null
}

const HAS_DETAIL = ['light', 'cover', 'climate', 'fan']

const METRIC_LABEL = {
  'sensor.living_temperature': 'metric_temp',
  'sensor.living_humidity': 'metric_humidity',
  'sensor.living_pm25': 'metric_pm25',
}

function Device({ id }) {
  const t = useT()
  const entity = useHA((s) => s.entities[id])
  const toggle = useHA((s) => s.toggle)
  const selected = useHA((s) => s.selected)
  const setSelected = useHA((s) => s.setSelected)

  const on = isOn(entity)
  const open = selected === id
  const expandable = HAS_DETAIL.includes(entity.domain)

  return (
    <div className={`dev${on ? ' is-on' : ''}${open ? ' is-open' : ''}`}>
      <div
        className={`dev-row${expandable ? ' is-clickable' : ''}`}
        onClick={() => expandable && setSelected(open ? null : id)}
      >
        <span className="dev-icon"><Icon name={iconFor(id, entity.domain)} size={18} /></span>
        <span className="dev-meta">
          <span className="dev-name">{t.pick(entity.name)}</span>
          <span className="dev-state">{stateText(entity, t)}</span>
          {open && <span className="dev-id">{id}</span>}
        </span>
        <button
          className="toggle"
          aria-label={`${on ? t('state_off') : t('state_on')} · ${t.pick(entity.name)}`}
          aria-pressed={on}
          onClick={(e) => { e.stopPropagation(); toggle(id) }}
        />
      </div>
      {open && expandable && <Detail entity={entity} id={id} />}
    </div>
  )
}

export default function ControlPanel() {
  const t = useT()
  const entities = useHA((s) => s.entities)
  const activeScene = useHA((s) => s.activeScene)
  const isMobile = useIsMobile()
  const open = useHA((s) => s.sheetOpen)
  const setOpen = useHA((s) => s.setSheetOpen)
  const collapsed = useHA((s) => s.panelCollapsed)
  const setPanelCollapsed = useHA((s) => s.setPanelCollapsed)
  const toggle = useHA((s) => s.toggle)

  const ids = Object.keys(entities)
  const sensors = ids.filter((id) => entities[id].domain === 'sensor')
  const controllable = ids.filter((id) => entities[id].domain !== 'sensor')
  const onCount = controllable.filter((id) => isOn(entities[id])).length
  const scene = SCENES.find((s) => s.id === activeScene)
  const sceneName = scene ? t.pick(scene.name) : t('panel_custom')

  // 收起态：只留一列设备图标，占 58px，仍然能直接开关
  if (!isMobile && collapsed) {
    return (
      <aside className="rail float">
        <button className="rail-btn is-expand" onClick={() => setPanelCollapsed(false)} title={t('panel_expand')}>
          <Icon name="sliders" size={17} />
        </button>
        <span className="rail-rule" />
        {controllable.map((id) => {
          const e = entities[id]
          const on = isOn(e)
          return (
            <button
              key={id}
              className={`rail-btn${on ? ' is-on' : ''}`}
              onClick={() => toggle(id)}
              title={`${t.pick(e.name)} · ${stateText(e, t)}`}
              aria-label={`${on ? t('state_off') : t('state_on')} · ${t.pick(e.name)}`}
            >
              <Icon name={iconFor(id, e.domain)} size={17} />
            </button>
          )
        })}
      </aside>
    )
  }

  return (
    <aside className={`panel float${isMobile ? ' is-sheet' : ''}${isMobile && open ? ' is-open' : ''}`}>
      {isMobile && (
        <button
          className="sheet-handle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? t('sheet_close') : t('sheet_open')}
        >
          <span />
        </button>
      )}

      <div className="panel-head" onClick={() => isMobile && setOpen(!open)}>
        <div className="panel-heading">
          <div>
            <div className="panel-eyebrow">{t('panel_eyebrow')}</div>
            <h2 className="panel-title">{sceneName}</h2>
          </div>
          {!isMobile && (
            <button
              className="panel-collapse"
              onClick={(e) => { e.stopPropagation(); setPanelCollapsed(true) }}
              title={t('panel_collapse')}
              aria-label={t('panel_collapse')}
            >
              <Icon name="chevron" size={14} />
            </button>
          )}
        </div>
        <p className="panel-sub">{t('panel_running', onCount, controllable.length)}</p>
      </div>

      <div className="panel-body">
        <div className="climate-strip">
          {sensors.map((id) => {
            const e = entities[id]
            return (
              <div className="metric" key={id}>
                <Icon name={iconFor(id, e.domain)} size={15} className="metric-icon" />
                <div className="metric-value">
                  {e.state}<i>{e.attributes.unit_of_measurement}</i>
                </div>
                <div className="metric-label">{METRIC_LABEL[id] ? t(METRIC_LABEL[id]) : t.pick(e.name)}</div>
              </div>
            )
          })}
        </div>

        {Object.entries(AREAS).map(([areaKey, areaName]) => {
          const list = controllable.filter((id) => entities[id].area === areaKey)
          if (!list.length) return null
          const lit = list.filter((id) => isOn(entities[id])).length
          return (
            <section className="area" key={areaKey}>
              <div className="area-head">
                <span className="area-name">{t.pick(areaName)}</span>
                <span className="area-rule" />
                <span className="area-count">{lit}/{list.length}</span>
              </div>
              {list.map((id) => <Device key={id} id={id} />)}
            </section>
          )
        })}
      </div>
    </aside>
  )
}

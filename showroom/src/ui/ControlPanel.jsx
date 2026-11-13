import { memo, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useHA, isOn, isReadOnly, usePlan } from '../ha/store'
import { AREAS, SCENES } from '../ha/entities'
import { stateText, pct, estimatePower } from '../ha/format'
import { useT } from '../i18n'
import { useIsMobile } from '../hooks'
import Icon, { iconFor, SCENE_ICON } from './icons'

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
            <div className="ctl-head"><span className="ctl-label">{t('ctl_colour')}</span></div>
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
          {(a.device_class === 'rack'
            ? [['rack_raise', 100], ['rack_stop_mid', 50], ['rack_lower', 0]]
            : [['cover_open', 100], ['cover_half', 50], ['cover_shut', 0]]).map(([key, p]) => (
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
    const pct = a.percentage ?? 66
    const current = pct >= 80 ? 100 : pct >= 50 ? 66 : 33
    return (
      <div className="dev-detail">
        <div className="ctl">
          <div className="ctl-head"><span className="ctl-label">{t('ctl_airflow')}</span></div>
        </div>
        <div className="ctl seg">
          {[[33, 'fan_low'], [66, 'fan_med'], [100, 'fan_high']].map(([value, key]) => (
            <button
              key={key}
              className={current === value ? 'is-on' : ''}
              onClick={() => call('fan', 'turn_on', id, { percentage: value })}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (entity.domain === 'switch' && a.auto_off_min != null) {
    return (
      <div className="dev-detail">
        <div className="ctl">
          <div className="ctl-head"><span className="ctl-label">{t('ctl_auto_off')}</span></div>
        </div>
        <div className="ctl seg">
          {[15, 30, 60].map((m) => (
            <button
              key={m}
              className={a.auto_off_min === m ? 'is-on' : ''}
              onClick={() => call('switch', 'turn_on', id, { auto_off_min: m })}
            >
              {t('heater_min', m)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (entity.domain === 'humidifier') {
    return (
      <div className="dev-detail">
        <div className="ctl">
          <div className="ctl-head"><span className="ctl-label">{t('ctl_humidity')}</span></div>
          <div className="stepper">
            <button onClick={() => call('humidifier', 'set_humidity', id, { humidity: Math.max(a.min_humidity, a.humidity - 5) })} aria-label={t('ctl_humidity')}>−</button>
            <span className="stepper-value">{a.humidity}<i>%</i></span>
            <button onClick={() => call('humidifier', 'set_humidity', id, { humidity: Math.min(a.max_humidity, a.humidity + 5) })} aria-label={t('ctl_humidity')}>+</button>
            <span className="stepper-note">{t('ctl_now', a.current_humidity)}</span>
          </div>
        </div>
      </div>
    )
  }

  if (entity.domain === 'vacuum') {
    return (
      <div className="dev-detail">
        <div className="ctl seg">
          <button className={entity.state === 'cleaning' ? 'is-on' : ''} onClick={() => call('vacuum', 'start', id)}>{t('vac_start')}</button>
          <button className={entity.state !== 'cleaning' ? 'is-on' : ''} onClick={() => call('vacuum', 'return_to_base', id)}>{t('vac_dock')}</button>
        </div>
      </div>
    )
  }

  if (entity.domain === 'lock' && a.auto_lock) {
    return <div className="dev-detail"><p className="dev-note">{t('lock_auto')}</p></div>
  }

  return null
}


// ============================================================
// 墙装触摸屏式面板：顶部房间标签 + 两列大磁贴。点磁贴 = 开 / 关；
// 需要调节的设备右上角一个"⋯"，在磁贴下方展开内联调节条（一次只展开一个）。
// 切换房间标签时相机缓动飞到该房间视角（拖动即可打断）。
// ============================================================

// 有内联调节条的设备
const adjustable = (e) =>
  (e.domain === 'light' && e.attributes.supported?.includes('brightness')) ||
  ['cover', 'climate', 'fan', 'humidifier'].includes(e.domain) ||
  e.attributes?.auto_off_min != null

// 环境读数只放首页
const ENV = { temperature: 'metric_temp', humidity: 'metric_humidity', pm25: 'metric_pm25' }
const isEnv = (e) => e.domain === 'sensor' && ENV[e.attributes.device_class]

// 可控设备磁贴：每块只订阅自己的实体；memo 让父组件重渲时不连带
const Tile = memo(function Tile({ id }) {
  const t = useT()
  const entity = useHA((s) => s.entities[id])
  const toggle = useHA((s) => s.toggle)
  const open = useHA((s) => s.selected === id)
  const setSelected = useHA((s) => s.setSelected)
  const on = isOn(entity)
  const tone = entity.domain === 'light' ? 'is-lamp' : 'is-dev'
  return (
    <>
      <div className={`tile ${tone}${on ? ' is-on' : ''}${open ? ' is-open' : ''}`}>
        <button className="tile-main" aria-pressed={on} onClick={() => toggle(id)}>
          <Icon name={iconFor(id, entity.domain)} size={22} className="tile-icon" />
          <span className="tile-name">{t.pick(entity.name)}</span>
          <span className="tile-state">{stateText(entity, t)}</span>
        </button>
        {adjustable(entity) && (
          <button
            className="tile-more"
            aria-expanded={open}
            aria-label={`${t('tile_adjust')} · ${t.pick(entity.name)}`}
            onClick={() => setSelected(open ? null : id)}
          >
            <Icon name="sliders" size={15} />
          </button>
        )}
      </div>
      {open && (
        <div className="tile-adjust" role="group" aria-label={t.pick(entity.name)}>
          <Detail entity={entity} id={id} />
        </div>
      )}
    </>
  )
})

// 只读传感器：不可点击的小状态磁贴（人体传感器带"模拟有人经过"）
const SensorTile = memo(function SensorTile({ id }) {
  const t = useT()
  const entity = useHA((s) => s.entities[id])
  const call = useHA((s) => s.callService)
  const active = entity.domain === 'binary_sensor' && entity.state === 'on'
  const alarm = active && ['smoke', 'moisture'].includes(entity.attributes.device_class)
  return (
    <div className={`stile${active ? ' is-active' : ''}${alarm ? ' is-alarm' : ''}`}>
      <Icon name={iconFor(id, entity.domain)} size={16} className="stile-icon" />
      <span className="stile-text">
        <span className="stile-name">{t.pick(entity.name)}</span>
        <span className="stile-state">{stateText(entity, t)}</span>
      </span>
      {entity.attributes.device_class === 'occupancy' && (
        <button className="stile-btn" onClick={() => call('binary_sensor', 'simulate', id)}>{t('sim_walk')}</button>
      )}
    </div>
  )
})

// 全屋用电：按设备状态推算的演示估算
function EnergyCard() {
  const t = useT()
  const entities = useHA((s) => s.entities)
  const { total, items } = useMemo(() => estimatePower(entities), [entities])
  return (
    <div className="energy">
      <div className="energy-head">
        <span className="energy-label">{t('energy_title')}</span>
        <span className="energy-value">{total >= 1000 ? (total / 1000).toFixed(2) : Math.round(total)}<i>{total >= 1000 ? 'kW' : 'W'}</i></span>
      </div>
      <div className="energy-bar">
        {items.slice(0, 5).map((it) => <span key={it.id} style={{ flexGrow: it.w }} />)}
      </div>
      <div className="energy-top">
        {items.slice(0, 3).map((it) => (
          <span key={it.id}>{t.pick(entities[it.id].name)} <b>{Math.round(it.w)} W</b></span>
        ))}
      </div>
      <p className="energy-note">{t('energy_note')}</p>
    </div>
  )
}

function HomePage({ envIds, onCount, total }) {
  const t = useT()
  const activeScene = useHA((s) => s.activeScene)
  const activateScene = useHA((s) => s.activateScene)
  const allOff = useHA((s) => s.allOff)
  const env = useHA(useShallow((s) => envIds.map((id) => s.entities[id]?.state)))
  const entities = useHA.getState().entities
  return (
    <>
      <div className="env">
        {envIds.map((id, i) => (
          <div className="env-item" key={id}>
            <span className="env-value">{env[i]}<i>{entities[id].attributes.unit_of_measurement}</i></span>
            <span className="env-label">
              {t(ENV[entities[id].attributes.device_class])}
              {entities[id].attributes.simulated && <em className="env-sim"> · {t('sim_tag')}</em>}
            </span>
          </div>
        ))}
      </div>
      <div className="tiles">
        {SCENES.map((sc) => (
          <button
            key={sc.id}
            className={`tile tile-main is-scene${activeScene === sc.id ? ' is-on' : ''}`}
            aria-pressed={activeScene === sc.id}
            onClick={() => activateScene(sc.id)}
          >
            <Icon name={SCENE_ICON[sc.id]} size={22} className="tile-icon" />
            <span className="tile-name">{t.pick(sc.name)}</span>
            <span className="tile-state">{t('scene_tap')}</span>
          </button>
        ))}
        <button className="tile tile-main is-alloff" onClick={allOff}>
          <Icon name="power" size={22} className="tile-icon" />
          <span className="tile-name">{t('all_off')}</span>
          <span className="tile-state">{t('panel_running', onCount, total)}</span>
        </button>
      </div>
      <EnergyCard />
    </>
  )
}

export default function ControlPanel() {
  const t = useT()
  const isMobile = useIsMobile()
  const open = useHA((s) => s.sheetOpen)
  const setOpen = useHA((s) => s.setSheetOpen)
  const collapsed = useHA((s) => s.panelCollapsed)
  const setPanelCollapsed = useHA((s) => s.setPanelCollapsed)
  const toggle = useHA((s) => s.toggle)
  const tab = useHA((s) => s.panelTab)
  const setTab = useHA((s) => s.setPanelTab)
  const setView = useHA((s) => s.setView)
  const plan = usePlan()
  const tabRefs = useRef({})

  // 扁平视图：id|域|区域|开关|只读。shallow 比较 —— 调亮度、温度不会让整个面板重渲
  const rows = useHA(useShallow((s) => Object.entries(s.entities).map(([id, e]) =>
    `${id}|${e.domain}|${e.area}|${isOn(e) ? 1 : 0}|${isReadOnly(e) ? 1 : 0}|${isEnv(e) ? 1 : 0}`)))
  const parsed = rows.map((r) => {
    const [id, domain, area, on, ro, env] = r.split('|')
    return { id, domain, area, on: on === '1', ro: ro === '1', env: env === '1' }
  })
  const controllable = parsed.filter((r) => !r.ro)
  const onCount = controllable.filter((r) => r.on).length
  const envIds = parsed.filter((r) => r.env).map((r) => r.id)
  const rooms = Object.keys(AREAS).filter((k) => parsed.some((r) => r.area === k && !r.env))
  const current = tab === 'home' || rooms.includes(tab) ? tab : 'home'
  const tabs = ['home', ...rooms]
  const tabName = (k) => (k === 'home' ? t('tab_home') : t.pick(AREAS[k]))
  // 标签用短名，桌面端才能几行内全部排开；面板标题仍用全名
  const tabShort = (k) => (k === 'home' ? t('tab_home') : t.pick(AREAS[k].short))

  // 切标签 = 切房间：相机缓动到该房间视角（有的话）；首页回全屋
  const choose = (k) => {
    setTab(k)
    useHA.getState().setSelected(null)
    const v = k === 'home' ? 'overview' : Object.entries(plan.views).find(([, vv]) => vv.area === k)?.[0]
    if (v) setView(v)
  }
  const onTabKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = tabs[(tabs.indexOf(current) + step + tabs.length) % tabs.length]
    choose(next)
    tabRefs.current[next]?.focus()
  }

  // 收起态：只留一列设备图标，占 58px，仍然能直接开关
  if (!isMobile && collapsed) {
    const entities = useHA.getState().entities
    return (
      <aside className="rail float">
        <button className="rail-btn is-expand" onClick={() => setPanelCollapsed(false)} title={t('panel_expand')}>
          <Icon name="sliders" size={17} />
        </button>
        <span className="rail-rule" />
        {controllable.map(({ id, on }) => (
          <button
            key={id}
            className={`rail-btn${on ? ' is-on' : ''}`}
            onClick={() => toggle(id)}
            title={`${t.pick(entities[id].name)} · ${stateText(entities[id], t)}`}
            aria-label={`${on ? t('state_off') : t('state_on')} · ${t.pick(entities[id].name)}`}
          >
            <Icon name={iconFor(id, entities[id].domain)} size={17} />
          </button>
        ))}
      </aside>
    )
  }

  const list = parsed.filter((r) => r.area === current && !r.env)
  const ctl = list.filter((r) => !r.ro)
  const sensors = list.filter((r) => r.ro)

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

      <div className="panel-head">
        <div className="panel-heading">
          <h2 className="panel-title" onClick={() => isMobile && setOpen(!open)}>{tabName(current)}</h2>
          <span className="panel-sub">{t('panel_running', onCount, controllable.length)}</span>
          {!isMobile && (
            <button
              className="panel-collapse"
              onClick={() => setPanelCollapsed(true)}
              title={t('panel_collapse')}
              aria-label={t('panel_collapse')}
            >
              <Icon name="chevron" size={14} />
            </button>
          )}
        </div>
        <div className="tabs" role="tablist" aria-label={t('tabs_label')} onKeyDown={onTabKey}>
          {tabs.map((k) => (
            <button
              key={k}
              ref={(el) => (tabRefs.current[k] = el)}
              role="tab"
              id={`tab-${k}`}
              aria-selected={current === k}
              aria-controls="panel-tabpanel"
              tabIndex={current === k ? 0 : -1}
              className={`tab${current === k ? ' is-on' : ''}`}
              title={tabName(k)}
              onClick={() => { choose(k); if (isMobile) setOpen(true) }}
            >
              {tabShort(k)}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-body" role="tabpanel" id="panel-tabpanel" aria-labelledby={`tab-${current}`}>
        {current === 'home' ? (
          <HomePage envIds={envIds} onCount={onCount} total={controllable.length} />
        ) : (
          <>
            <div className="tiles">
              {ctl.map((r) => <Tile key={r.id} id={r.id} />)}
            </div>
            {sensors.length > 0 && (
              <div className="stiles">
                {sensors.map((r) => <SensorTile key={r.id} id={r.id} />)}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

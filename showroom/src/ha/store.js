import { create } from 'zustand'
import { INITIAL_ENTITIES, SCENES } from './entities'
import { PLANS, planFromURL, writePlanToURL } from '../plans'

// 户型只带它装了的设备：热点表里出现的实体 + 环境传感器。
// 面板分组、设备计数、场景都只作用在这个子集上。
// 计量传感器（插座功率）带 requires：对应插座在这个户型里才出现。
function entitiesFor(planId) {
  const ids = new Set(PLANS[planId].hotspots.map((h) => h.id))
  const out = {}
  for (const [id, e] of Object.entries(INITIAL_ENTITIES)) {
    if (ids.has(id) || (e.domain === 'sensor' && (!e.requires || ids.has(e.requires)))) out[id] = structuredClone(e)
  }
  return out
}

const initialPlan = planFromURL()

const OVERRIDE_KEY = 'showroom.hotspotOverrides'
const UI_KEY = 'showroom.ui'

function loadUI() {
  try {
    return JSON.parse(localStorage.getItem(UI_KEY)) || {}
  } catch {
    return {}
  }
}

function saveUI(v) {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify(v))
  } catch {
    // 隐私模式下忽略
  }
}

const savedUI = loadUI()

// 官网用 ?lang=zh 切语言，样板间跟着同一个参数走 ——
// 从官网带着语言跳过来，不会莫名其妙切回英文。URL 参数优先于上次的选择。
function initialLang() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'zh' || q === 'en') return q
  } catch {
    // 某些嵌入环境读不到 location，退回已保存的选择
  }
  return savedUI.lang ?? 'en'
}

function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveOverrides(v) {
  try {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(v))
  } catch {
    // 隐私模式下写入会抛错，忽略即可
  }
}

let eventSeq = 0
const stamp = () => new Date().toLocaleTimeString('zh-CN', { hour12: false })

// ---- 演示用的"自动化"：和真实 HA 里的 automation 一样，由状态变化触发 ----
// 所有定时器集中在这里，切户型 / 重置时一次清掉。
const timers = new Map()
function later(key, ms, fn) {
  clearTimeout(timers.get(key))
  timers.set(key, setTimeout(() => { timers.delete(key); fn() }, ms))
}
function cancel(key) {
  clearTimeout(timers.get(key))
  timers.delete(key)
}
function clearTimers() {
  for (const t of timers.values()) clearTimeout(t)
  timers.clear()
}

// 插座功率：由设备状态推算（演示估算，非实测）
function plugWatts(get) {
  const e = get().entities
  const tvOn = e['media_player.living_tv']?.state === 'on'
  const tvPlug = e['switch.tv_plug']?.state === 'on'
  const desk = e['switch.desk_plug']?.state === 'on'
  return {
    'sensor.tv_plug_power': tvPlug ? (tvOn ? 92 : 0.5) : 0,
    'sensor.desk_plug_power': desk ? 46 : 0,
  }
}

function automations(get, id, prev, next) {
  const s = get()
  const ent = (x) => get().entities[x]
  const setE = (x, patch) => ent(x) && s._setEntity(x, patch)
  const changed = prev.state !== next.state

  // 储水式热水器：通电后到点自己关（按真实分钟计，演示里不会提前跳完）
  if (next.attributes?.auto_off_min != null && (changed || next.attributes.auto_off_min !== prev.attributes.auto_off_min)) {
    cancel(`heater:${id}`)
    if (next.state === 'on') later(`heater:${id}`, next.attributes.auto_off_min * 60000, () => setE(id, { state: 'off' }))
  }

  // 大门：开锁 → 门被推开（门磁 on）→ 6 s 后门关上 → 1.5 s 后自动反锁
  if (id === 'lock.entry' && changed) {
    if (next.state === 'unlocked') later('door:open', 700, () => setE('binary_sensor.entry_door', { state: 'on' }))
    else {
      cancel('door:open')
      cancel('door:close')
      if (ent('binary_sensor.entry_door')?.state === 'on') setE('binary_sensor.entry_door', { state: 'off' })
    }
  }
  if (id === 'binary_sensor.entry_door' && changed) {
    if (next.state === 'on') later('door:close', 6000, () => setE('binary_sensor.entry_door', { state: 'off' }))
    else if (ent('lock.entry')?.state === 'unlocked' && ent('lock.entry').attributes.auto_lock) {
      later('door:relock', 1500, () => setE('lock.entry', { state: 'locked' }))
    }
  }

  // 走廊：开了"有人自动开灯"时，人体存在传感器联动筒灯；人走 6 s 后熄灭
  if (id === 'binary_sensor.hall_motion' && changed && ent('input_boolean.hall_auto')?.state === 'on') {
    setE('light.hall_down', { state: next.state === 'on' ? 'on' : 'off' })
  }
  if (id === 'binary_sensor.hall_motion' && next.state === 'on') {
    later('hall:clear', 6000, () => setE('binary_sensor.hall_motion', { state: 'off' }))
  }

  // 扫地机：清扫约 45 s → 回充 8 s → 停靠
  if (id === 'vacuum.robot' && changed) {
    cancel('vac')
    if (next.state === 'cleaning') later('vac', 45000, () => setE('vacuum.robot', { state: 'returning' }))
    if (next.state === 'returning') later('vac', 8000, () => setE('vacuum.robot', { state: 'docked', attributes: { battery_level: 100 } }))
  }

  // 电视插座断电 → 电视跟着断；开电视时插座必须有电
  if (id === 'switch.tv_plug' && changed && next.state === 'off' && ent('media_player.living_tv')?.state === 'on') {
    setE('media_player.living_tv', { state: 'off' })
  }
  if (id === 'media_player.living_tv' && changed && next.state === 'on' && ent('switch.tv_plug')?.state === 'off') {
    setE('switch.tv_plug', { state: 'on' })
  }

  // 功率读数随插座 / 电视状态更新（静默，不刷屏事件流）
  if (id === 'switch.tv_plug' || id === 'switch.desk_plug' || id === 'media_player.living_tv') {
    for (const [sid, w] of Object.entries(plugWatts(get))) {
      if (ent(sid) && ent(sid).state !== String(w)) s._setEntity(sid, { state: String(w) }, { silent: true })
    }
  }
}

// 深合并单个实体的 patch（state / attributes）
function applyPatch(entity, patch) {
  return {
    ...entity,
    ...(patch.state !== undefined ? { state: patch.state } : null),
    attributes: { ...entity.attributes, ...(patch.attributes || null) },
  }
}

export const useHA = create((set, get) => ({
  planId: initialPlan,
  entities: entitiesFor(initialPlan),
  events: [],
  activeScene: null,
  selected: null,          // 当前在面板里展开的实体
  // 手机屏幕小，默认收起标签，只留发光锚点
  // 默认不铺满所有标签（23 个会互相压住）；选中房间时只显示该房间的几个，见 Hotspots.jsx
  showLabels: false,
  view: 'overview',       // 相机预设视角
  sheetOpen: false,       // 手机端底部抽屉
  panelCollapsed: savedUI.panelCollapsed ?? false,  // 右侧面板收成图标条
  focusMode: false,       // 专注模式：隐藏全部界面，只看房子
  lang: initialLang(),

  // 热点标定：拖动 3D 里的锚点并导出坐标，换模型后重新定位用
  calibrating: false,
  calibTarget: null,
  hotspotOverrides: loadOverrides(),
  timeOfDay: 0.62,         // 0=午夜 0.5=正午，驱动窗外日光
  sceneReady: false,       // 场景出了第一帧；加载屏据此淡出，切户型时重置
  panelTab: 'home',        // 触摸屏面板当前标签：home 或区域 key

  setSelected: (id) => set({ selected: id }),
  setShowLabels: (v) => set({ showLabels: v }),
  setView: (v) => set({ view: v }),
  setSheetOpen: (v) => set({ sheetOpen: v }),
  setPanelCollapsed: (v) => {
    saveUI({ ...loadUI(), panelCollapsed: v })
    set({ panelCollapsed: v })
  },
  setFocusMode: (v) => set({ focusMode: v }),
  setLang: (v) => {
    saveUI({ ...loadUI(), lang: v })
    set({ lang: v })
  },
  setCalibrating: (v) => set({ calibrating: v, calibTarget: null, showLabels: v ? true : get().showLabels }),
  setCalibTarget: (id) => set({ calibTarget: id }),
  // 标定坐标按户型分开存，键为 "户型:实体"
  setHotspotPos: (id, pos) => {
    const next = { ...get().hotspotOverrides, [`${get().planId}:${id}`]: pos.map((n) => Math.round(n * 100) / 100) }
    saveOverrides(next)
    set({ hotspotOverrides: next })
  },
  resetHotspots: () => {
    saveOverrides({})
    set({ hotspotOverrides: {}, calibTarget: null })
  },
  setTimeOfDay: (v) => set({ timeOfDay: v }),
  setSceneReady: (v) => set({ sceneReady: v }),
  setPanelTab: (v) => set({ panelTab: v }),

  // 首页"全部关闭"：灯、电视、空调、风扇、热水器、除湿机、晾衣架照明 / 风干；扫地机回充。门锁、窗帘、插座不动。
  allOff: () => {
    const { entities, callService } = get()
    for (const [id, e] of Object.entries(entities)) {
      if (!isOn(e)) continue
      if (['light', 'fan', 'humidifier', 'media_player'].includes(e.domain)) callService(e.domain, 'turn_off', id)
      else if (e.domain === 'climate') callService('climate', 'set_hvac_mode', id, { hvac_mode: 'off' })
      else if (e.domain === 'switch' && e.attributes.auto_off_min != null) callService('switch', 'turn_off', id)
      else if (e.domain === 'vacuum') callService('vacuum', 'return_to_base', id)
    }
  },

  // ---- 等价于 HA 的 state_changed 事件总线 ----
  _emit: (entityId, from, to) =>
    set((s) => ({
      events: [
        { id: ++eventSeq, time: stamp(), entityId, from, to, name: s.entities[entityId]?.name },
        ...s.events,
      ].slice(0, 60),
    })),

  _setEntity: (entityId, patch, { silent = false } = {}) => {
    const prev = get().entities[entityId]
    if (!prev) return
    const next = applyPatch(prev, patch)
    set((s) => ({ entities: { ...s.entities, [entityId]: next } }))
    if (!silent && (prev.state !== next.state || patch.attributes)) {
      get()._emit(entityId, prev.state, next.state)
    }
    automations(get, entityId, prev, next)
  },

  // ---- 等价于 HA 的 call_service，签名刻意保持一致 ----
  callService: (domain, service, entityId, data = {}) => {
    const e = get().entities[entityId]
    if (!e) return
    const set_ = (patch, opts) => get()._setEntity(entityId, patch, opts)

    switch (`${domain}.${service}`) {
      case 'light.turn_on':
      case 'switch.turn_on':
      case 'fan.turn_on':
      case 'camera.turn_on':
      case 'humidifier.turn_on':
      case 'input_boolean.turn_on':
        set_({ state: 'on', attributes: data })
        break
      case 'light.turn_off':
      case 'switch.turn_off':
      case 'fan.turn_off':
      case 'camera.turn_off':
      case 'humidifier.turn_off':
      case 'input_boolean.turn_off':
        set_({ state: 'off' })
        break
      case 'light.toggle':
      case 'switch.toggle':
      case 'fan.toggle':
      case 'camera.toggle':
      case 'humidifier.toggle':
      case 'input_boolean.toggle':
        set_({ state: e.state === 'on' ? 'off' : 'on' })
        break
      case 'humidifier.set_humidity':
        set_({ attributes: { humidity: data.humidity } })
        break
      case 'vacuum.start':
        set_({ state: 'cleaning' })
        break
      case 'vacuum.return_to_base':
        set_({ state: e.state === 'docked' ? 'docked' : 'returning' })
        break
      // 演示用：模拟有人经过（真实 HA 里传感器状态不能被调用，这里只是让访客能触发联动）
      case 'binary_sensor.simulate':
        set_({ state: 'on' })
        break
      case 'lock.lock':
        set_({ state: 'locked' })
        break
      case 'lock.unlock':
        set_({ state: 'unlocked' })
        break
      case 'lock.toggle':
        set_({ state: e.state === 'locked' ? 'unlocked' : 'locked' })
        break
      case 'media_player.turn_on':
        set_({ state: 'on' })
        break
      case 'media_player.turn_off':
        set_({ state: 'off' })
        break
      case 'media_player.toggle':
        set_({ state: e.state === 'on' ? 'off' : 'on' })
        break
      case 'cover.set_cover_position': {
        const p = Math.max(0, Math.min(100, data.position))
        set_({ state: p > 0 ? 'open' : 'closed', attributes: { current_position: p } })
        break
      }
      case 'cover.toggle': {
        const p = e.attributes.current_position > 0 ? 0 : 100
        set_({ state: p > 0 ? 'open' : 'closed', attributes: { current_position: p } })
        break
      }
      case 'climate.set_temperature':
        set_({ attributes: { temperature: data.temperature } })
        break
      case 'climate.set_hvac_mode':
        set_({ state: data.hvac_mode })
        break
      default:
        // 未知服务：静默忽略，真实 HA 会返回错误
        break
    }
    // 手动改动会脱离当前场景
    if (get().activeScene) set({ activeScene: null })
  },

  // 通用开关：面板和 3D 热点共用这一个入口
  toggle: (entityId) => {
    const e = get().entities[entityId]
    if (!e) return
    if (e.domain === 'cover') return get().callService('cover', 'toggle', entityId)
    if (e.domain === 'lock') return get().callService('lock', 'toggle', entityId)
    if (e.domain === 'vacuum') return get().callService('vacuum', e.state === 'docked' ? 'start' : 'return_to_base', entityId)
    if (e.domain === 'binary_sensor') {
      // 门磁跟着门锁走；人体传感器可以"模拟有人经过"；烟雾 / 漏水只读
      if (entityId === 'binary_sensor.hall_motion') return get().callService('binary_sensor', 'simulate', entityId)
      return
    }
    if (e.domain === 'climate') {
      return get().callService('climate', 'set_hvac_mode', entityId, {
        hvac_mode: e.state === 'off' ? 'cool' : 'off',
      })
    }
    get().callService(e.domain, 'toggle', entityId)
  },

  activateScene: (sceneId) => {
    const scene = SCENES.find((s) => s.id === sceneId)
    if (!scene) return
    for (const [entityId, patch] of Object.entries(scene.states)) {
      get()._setEntity(entityId, patch, { silent: true })
    }
    set((s) => ({
      activeScene: sceneId,
      ...(scene.timeOfDay !== undefined ? { timeOfDay: scene.timeOfDay } : null),
      events: [
        { id: ++eventSeq, time: stamp(), entityId: sceneId, from: '-', to: 'activated', name: scene.name, isScene: true },
        ...s.events,
      ].slice(0, 60),
    }))
  },

  reset: () => {
    clearTimers()
    set({ entities: entitiesFor(get().planId), events: [], activeScene: null, selected: null })
  },

  // 切户型：设备回到初始状态，相机回全屋
  setPlan: (planId) => {
    if (!PLANS[planId] || planId === get().planId) return
    clearTimers()
    writePlanToURL(planId)
    set({
      planId,
      entities: entitiesFor(planId),
      events: [],
      activeScene: null,
      selected: null,
      calibTarget: null,
      view: 'overview',
      sceneReady: false,
      panelTab: 'home',
    })
  },
}))

// 选择器
export const selectEntity = (id) => (s) => s.entities[id]
export const isOn = (e) => {
  if (!e) return false
  if (e.domain === 'lock') return e.state === 'locked'
  if (e.domain === 'vacuum') return e.state === 'cleaning' || e.state === 'returning'
  return e.state !== 'off' && e.state !== 'closed' && e.state !== 'unlocked' && e.state !== 'unavailable'
}

// 只读设备（传感器）不计入"N of M devices running"，面板上也没有开关
export const isReadOnly = (e) => e.domain === 'sensor' || e.domain === 'binary_sensor'

// 灯的有效亮度 0..1
export const lightLevel = (e) => (isOn(e) ? (e.attributes.brightness ?? 255) / 255 : 0)

// 当前户型数据
export const usePlan = () => PLANS[useHA((s) => s.planId)]

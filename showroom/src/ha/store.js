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

// ?clean=1：录屏用的干净画面 —— 以专注模式打开，并且不画热点、不显示退出按钮（scripts/record-showroom.mjs 用）
export const CLEAN = (() => {
  try {
    return new URLSearchParams(window.location.search).get('clean') === '1'
  } catch {
    return false
  }
})()

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

// 语言优先级：?lang=zh|en > 地址是 …/zh/（中文页，见 tools/zhPage.js）> 上次的选择 > 英文。
// 旧链接 /showroom/?lang=zh 照样是中文。
function pathLang() {
  try {
    return /\/zh\/(?:index\.html)?$/.test(window.location.pathname) ? 'zh' : null
  } catch {
    return null
  }
}

function initialLang() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'zh' || q === 'en') return q
  } catch {
    // 某些嵌入环境读不到 location，退回已保存的选择
  }
  return pathLang() ?? savedUI.lang ?? 'en'
}

// 切语言时只改地址栏的 ?lang=（不换路径、不刷新）：和本页默认语言一致就去掉，否则写上。
// 这样复制出去的链接、刷新后的页面都是当前语言；路径不动，相对路径的资源和链接不受影响。
function writeLangToURL(lang) {
  try {
    const url = new URL(window.location.href)
    if (lang === (pathLang() ?? 'en')) url.searchParams.delete('lang')
    else url.searchParams.set('lang', lang)
    window.history.replaceState(window.history.state, '', url)
  } catch {
    // sandbox iframe 里 replaceState 可能被拒，忽略
  }
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

// ---- 湿度演示模拟：除湿机 / 空调除湿运行时读数缓慢下降（有下限），关了慢慢回升 ----
// 每 2 秒走一小步，静默更新（不刷事件流）；实体上带 simulated: true，界面标注"演示模拟"。
const AMBIENT_RH = 72          // 新加坡室内不开空调时的常见湿度
const LIVING_RH = { dry: 50, cool: 58 }
let humTimer = null
function startHumiditySim(get) {
  if (humTimer) return
  const approach = (cur, target, down, up) => (cur > target ? Math.max(target, cur - down) : Math.min(target, cur + up))
  humTimer = setInterval(() => {
    const s = get()
    const dh = s.entities['humidifier.bedroom_dehumidifier']
    if (dh) {
      const a = dh.attributes
      const target = dh.state === 'on' ? Math.max(a.humidity, a.min_humidity) : AMBIENT_RH
      const next = Math.round(approach(a.current_humidity, target, 0.5, 0.3) * 10) / 10
      if (next !== a.current_humidity) s._setEntity('humidifier.bedroom_dehumidifier', { attributes: { current_humidity: next } }, { silent: true })
    }
    const rh = s.entities['sensor.living_humidity']
    if (rh) {
      const ac = s.entities['climate.living_ac']?.state
      const cur = rh.attributes.value ?? Number(rh.state)
      const next = Math.round(approach(cur, LIVING_RH[ac] ?? 63, 0.3, 0.2) * 10) / 10
      if (next !== cur) s._setEntity('sensor.living_humidity', { state: String(Math.round(next)), attributes: { value: next } }, { silent: true })
    }
  }, 2000)
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
  // 只认"人"：毫米波存在传感器靠呼吸 / 微动判断，扫地机这类贴地移动物体不算（source 由传感器上报）。
  // 演示里扫地机的路径不经过走廊；就算经过，source 不是 person 也不会点亮走廊灯。
  if (id === 'binary_sensor.hall_motion' && changed && ent('input_boolean.hall_auto')?.state === 'on'
    && (next.state === 'off' || next.attributes.source === 'person')) {
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
  focusMode: CLEAN,       // 专注模式：隐藏全部界面，只看房子
  lang: initialLang(),

  // 热点标定：拖动 3D 里的锚点并导出坐标，换模型后重新定位用
  calibrating: false,
  calibTarget: null,
  hotspotOverrides: loadOverrides(),
  timeOfDay: 0.62,         // 0=午夜 0.5=正午，驱动窗外日光
  sceneReady: false,       // 场景出了第一帧；加载屏据此淡出，切户型时重置
  panelTab: 'home',        // 触摸屏面板当前标签：home 或区域 key
  load: { done: 0, total: 0 },   // 加载屏进度：场景块 + HDRI + 贴图，按文件计
  demo: { status: 'idle', step: 0 },   // 自动演示：idle / running / end / control，由 src/demo.js 驱动

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
    writeLangToURL(v)
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
  loadStart: (n = 1) => set((s) => ({ load: { ...s.load, total: s.load.total + n } })),
  loadDone: (n = 1) => set((s) => ({ load: { ...s.load, done: s.load.done + n } })),

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
        // 人体：模拟有人经过；门窗磁：模拟开 / 关窗（真实 HA 里传感器只能上报，这里只为演示联动）
        if (e.attributes.device_class === 'window') set_({ state: e.state === 'on' ? 'off' : 'on' })
        else set_({ state: 'on', attributes: { source: 'person' } })
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
      if (entityId === 'binary_sensor.hall_motion' || e.attributes.device_class === 'window') {
        return get().callService('binary_sensor', 'simulate', entityId)
      }
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
    // 整个场景一次写进 store（面板与 3D 只重渲一轮），之后再按变化逐个跑联动（门锁、扫地机的定时器等）
    const before = get().entities
    const entities = { ...before }
    for (const [id, patch] of Object.entries(scene.states)) {
      if (!before[id]) continue   // 户型里没有这个设备
      const pos = patch.attributes?.current_position
      // 窗帘只写了开合度时，状态跟着开合度走（0 = closed），磁贴才不会把合上的窗帘显示成"开"
      entities[id] = applyPatch(before[id], before[id].domain === 'cover' && patch.state === undefined && pos !== undefined
        ? { ...patch, state: pos > 0 ? 'open' : 'closed' } : patch)
    }
    // 离家时还有窗开着：事件流里给一条提醒（演示逻辑，相当于 HA 里的一条 notify 自动化）
    const openWindows = sceneId === 'scene.away'
      ? Object.entries(entities).filter(([, e]) => e.attributes?.device_class === 'window' && e.state === 'on').map(([id]) => id)
      : []
    set((s) => ({
      entities,
      activeScene: sceneId,
      ...(scene.timeOfDay !== undefined ? { timeOfDay: scene.timeOfDay } : null),
      events: [
        ...openWindows.map((id) => ({ id: ++eventSeq, time: stamp(), entityId: id, from: '-', to: 'still open!', name: entities[id].name, isScene: true, isWarn: true })),
        { id: ++eventSeq, time: stamp(), entityId: sceneId, from: '-', to: 'activated', name: scene.name, isScene: true },
        ...s.events,
      ].slice(0, 60),
    }))
    for (const id of Object.keys(scene.states)) {
      if (before[id] && before[id] !== entities[id]) automations(get, id, before[id], entities[id])
    }
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

if (typeof window !== 'undefined') startHumiditySim(useHA.getState)

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

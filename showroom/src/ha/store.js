import { create } from 'zustand'
import { INITIAL_ENTITIES, SCENES } from './entities'

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

// 深合并单个实体的 patch（state / attributes）
function applyPatch(entity, patch) {
  return {
    ...entity,
    ...(patch.state !== undefined ? { state: patch.state } : null),
    attributes: { ...entity.attributes, ...(patch.attributes || null) },
  }
}

export const useHA = create((set, get) => ({
  entities: structuredClone(INITIAL_ENTITIES),
  events: [],
  activeScene: null,
  selected: null,          // 当前在面板里展开的实体
  // 手机屏幕小，默认收起标签，只留发光锚点
  showLabels: typeof window === 'undefined' ? true : !window.matchMedia('(max-width: 900px)').matches,
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
  setHotspotPos: (id, pos) => {
    const next = { ...get().hotspotOverrides, [id]: pos.map((n) => Math.round(n * 100) / 100) }
    saveOverrides(next)
    set({ hotspotOverrides: next })
  },
  resetHotspots: () => {
    saveOverrides({})
    set({ hotspotOverrides: {}, calibTarget: null })
  },
  setTimeOfDay: (v) => set({ timeOfDay: v }),

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
        set_({ state: 'on', attributes: data })
        break
      case 'light.turn_off':
      case 'switch.turn_off':
      case 'fan.turn_off':
        set_({ state: 'off' })
        break
      case 'light.toggle':
      case 'switch.toggle':
      case 'fan.toggle':
        set_({ state: e.state === 'on' ? 'off' : 'on' })
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

  reset: () => set({ entities: structuredClone(INITIAL_ENTITIES), events: [], activeScene: null, selected: null }),
}))

// 选择器
export const selectEntity = (id) => (s) => s.entities[id]
export const isOn = (e) => e && e.state !== 'off' && e.state !== 'closed' && e.state !== 'unavailable'

// 灯的有效亮度 0..1
export const lightLevel = (e) => (isOn(e) ? (e.attributes.brightness ?? 255) / 255 : 0)

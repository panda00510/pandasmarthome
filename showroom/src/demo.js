import { useHA } from './ha/store'
import { PLANS } from './plans'

// 自动演示脚本：一份数据。每步可带 view（plans/*.json 的视角 key）、scene（SCENES 的 id）、
// off（先「全部关闭」）、timeOfDay（不写就用场景自带的）、字幕 key（i18n.js）、停留毫秒。三个户型都有 overview / living / bedroom 视角。
// 第一步就要有看得见的变化：天色转入傍晚、灯渐灭（约 1.4 s），下一步「回家」再把灯和窗帘打开。
export const STEPS = [
  { view: 'overview', off: true, timeOfDay: 0.8, caption: 'demo_s_intro', ms: 2500 },
  { view: 'overview', scene: 'scene.home', timeOfDay: 0.8, caption: 'demo_s_home', ms: 3000 },
  { view: 'living', caption: 'demo_s_living', ms: 3500 },
  { view: 'living', scene: 'scene.movie', caption: 'demo_s_movie', ms: 6000 },
  { view: 'bedroom', caption: 'demo_s_bedroom', ms: 3500 },
  { view: 'bedroom', scene: 'scene.sleep', caption: 'demo_s_sleep', ms: 6000 },
  { view: 'overview', scene: 'scene.away', caption: 'demo_s_away', ms: 6000 },
]

const DONE_KEY = 'showroom.demoDone'   // sessionStorage：本会话打断过（或看完过）就不再自动开始
export const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function demoParam() {
  try {
    return new URLSearchParams(window.location.search).get('demo')   // '1' 直接开始，'0' 禁用自动开始
  } catch {
    return null
  }
}
export function demoDone() {
  try {
    return sessionStorage.getItem(DONE_KEY) === '1'
  } catch {
    return false
  }
}
function markDone() {
  try {
    sessionStorage.setItem(DONE_KEY, '1')
  } catch {
    // 隐私模式下忽略
  }
}

let timer = 0
let raf = 0
let snap = null
const setDemo = (status, step = 0) => useHA.setState({ demo: { status, step } })

function clear() {
  clearTimeout(timer)
  cancelAnimationFrame(raf)
  timer = raf = 0
}

// 时间轴缓动到目标时刻（复用 setTimeOfDay，和访客拖滑块走同一条路）
function tweenTime(from, to) {
  const set = useHA.getState().setTimeOfDay
  if (reducedMotion() || Math.abs(to - from) < 0.005) return set(to)
  set(from)   // activateScene 已经把时间跳到场景自带的时刻，先拉回起点，免得闪一帧
  const t0 = performance.now()
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / 1400)
    set(from + (to - from) * (1 - (1 - k) ** 3))
    if (k < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function run(i) {
  clear()
  if (i >= STEPS.length) return finish()
  const st = STEPS[i]
  const s = useHA.getState()
  const from = s.timeOfDay
  setDemo('running', i)
  if (st.view) {
    s.setView(st.view)
    // 面板跟到同一个房间标签：镜头里看不到的设备（如主卧吊扇、空调）在磁贴上能看到状态变化
    s.setPanelTab(PLANS[s.planId].views[st.view]?.area ?? 'home')
  }
  if (st.off) s.allOff()
  if (st.scene) s.activateScene(st.scene)
  tweenTime(from, st.timeOfDay ?? useHA.getState().timeOfDay)
  timer = setTimeout(() => run(i + 1), st.ms)
}

export function startDemo() {
  clear()
  const s = useHA.getState()
  snap = { entities: s.entities, activeScene: s.activeScene, timeOfDay: s.timeOfDay, panelTab: s.panelTab }
  s.setSelected(null)
  run(0)
}

// 结束：设备回到演示开始前的状态。逐个走 _setEntity（静默）让门锁 / 扫地机这些联动取消各自的定时器，
// 再整体换回快照对象，连场景额外加上的属性也一并去掉。
function finish() {
  const s = useHA.getState()
  const from = s.timeOfDay
  for (const [id, e] of Object.entries(snap.entities)) {
    if (s.entities[id] && s.entities[id] !== e) s._setEntity(id, { state: e.state, attributes: e.attributes }, { silent: true })
  }
  useHA.setState({ entities: snap.entities, activeScene: snap.activeScene, panelTab: snap.panelTab })
  s.setView('overview')
  tweenTime(from, snap.timeOfDay)
  markDone()
  setDemo('end')
}

// 访客打断：停在当前状态，提示 2 秒
export function interruptDemo() {
  clear()
  markDone()
  setDemo('control')
  timer = setTimeout(() => setDemo('idle'), 2000)
}

// 安静地停（切户型 / 卸载 / 关结束卡片）
export function stopDemo() {
  clear()
  setDemo('idle')
}

// 演示中切户型：场景整组重挂，演示停掉
useHA.subscribe((s, p) => {
  if (s.planId !== p.planId && s.demo.status === 'running') stopDemo()
})

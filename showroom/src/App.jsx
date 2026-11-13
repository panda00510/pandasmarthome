import { lazy, Suspense, useEffect } from 'react'
import { useHA, usePlan, CLEAN } from './ha/store'
import { loadScene } from './sceneChunk'
import Brand from './ui/Brand'
import ViewRail from './ui/ViewRail'
import Console from './ui/Console'
import ControlPanel from './ui/ControlPanel'
import EventLog from './ui/EventLog'
import CalibrationBar from './ui/CalibrationBar'
import Assess from './ui/Assess'
import Loader from './ui/Loader'
import PlanSwitch from './ui/PlanSwitch'
import Demo from './ui/Demo'
import Icon from './ui/icons'
import { useT } from './i18n'

const Scene = lazy(loadScene)

// 退出专注模式后把焦点还给工具栏里的"专注模式"按钮（它刚从 visibility:hidden 回来）
function exitFocus() {
  useHA.getState().setFocusMode(false)
  requestAnimationFrame(() => document.querySelector('[data-focus-btn]')?.focus())
}

// Esc 一层一层退：专注模式 → 标定 → 展开的调节条（焦点回到它的"调节"按钮）→ 手机抽屉。
// 演示中的 Esc 由 Demo.jsx 处理（任何按键都会打断演示）。
function onEscape(e) {
  if (e.key !== 'Escape') return
  const s = useHA.getState()
  if (s.focusMode) exitFocus()
  else if (s.calibrating) s.setCalibrating(false)
  else if (s.selected) {
    const more = document.querySelector(`[aria-controls="adj-${CSS.escape(s.selected)}"]`)
    s.setSelected(null)
    more?.focus()
  } else if (s.sheetOpen) s.setSheetOpen(false)
}

export default function App() {
  const t = useT()
  const focusMode = useHA((s) => s.focusMode)
  const collapsed = useHA((s) => s.panelCollapsed)
  const plan = usePlan()

  useEffect(() => {
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  // 语言切换时同步 <html lang> 与页面标题（读屏软件按 lang 选发音）
  useEffect(() => {
    document.documentElement.lang = t.lang === 'zh' ? 'zh-Hans' : 'en'
    document.title = t('page_title')
  }, [t.lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // Tab 顺序 = DOM 顺序：户型 → 视角 → 工具 → 演示 / 时间轴 → 设备面板 → 预约 → 事件流。
  // 3D 热点标签是鼠标用的快捷方式，不进 Tab 顺序；同样的操作全在设备面板里。
  return (
    <div className={`app${focusMode ? ' is-focus' : ''}${collapsed ? ' is-narrow' : ''}`}>
      <div className="canvas-layer" role="img" aria-label={t('canvas_alt', t.pick(plan.layout))}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      <PlanSwitch />
      <ViewRail />
      <Brand />
      <Console />
      <Demo />
      <ControlPanel />
      <Assess />
      <EventLog />
      <CalibrationBar />
      <Loader />

      {focusMode && !CLEAN && (
        <button className="focus-exit float" onClick={exitFocus} autoFocus>
          <Icon name="collapse" size={15} />
          <span>{t('focus_exit')}</span>
        </button>
      )}
    </div>
  )
}

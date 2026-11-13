import { lazy, Suspense, useEffect } from 'react'
import { useHA } from './ha/store'
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

export default function App() {
  const t = useT()
  const focusMode = useHA((s) => s.focusMode)
  const setFocusMode = useHA((s) => s.setFocusMode)
  const collapsed = useHA((s) => s.panelCollapsed)

  useEffect(() => {
    if (!focusMode) return
    const onKey = (e) => e.key === 'Escape' && setFocusMode(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusMode, setFocusMode])

  return (
    <div className={`app${focusMode ? ' is-focus' : ''}${collapsed ? ' is-narrow' : ''}`}>
      <div className="canvas-layer">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      <Brand />
      <PlanSwitch />
      <ViewRail />
      <Assess />
      <Console />
      <Demo />
      <ControlPanel />
      <EventLog />
      <CalibrationBar />
      <Loader />

      {focusMode && (
        <button className="focus-exit float" onClick={() => setFocusMode(false)}>
          <Icon name="collapse" size={15} />
          <span>{t('focus_exit')}</span>
        </button>
      )}
    </div>
  )
}

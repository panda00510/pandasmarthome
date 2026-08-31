import { useEffect } from 'react'
import { useHA } from './ha/store'
import Scene from './three/Scene'
import Brand from './ui/Brand'
import ViewRail from './ui/ViewRail'
import Console from './ui/Console'
import ControlPanel from './ui/ControlPanel'
import EventLog from './ui/EventLog'
import CalibrationBar from './ui/CalibrationBar'
import Icon from './ui/icons'
import { useT } from './i18n'

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
        <Scene />
      </div>

      <Brand />
      <ViewRail />
      <Console />
      <ControlPanel />
      <EventLog />
      <CalibrationBar />

      {focusMode && (
        <button className="focus-exit float" onClick={() => setFocusMode(false)}>
          <Icon name="collapse" size={15} />
          <span>{t('focus_exit')}</span>
        </button>
      )}
    </div>
  )
}

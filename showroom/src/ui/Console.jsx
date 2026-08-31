import { useHA } from '../ha/store'
import { SCENES } from '../ha/entities'
import { useT } from '../i18n'
import { useIsMobile } from '../hooks'
import Icon, { SCENE_ICON } from './icons'

const clock = (t) => {
  const total = Math.round(t * 24 * 60)
  const h = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const m = String(total % 60).padStart(2, '0')
  return `${h}:${m}`
}

export default function Console() {
  const t = useT()
  const activeScene = useHA((s) => s.activeScene)
  const activateScene = useHA((s) => s.activateScene)
  const timeOfDay = useHA((s) => s.timeOfDay)
  const setTimeOfDay = useHA((s) => s.setTimeOfDay)
  const sheetOpen = useHA((s) => s.sheetOpen)
  const isMobile = useIsMobile()
  const hidden = isMobile && sheetOpen

  return (
    <div className={`console float${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      <div className="scenes">
        {SCENES.map((s) => (
          <button
            key={s.id}
            className={`scene${activeScene === s.id ? ' is-on' : ''}`}
            onClick={() => activateScene(s.id)}
            aria-pressed={activeScene === s.id}
          >
            <Icon name={SCENE_ICON[s.id]} size={19} />
            <span>{t.pick(s.name)}</span>
          </button>
        ))}
      </div>

      <div className="clock">
        <Icon name="sun" size={15} />
        <input
          className="time-range"
          type="range" min={0} max={1} step={0.005}
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(Number(e.target.value))}
          aria-label="Time of day"
        />
        <Icon name="moon" size={15} />
        <span className="clock-time">{clock(timeOfDay)}</span>
      </div>
    </div>
  )
}

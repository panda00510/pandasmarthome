import { useHA } from '../ha/store'
import { useT } from '../i18n'
import { useIsMobile } from '../hooks'
import Icon from './icons'
import { DemoButton } from './Demo'

const clock = (t) => {
  const total = Math.round(t * 24 * 60)
  const h = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const m = String(total % 60).padStart(2, '0')
  return `${h}:${m}`
}

// 场景按钮已移到右侧触摸屏面板的首页，这里是"观看演示"按钮 + 时间轴
export default function Console() {
  const t = useT()
  const timeOfDay = useHA((s) => s.timeOfDay)
  const setTimeOfDay = useHA((s) => s.setTimeOfDay)
  const sheetOpen = useHA((s) => s.sheetOpen)
  const isMobile = useIsMobile()
  const hidden = isMobile && sheetOpen

  return (
    <div className={`console float${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      <DemoButton />
      <div className="clock">
        <Icon name="sun" size={15} />
        <input
          className="time-range"
          type="range" min={0} max={1} step={0.005}
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(Number(e.target.value))}
          aria-label={t('time_of_day')}
        />
        <Icon name="moon" size={15} />
        <span className="clock-time">{clock(timeOfDay)}</span>
      </div>
    </div>
  )
}

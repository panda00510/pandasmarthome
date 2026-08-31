import { useState } from 'react'
import { useHA } from '../ha/store'
import { useT } from '../i18n'
import Icon from './icons'

export default function EventLog() {
  const t = useT()
  const events = useHA((s) => s.events)
  const calibrating = useHA((s) => s.calibrating)
  const [open, setOpen] = useState(false)

  if (calibrating) return null

  return (
    <div className={`log float${open ? ' is-open' : ''}`}>
      <button className="log-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="log-pulse" />
        {t('log_title')}
        <span className="log-count">{events.length}</span>
        <Icon name="chevron" size={12} className="log-chevron" />
      </button>

      {open && (
        <div className="log-list">
          {events.length === 0 && <div className="log-empty">{t('log_empty')}</div>}
          {events.map((ev) => (
            <div className="log-row" key={ev.id}>
              <span className="log-time">{ev.time}</span>
              <span className="log-entity">{ev.entityId}</span>
              <span className="log-delta">{ev.isScene ? ev.to : `${ev.from}→${ev.to}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

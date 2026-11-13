import { useHA, usePlan } from '../ha/store'
import { useT } from '../i18n'
import Icon, { VIEW_ICON } from './icons'

export default function ViewRail() {
  const t = useT()
  const view = useHA((s) => s.view)
  const setView = useHA((s) => s.setView)
  const { views } = usePlan()

  return (
    <nav className="views float" aria-label={t('views')}>
      {Object.entries(views).map(([key, v]) => (
        <button
          key={key}
          className={`view${view === key ? ' is-on' : ''}`}
          onClick={() => setView(key)}
          aria-current={view === key}
        >
          <Icon name={VIEW_ICON[key] ?? 'bed'} size={19} />
          <span>{t.pick(v.name)}</span>
        </button>
      ))}
    </nav>
  )
}

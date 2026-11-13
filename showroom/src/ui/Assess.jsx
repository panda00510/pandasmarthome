import { useHA } from '../ha/store'
import { useT } from '../i18n'
import { useAssessHref } from '../contact'
import Icon from './icons'

// 预约入口。专注模式和标定模式里让开，避免挡住房子或标定面板。
export default function Assess() {
  const t = useT()
  const calibrating = useHA((s) => s.calibrating)
  const href = useAssessHref()
  if (calibrating) return null

  return (
    <aside className="assess float">
      <p className="assess-note">{t('demo_note')}</p>
      {href && (
        <a
          className="assess-btn"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="whatsapp" size={16} />
          <span>{t('cta_whatsapp')}</span>
        </a>
      )}
    </aside>
  )
}

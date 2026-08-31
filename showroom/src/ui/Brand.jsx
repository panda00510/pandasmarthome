import { useHA } from '../ha/store'
import { useT } from '../i18n'
import Icon from './icons'
import PandaLogo from './PandaLogo'

export default function Brand() {
  const t = useT()
  const showLabels = useHA((s) => s.showLabels)
  const setShowLabels = useHA((s) => s.setShowLabels)
  const calibrating = useHA((s) => s.calibrating)
  const setCalibrating = useHA((s) => s.setCalibrating)
  const reset = useHA((s) => s.reset)
  const setFocusMode = useHA((s) => s.setFocusMode)
  const lang = useHA((s) => s.lang)
  const setLang = useHA((s) => s.setLang)

  return (
    <div className="brand">
      <div className="brand-mark">
        <PandaLogo size={27} className="brand-logo" />
        <div className="brand-text">
          <h1>{t('brand_name')}</h1>
          <p>{t('brand_sub')}</p>
        </div>
      </div>

      <div className="tools float">
        <button
          className="tool is-lang"
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          title={t('tool_lang')}
        >
          {lang === 'en' ? '中' : 'EN'}
        </button>
        <span className="tool-rule" />
        <button
          className={`tool${showLabels ? ' is-on' : ''}`}
          onClick={() => setShowLabels(!showLabels)}
          title={showLabels ? t('tool_labels_on') : t('tool_labels_off')}
        >
          <Icon name="tag" />
        </button>
        <button
          className={`tool${calibrating ? ' is-on' : ''}`}
          onClick={() => setCalibrating(!calibrating)}
          title={t('tool_calibrate')}
        >
          <Icon name="crosshair" />
        </button>
        <button className="tool" onClick={reset} title={t('tool_reset')}>
          <Icon name="undo" />
        </button>
        <span className="tool-rule" />
        <button className="tool" onClick={() => setFocusMode(true)} title={t('tool_focus')}>
          <Icon name="expand" />
        </button>
      </div>
    </div>
  )
}

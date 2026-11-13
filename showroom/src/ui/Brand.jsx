import { useHA, usePlan } from '../ha/store'
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
  const plan = usePlan()
  // 样板间部署在 /showroom/，官网在上一级；中文回到 /zh/
  const siteHref = lang === 'zh' ? '../zh/' : '../'

  return (
    <div className="brand">
      <div className="brand-mark">
        <PandaLogo size={27} className="brand-logo" />
        <div className="brand-text">
          <h1>{t('brand_name')}</h1>
          <p>{t('brand_sub', t.pick(plan.layout))}</p>
        </div>
      </div>

      <div className="tools float">
        <a className="tool is-back" href={siteHref} title={t('back_site')} aria-label={t('back_site')}>
          <Icon name="exit" />
          <span className="tool-label">{t('back_site')}</span>
        </a>
        <span className="tool-rule" aria-hidden="true" />
        <button
          className="tool is-lang"
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          title={t('tool_lang')}
          aria-label={t('tool_lang')}
          lang={lang === 'en' ? 'zh-Hans' : 'en'}
        >
          <span aria-hidden="true">{lang === 'en' ? '中' : 'EN'}</span>
        </button>
        <span className="tool-rule" />
        <button
          className={`tool${showLabels ? ' is-on' : ''}`}
          onClick={() => setShowLabels(!showLabels)}
          title={showLabels ? t('tool_labels_on') : t('tool_labels_off')}
          aria-label={t('tool_labels_off')}
          aria-pressed={showLabels}
        >
          <Icon name="tag" />
        </button>
        <button
          className={`tool is-calib${calibrating ? ' is-on' : ''}`}
          onClick={() => setCalibrating(!calibrating)}
          title={t('tool_calibrate')}
          aria-label={t('tool_calibrate')}
          aria-pressed={calibrating}
        >
          <Icon name="crosshair" />
        </button>
        <button className="tool" onClick={reset} title={t('tool_reset')} aria-label={t('tool_reset')}>
          <Icon name="undo" />
        </button>
        <span className="tool-rule" />
        <button className="tool" data-focus-btn="" onClick={() => setFocusMode(true)} title={t('tool_focus')} aria-label={t('tool_focus')}>
          <Icon name="expand" />
        </button>
      </div>
    </div>
  )
}

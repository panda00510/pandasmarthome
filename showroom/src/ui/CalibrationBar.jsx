import { useRef, useState } from 'react'
import Icon from './icons'
import { useT } from '../i18n'
import { useHA } from '../ha/store'
import { HOTSPOTS } from '../three/Hotspots'

export default function CalibrationBar() {
  const t = useT()
  const calibrating = useHA((s) => s.calibrating)
  const calibTarget = useHA((s) => s.calibTarget)
  const overrides = useHA((s) => s.hotspotOverrides)
  const entities = useHA((s) => s.entities)
  const setHotspotPos = useHA((s) => s.setHotspotPos)
  const resetHotspots = useHA((s) => s.resetHotspots)
  const setCalibrating = useHA((s) => s.setCalibrating)
  const [copied, setCopied] = useState(false)
  const [fallback, setFallback] = useState('')
  const area = useRef()

  if (!calibrating) return null

  const changed = Object.keys(overrides).length
  const conf = HOTSPOTS.find((h) => h.id === calibTarget)
  const pos = conf ? overrides[conf.id] ?? conf.pos : null

  const buildCode = () => {
    const body = HOTSPOTS.map((h) => {
      const p = overrides[h.id] ?? h.pos
      return `  { id: '${h.id}', pos: [${p.map((n) => Number(n).toFixed(2)).join(', ')}] },`
    }).join('\n')
    return `export const HOTSPOTS = [\n${body}\n]`
  }

  const copy = async () => {
    const code = buildCode()
    try {
      await navigator.clipboard.writeText(code)
      setFallback('')
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // 浏览器拒绝剪贴板时，把代码摊开让用户自己复制，而不是假装成功
      setFallback(code)
      setTimeout(() => area.current?.select(), 0)
    }
  }

  const setAxis = (i, v) => {
    const next = [...pos]
    next[i] = Number(v)
    setHotspotPos(conf.id, next)
  }

  return (
    <div className="calib float">
      <div className="calib-head">
        <span className="calib-badge">{t('calib_badge')}</span>
        <span className="calib-hint">
          {conf ? t('calib_hint_drag') : t('calib_hint_pick')}
        </span>
        <button className="calib-close" onClick={() => setCalibrating(false)} aria-label={t('calib_close')}>
          <Icon name="close" size={13} />
        </button>
      </div>

      {conf && (
        <div className="calib-target">
          <div className="calib-name">{t.pick(entities[conf.id]?.name)}</div>
          <div className="calib-eid">{conf.id}</div>
          <div className="calib-axes">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <label className="calib-axis" key={axis}>
                <span>{axis}</span>
                <input
                  type="number" step="0.05" value={pos[i]}
                  onChange={(e) => setAxis(i, e.target.value)}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {fallback && (
        <div className="calib-fallback">
          <p>{t('calib_fallback')}</p>
          <textarea ref={area} readOnly value={fallback} rows={6} />
        </div>
      )}

      <div className="calib-actions">
        <button className="calib-btn is-primary" onClick={copy}>
          {copied ? t('calib_copied') : `${t('calib_copy')}${changed ? t('calib_changes', changed) : ''}`}
        </button>
        <button className="calib-btn" onClick={() => { setFallback(''); resetHotspots() }} disabled={!changed}>
          {t('calib_reset')}
        </button>
      </div>
    </div>
  )
}

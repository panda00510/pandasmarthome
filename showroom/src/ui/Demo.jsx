import { useEffect, useRef } from 'react'
import { useHA } from '../ha/store'
import { useT } from '../i18n'
import { STEPS, startDemo, stopDemo, interruptDemo, demoParam, demoDone, reducedMotion } from '../demo'
import { useAssessHref } from '../contact'
import Icon from './icons'

const IDLE_MS = 6000     // 加载屏消失后这么久没有任何交互就自动开始
const LOADER_FADE = 420  // 与 Loader.jsx 的淡出时长一致
const ACTS = ['pointerdown', 'wheel', 'keydown', 'touchstart']

// "观看演示"按钮（放在底部时间轴里）。演示中再点 = 停止。
export function DemoButton() {
  const t = useT()
  const running = useHA((s) => s.demo.status === 'running')
  return (
    <button
      className={`demo-btn${running ? ' is-on' : ''}`}
      data-demo=""
      aria-pressed={running}
      onClick={() => (running ? interruptDemo() : startDemo())}
    >
      <Icon name={running ? 'stop' : 'play'} size={13} />
      <span>{t('demo_watch')}</span>
    </button>
  )
}

// 字幕 / 结束卡片 / "现在由你来控制"提示，同一个位置；同时负责自动开始与打断。
export default function Demo() {
  const t = useT()
  const { status, step } = useHA((s) => s.demo)
  const ready = useHA((s) => s.sceneReady)
  const href = useAssessHref()
  const armed = useRef(false)

  // 打断：任何交互（演示自己的按钮除外，Esc 例外）立即停下；结束卡片遇到别处的交互就收起
  useEffect(() => {
    const onAct = (e) => {
      if (e.key !== 'Escape' && e.target?.closest?.('[data-demo]')) return
      const st = useHA.getState().demo.status
      if (st === 'running') interruptDemo()
      else if (st === 'end') stopDemo()
    }
    for (const a of ACTS) window.addEventListener(a, onAct, { capture: true, passive: true })
    return () => {
      for (const a of ACTS) window.removeEventListener(a, onAct, { capture: true })
      stopDemo()
    }
  }, [])

  // 自动开始：只在首次出帧后武装一次；?demo=1 直接开始，?demo=0 / 减少动态 / 本会话打断过则不自动开始
  useEffect(() => {
    // 只武装一次：切户型时 sceneReady 会再变 true，但不重新计时
    if (!ready || armed.current) return
    armed.current = true
    const param = demoParam()
    if (param !== '1' && (param === '0' || reducedMotion() || demoDone())) return
    let touched = false
    let fired = false
    const onAct = () => (touched = true)
    for (const a of ACTS) window.addEventListener(a, onAct, { capture: true, passive: true })
    const id = setTimeout(() => {
      fired = true
      const s = useHA.getState()
      // ponytail: 后台标签页里不自动开始，也不再补开
      if (param === '1' || (!touched && !s.calibrating && !s.focusMode && document.visibilityState === 'visible')) startDemo()
    }, LOADER_FADE + (param === '1' ? 300 : IDLE_MS))
    return () => {
      clearTimeout(id)
      for (const a of ACTS) window.removeEventListener(a, onAct, { capture: true })
      if (!touched && !fired) armed.current = false   // StrictMode 的二次挂载：还没轮到就被清掉，允许重新武装
    }
  }, [ready])

  const siteContact = t.lang === 'zh' ? '../zh/#contact' : '../#contact'

  return (
    <div className="demo-cap" aria-live="polite" aria-label={t('demo_region')} data-demo="">
      {status === 'running' && (
        <div className="demo-card float">
          <p className="demo-text">{t(STEPS[step].caption)}</p>
          <span className="demo-dots" aria-hidden="true">
            {STEPS.map((_, i) => <i key={i} className={i === step ? 'is-on' : i < step ? 'is-past' : ''} />)}
          </span>
        </div>
      )}
      {status === 'end' && (
        <div className="demo-card float is-end">
          <p className="demo-text">{t('demo_end')}</p>
          <div className="demo-actions">
            <button className="demo-act" onClick={stopDemo}>{t('demo_try')}</button>
            <a
              className="demo-act is-primary"
              href={href || siteContact}
              {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
              onClick={stopDemo}
            >
              {href && <Icon name="whatsapp" size={15} />}
              <span>{t('demo_get')}</span>
            </a>
          </div>
        </div>
      )}
      {status === 'control' && <div className="demo-card float is-toast"><p className="demo-text">{t('demo_control')}</p></div>}
    </div>
  )
}

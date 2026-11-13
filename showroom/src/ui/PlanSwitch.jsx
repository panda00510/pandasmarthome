import { useEffect, useRef, useState } from 'react'
import { useHA } from '../ha/store'
import { PLANS } from '../plans'
import { useT } from '../i18n'

const HINT_KEY = 'showroom.planHintSeen'
const seen = () => {
  try {
    return localStorage.getItem(HINT_KEY) === '1'
  } catch {
    return true            // 读不到存储（隐私模式）时宁可不打扰
  }
}
const markSeen = () => {
  try {
    localStorage.setItem(HINT_KEY, '1')
  } catch {
    // 忽略
  }
}

// 户型切换：一眼能看到的分段按钮（radiogroup，方向键切换）。
// 首次进入、加载屏淡出后给一次轻提示：分段按钮脉冲一次 + 3 秒后消失的气泡。
export default function PlanSwitch() {
  const t = useT()
  const planId = useHA((s) => s.planId)
  const setPlan = useHA((s) => s.setPlan)
  const ready = useHA((s) => s.sceneReady)
  const [hint, setHint] = useState(false)
  const refs = useRef({})
  const ids = Object.keys(PLANS)

  useEffect(() => {
    if (!ready || seen()) return
    markSeen()
    const show = setTimeout(() => setHint(true), 600)
    const hide = setTimeout(() => setHint(false), 3600)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [ready])

  const choose = (id) => {
    setHint(false)
    markSeen()
    setPlan(id)
  }

  const onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = ids[(ids.indexOf(planId) + step + ids.length) % ids.length]
    choose(next)
    refs.current[next]?.focus()
  }

  return (
    <div className={`plans float${hint ? ' is-hint' : ''}`}>
      <span className="plans-label" id="plans-label">{t('plan_label')}</span>
      <div className="plans-seg" role="radiogroup" aria-labelledby="plans-label" onKeyDown={onKey}>
        {ids.map((id) => {
          const [name, area] = t.pick(PLANS[id].short).split(' · ')
          const on = id === planId
          return (
            <button
              key={id}
              ref={(el) => (refs.current[id] = el)}
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              className={`plan-opt${on ? ' is-on' : ''}`}
              onClick={() => choose(id)}
            >
              <span className="plan-name">{name}</span>
              <span className="plan-area">{area}</span>
            </button>
          )
        })}
      </div>
      {hint && <span className="plans-bubble" role="status">{t('plan_hint')}</span>}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useHA } from '../ha/store'
import { PANDA_PATH } from './PandaLogo'

// 与 index.html 静态首屏同一套类名（样式也写在 index.html 里），React 接管后画面不跳。
// 盖到场景真正出第一帧（sceneReady，见 Scene.jsx 的 FirstFrame），再 400ms 淡出。
// 进度来自 store.load：3D 场景块、HDRI、CC0 贴图，按文件计，是真实数字（不依赖 drei，加载屏不必等 3D 块）；
// 全部下完、只剩 shader 编译时，换回不确定进度条，不伪造百分比。
export default function Loader() {
  const ready = useHA((s) => s.sceneReady)
  // 淡出结束后卸载；ready 变回 false（切户型）时 goneFor 不再等于当前轮次，自动重新显示
  const planId = useHA((s) => s.planId)
  const [goneFor, setGoneFor] = useState(null)

  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => {
      performance.mark('sr:loader-gone')
      setGoneFor(planId)
    }, 420)
    return () => clearTimeout(id)
  }, [ready, planId])

  const { done: loaded, total } = useHA((s) => s.load)
  const det = total > 0 && loaded < total

  if (ready && goneFor === planId) return null
  return (
    <div className={`boot${ready ? ' is-done' : ''}`} role="status" aria-live="polite" aria-hidden={ready}>
      <div className="boot-inner">
        <svg className="boot-logo" viewBox="28 58 418 354" aria-hidden="true">
          <path fill="currentColor" fillRule="evenodd" d={PANDA_PATH} />
        </svg>
        <div className={`boot-bar${det ? ' is-det' : ''}`} style={det ? { '--p': `${(loaded / total) * 100}%` } : undefined} />
        <p className="boot-text">
          <span>Loading showroom…{det ? ` ${loaded}/${total}` : ''}</span>
          <span>正在加载样板间…</span>
        </p>
      </div>
    </div>
  )
}

import { useHA } from './ha/store'

// 3D 场景块的唯一入口：main.jsx 一启动就调用（并行下载），App 的 React.lazy 复用同一个 Promise。
// 下载计入加载屏的进度（按文件计）。
let promise = null
export function loadScene() {
  if (!promise) {
    const { loadStart, loadDone } = useHA.getState()
    loadStart()
    promise = import('./three/Scene').then((m) => {
      performance.mark('sr:chunk')
      loadDone()
      return m
    })
  }
  return promise
}

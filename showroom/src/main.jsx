import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadScene } from './sceneChunk'
import hdriUrl from './assets/hdri/studio_small_09_256.hdr?url'

// 性能打点（performance.mark，开销可忽略）：JS 开始执行 → Canvas 创建 → 首帧 → 加载屏消失
performance.mark('sr:js')
// 3D 场景（three / R3F / drei / 后处理）是单独的懒加载块：UI 外壳先挂载，场景块同时开始下载
loadScene()
// HDRI 与 3D 块并行下载（preload as=fetch，RGBELoader 的 fetch 会直接命中这份预加载）
const pre = document.createElement('link')
pre.rel = 'preload'
pre.as = 'fetch'
pre.crossOrigin = 'anonymous'
pre.href = hdriUrl
document.head.appendChild(pre)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

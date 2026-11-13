import p3 from './3room.json'
import p4 from './4room.json'
import p5 from './5room.json'

// 每个户型一份 JSON，是该户型唯一的数据源（墙、灯、家具、设备、热点、相机）。
// 顺序就是切换菜单里的顺序。
export const PLANS = { '3room': p3, '4room': p4, '5room': p5 }
export const DEFAULT_PLAN = '4room'

// 官网深链：?plan=3room
export function planFromURL() {
  try {
    const q = new URLSearchParams(window.location.search).get('plan')
    if (PLANS[q]) return q
  } catch {
    // 嵌入环境读不到 location 时退回默认
  }
  return DEFAULT_PLAN
}

// 切换后把 ?plan= 写回地址栏，复制链接即可分享当前户型
export function writePlanToURL(id) {
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('plan', id)
    window.history.replaceState(window.history.state, '', url)
  } catch {
    // sandbox iframe 里 replaceState 可能被拒，忽略
  }
}

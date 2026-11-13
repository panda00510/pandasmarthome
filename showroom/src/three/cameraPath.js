// 视角之间的相机航线。直线缓动会让镜头从全屋俯视斜插进客厅、中途穿过一面墙；
// 这里改成折线：低于墙顶的一端先竖直升到墙顶以上 CLEAR 米，在墙顶以上平移，再竖直落进目标房间，
// 拐角按 ROUND 米倒圆，整段按弧长匀速取点（外面再套缓动）。两端都高于墙顶时就是直线。
// 自检（三个户型任意两视角都不进墙、不进大件家具）：node src/three/cameraPath.test.mjs
const CLEAR = 0.8
const ROUND = 1.2
const N = 24 // 每段采样数

const sub = (a, b) => a.map((v, i) => v - b[i])
const len = (a) => Math.hypot(...a)
const along = (p, q, d) => {
  const v = sub(q, p)
  const l = len(v) || 1
  return p.map((x, i) => x + (v[i] / l) * d)
}

export function flightPath(from, to, wallH) {
  const top = wallH + CLEAR
  const pts = [from]
  if (from[1] < top) pts.push([from[0], top, from[2]])
  if (to[1] < top) pts.push([to[0], top, to[2]])
  pts.push(to)

  // 倒圆角折线 → 采样点
  const samples = [from]
  let cursor = from
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]]
    const r = Math.min(ROUND, len(sub(b, a)) / 2, len(sub(c, b)) / 2)
    const q0 = along(b, a, r)
    const q2 = along(b, c, r)
    for (let k = 1; k <= N; k++) samples.push(cursor.map((x, j) => x + (q0[j] - x) * (k / N)))
    for (let k = 1; k <= N; k++) {
      const t = k / N
      samples.push(b.map((x, j) => (1 - t) ** 2 * q0[j] + 2 * t * (1 - t) * x + t * t * q2[j]))
    }
    cursor = q2
  }
  for (let k = 1; k <= N; k++) samples.push(cursor.map((x, j) => x + (to[j] - x) * (k / N)))

  const acc = [0]
  for (let i = 1; i < samples.length; i++) acc.push(acc[i - 1] + len(sub(samples[i], samples[i - 1])))
  const total = acc.at(-1)
  const at = (u) => {
    if (!(total > 1e-6) || u >= 1) return to
    const d = Math.max(0, u) * total
    let i = 1
    while (acc[i] < d) i++
    const k = (d - acc[i - 1]) / (acc[i] - acc[i - 1] || 1)
    return samples[i - 1].map((x, j) => x + (samples[i][j] - x) * k)
  }
  return { at, meters: total }
}

// 时长随航线长度：房间之间约 1.6 s，全屋 → 房间约 2.2 s
export const flightSeconds = (meters) => Math.min(2.6, Math.max(1.4, 0.9 + meters * 0.08))

// 正弦缓入缓出：起步比三次曲线快，点下去立刻看得到镜头在动
export const easeInOut = (k) => (1 - Math.cos(Math.PI * k)) / 2

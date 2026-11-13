// 自检：三个户型、任意两个视角之间（含手机版全屋机位），相机航线不进墙体、不进大件家具。
// 墙按实心算（门窗洞也算墙：穿窗玻璃一样难看）。运行：node src/three/cameraPath.test.mjs
import { readFileSync } from 'node:fs'
import { flightPath } from './cameraPath.js'

// 房间机位本来就贴着身后的墙（离墙面约 9 cm、背对墙），所以只要求相机点在墙体外 4 cm 以上
const NEAR = 0.04
let bad = 0
for (const id of ['3room', '4room', '5room']) {
  const plan = JSON.parse(readFileSync(new URL(`../plans/${id}.json`, import.meta.url)))
  const boxes = [...plan.exterior, ...plan.interior].map((w) => {
    const T = (w.thickness || plan.wallT) / 2
    const [a, b] = [w.from - plan.wallT / 2, w.to + plan.wallT / 2]
    const [x, z] = w.axis === 'x' ? [[a, b], [w.at - T, w.at + T]] : [[w.at - T, w.at + T], [a, b]]
    return { name: `wall ${w.id}`, x, y: [0, plan.wallH], z }
  })
  for (const [name, cx, cy, cz, sx, sy, sz] of plan.occluders ?? []) {
    boxes.push({ name, x: [cx - sx / 2, cx + sx / 2], y: [cy - sy / 2, cy + sy / 2], z: [cz - sz / 2, cz + sz / 2] })
  }
  const inside = ([x, y, z], b) =>
    x > b.x[0] - NEAR && x < b.x[1] + NEAR && y > b.y[0] - NEAR && y < b.y[1] + NEAR && z > b.z[0] - NEAR && z < b.z[1] + NEAR
  const views = Object.entries(plan.views).map(([k, v]) => [k, v.pos])
  if (plan.views.overview.mobile) views.push(['overview(mobile)', plan.views.overview.mobile.pos])
  for (const [ka, a] of views) {
    for (const [kb, b] of views) {
      if (ka === kb) continue
      const path = flightPath(a, b, plan.wallH).at
      for (let i = 0; i <= 600; i++) {
        const p = path(i / 600)
        const hit = boxes.find((bx) => inside(p, bx))
        if (hit) {
          console.error(`${id}: ${ka} -> ${kb} hits ${hit.name} at u=${(i / 600).toFixed(2)} [${p.map((n) => n.toFixed(2))}]`)
          bad++
          break
        }
      }
    }
  }
}
if (bad) process.exit(1)
console.log('camera paths clear of walls on all plans')

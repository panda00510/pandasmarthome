import {
  BoxGeometry,
  LatheGeometry,
  ExtrudeGeometry,
  CylinderGeometry,
  Shape,
  Vector2,
} from 'three'

/**
 * 软包体：把立方体的顶点投影到超椭球上。
 * roundness = 2 是球，越大越接近方块；4~6 正好是坐垫、抱枕那种"鼓起来的方"。
 * 这是做软家具最省事也最像的一招 —— 圆角盒子只是边被磨圆，
 * 超椭球是整个面都微微鼓起，那才是布料被填充物撑开的样子。
 */
export function pillowGeometry(w, h, d, roundness = 4.5, seg = 12) {
  const g = new BoxGeometry(w, h, d, seg, seg, seg)
  const pos = g.attributes.position
  const hw = w / 2
  const hh = h / 2
  const hd = d / 2
  const inv = 1 / roundness

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) / hw
    let y = pos.getY(i) / hh
    let z = pos.getZ(i) / hd
    const r = Math.pow(
      Math.pow(Math.abs(x), roundness) + Math.pow(Math.abs(y), roundness) + Math.pow(Math.abs(z), roundness),
      inv
    )
    if (r > 1e-6) {
      x /= r
      y /= r
      z /= r
    }
    pos.setXYZ(i, x * hw, y * hh, z * hd)
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  return g
}

/**
 * 坐垫：在软包体基础上把顶面压出一个浅坑，像被坐过。
 */
export function cushionGeometry(w, h, d, dip = 0.22, roundness = 5, seg = 12) {
  const g = pillowGeometry(w, h, d, roundness, seg)
  const pos = g.attributes.position
  const hh = h / 2
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y <= 0) continue
    const nx = pos.getX(i) / (w / 2)
    const nz = pos.getZ(i) / (d / 2)
    const falloff = Math.max(0, 1 - (nx * nx + nz * nz))
    pos.setY(i, y - falloff * dip * hh * (y / hh))
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  return g
}

/**
 * 旋转体：给一条侧轮廓（[x, y] 数组，x 是半径），转出灯罩、花瓶、杯子这类东西。
 */
export function latheGeometry(profile, segments = 28) {
  const g = new LatheGeometry(
    profile.map(([x, y]) => new Vector2(x, y)),
    segments
  )
  g.computeVertexNormals()
  return g
}

function roundedRect(w, d, radius) {
  const hw = w / 2
  const hd = d / 2
  const r = Math.min(radius, hw, hd)
  const s = new Shape()
  s.moveTo(-hw + r, -hd)
  s.lineTo(hw - r, -hd)
  s.quadraticCurveTo(hw, -hd, hw, -hd + r)
  s.lineTo(hw, hd - r)
  s.quadraticCurveTo(hw, hd, hw - r, hd)
  s.lineTo(-hw + r, hd)
  s.quadraticCurveTo(-hw, hd, -hw, hd - r)
  s.lineTo(-hw, -hd + r)
  s.quadraticCurveTo(-hw, -hd, -hw + r, -hd)
  return s
}

/**
 * 板件：圆角矩形挤出成水平板（台面、座板），带一圈倒角。
 */
export function slabGeometry(w, d, thickness, radius = 0.04, bevel = 0.006) {
  const depth = Math.max(0.001, thickness - bevel * 2)
  const g = new ExtrudeGeometry(roundedRect(w, d, radius), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 10,
  })
  g.rotateX(-Math.PI / 2)
  g.center()
  return g
}

/**
 * 竖板：圆角矩形挤出成竖直面板（椅背、床头板）。
 */
export function panelGeometry(w, h, thickness, radius = 0.04, bevel = 0.006) {
  const depth = Math.max(0.001, thickness - bevel * 2)
  const g = new ExtrudeGeometry(roundedRect(w, h, radius), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 10,
  })
  g.center()
  return g
}

/**
 * 把竖板沿宽度方向弯出一个弧（椅背贴合腰背的弧度）。
 */
export function curvePanel(geometry, bend = 0.06) {
  const pos = geometry.attributes.position
  let maxX = 0
  for (let i = 0; i < pos.count; i++) maxX = Math.max(maxX, Math.abs(pos.getX(i)))
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getX(i) / maxX
    pos.setZ(i, pos.getZ(i) + t * t * bend)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

/**
 * 锥形腿：上粗下细，比等径圆柱耐看得多。
 */
export function legGeometry(topRadius, bottomRadius, height, segments = 12) {
  const g = new CylinderGeometry(topRadius, bottomRadius, height, segments, 1)
  return g
}

// ---- 常用轮廓 ----

export const PROFILES = {
  // 落地灯罩：下大上小的锥台，边缘微收
  floorShade: [
    [0.03, 0.34], [0.185, 0.34], [0.19, 0.33],
    [0.25, 0.03], [0.252, 0.0], [0.05, 0.0],
  ],
  // 台灯罩
  tableShade: [
    [0.02, 0.21], [0.108, 0.21], [0.112, 0.2],
    [0.155, 0.02], [0.157, 0.0], [0.03, 0.0],
  ],
  // 吸顶灯：扁圆盘，边缘带弧
  ceilingDisc: [
    [0, 0.055], [0.16, 0.052], [0.25, 0.04],
    [0.295, 0.018], [0.3, 0], [0.29, -0.012], [0, -0.016],
  ],
  // 收腰花瓶，轮廓上去再下来，做出壁厚和内腔
  vase: [
    [0, 0], [0.072, 0], [0.076, 0.02], [0.062, 0.09],
    [0.046, 0.16], [0.052, 0.215], [0.058, 0.242],
    [0.05, 0.243], [0.044, 0.214], [0.038, 0.16],
    [0.054, 0.09], [0.068, 0.021], [0.066, 0.013], [0, 0.013],
  ],
  // 马克杯
  mug: [
    [0, 0], [0.038, 0], [0.04, 0.006], [0.036, 0.05],
    [0.038, 0.098], [0.034, 0.098], [0.032, 0.012], [0, 0.012],
  ],
  // 碗
  bowl: [
    [0, 0], [0.03, 0], [0.032, 0.006], [0.075, 0.05],
    [0.105, 0.085], [0.108, 0.088], [0.08, 0.055], [0.036, 0.014], [0, 0.008],
  ],
}

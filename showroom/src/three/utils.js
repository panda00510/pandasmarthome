import { Color, SRGBColorSpace } from 'three'

// 色温(K) -> RGB，Tanner Helland 近似
export function kelvinToColor(kelvin, target = new Color()) {
  const t = Math.max(1000, Math.min(12000, kelvin)) / 100
  let r, g, b
  if (t <= 66) {
    r = 255
    g = 99.4708025861 * Math.log(t) - 161.1195681661
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592)
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492)
  }
  if (t >= 66) b = 255
  else if (t <= 19) b = 0
  else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307

  const c = (v) => Math.max(0, Math.min(255, v)) / 255
  return target.setRGB(c(r), c(g), c(b), SRGBColorSpace)
}

export function rgbArrayToColor(rgb, target = new Color()) {
  if (!rgb) return target.set('#ffffff')
  return target.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, SRGBColorSpace)
}

// 帧率无关的指数插值
export function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}


// 户型来自 src/plan.json —— 和 Blender 脚本共用同一份数据源
export { default as PLAN } from '../plan.json'

export const MAT = {
  floorWood: '#a9825a',
  floorTile: '#cfcac2',
  wall: '#efece6',
  wallAccent: '#ded7cc',
  woodDark: '#6b4f35',
  woodLight: '#c09a72',
  fabric: '#7d8794',
  fabricWarm: '#b8a894',
  metal: '#3a4046',
  white: '#f6f4f1',
  glass: '#9fc3d6',
  rug: '#c4b8a5',
  green: '#4a7c59',
}

import { Vector3 } from 'three'

// 点光源阴影"按需更新"：阴影贴图默认只渲染一次（Fixtures 里 autoUpdate = false）。
// 门扇、吊扇叶片、窗帘、扫地机、晾衣架动起来时，在各自的 useFrame 里调用 shadowDirty(x, y, z)；
// 每帧末尾只让"照得到这个位置"的投影灯重画一次阴影，动画停了就不再画 —— 不回到每帧全量更新，
// 也不改变灯 / 投影的数量（不会触发 shader 重编译）。
const lights = new Set()
const pending = []
const tmp = new Vector3()

export function registerShadowLight(light) {
  lights.add(light)
  return () => lights.delete(light)
}

export function shadowDirty(x, y, z) {
  if (pending.length < 16) pending.push(x, y, z)
}

let frame = 0
// 在所有动画的 useFrame 之后调用。连续动画（吊扇、扫地机）每 3 帧更新一次阴影：60 fps 下 20 Hz 仍然跟手，开销是逐帧的 1/3。
export function flushShadows() {
  if (!pending.length) return
  // 仅开发环境：截"修复前"对比图时可以临时关掉（window.__noShadowFlush = true）
  if (import.meta.env.DEV && window.__noShadowFlush) return void (pending.length = 0)
  if (frame++ % 3) return
  for (const light of lights) {
    light.getWorldPosition(tmp)
    const reach = light.distance || Infinity
    for (let i = 0; i < pending.length; i += 3) {
      if (tmp.distanceToSquared({ x: pending[i], y: pending[i + 1], z: pending[i + 2] }) < reach * reach) {
        light.shadow.needsUpdate = true
        break
      }
    }
  }
  pending.length = 0
}

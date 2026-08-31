import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Color, SRGBColorSpace } from 'three'
import { useHA, lightLevel } from '../ha/store'
import { kelvinToColor, rgbArrayToColor, damp } from './utils'
import { LightmapMaterial } from './LightmapMaterial'
import { getTextures, tiled } from './textures'
import meta from './lightmaps.json'
import GLB from '../assets/baked/house.glb?url'
import LM0 from '../assets/baked/lightmap_0.png?url'
import LM1 from '../assets/baked/lightmap_1.png?url'
import LM2 from '../assets/baked/lightmap_2.png?url'

// 壳体放在 layer 1：室内那些实时点光源照不到它，否则烘焙光和实时光会叠成双份。
// 日光和天光仍然要照到（它们没被烘焙）。
export const SHELL_LAYER = 1

// slot 0..8 依次是 atlas0.R … atlas2.B，顺序必须和烘焙时一致
const SLOTS = meta.atlases.flatMap((a) => ['R', 'G', 'B'].map((ch) => a.channels[ch] ?? null))
const SCALES = meta.atlases.map((a) => a.scales)

// Blender 的面光用瓦特、three.js 的点光源用坎德拉，两套单位不直接对应。
// 这是把烘焙结果对齐到实时光照亮度的标定值，改 plan.json 的灯功率后要重标。
const CALIBRATION = 3.4

// 材质名 -> 程序化贴图与铺贴密度（Blender 侧只给了纯色反照率）
const SURFACE = {
  M_woodFloor: ['woodFloor', 8, 11],
  M_woodFloorWarm: ['woodFloorWarm', 5, 5.5],
  M_tile: ['tile', 5, 5],
  M_wall: ['wall', 3.2, 2.2],
}

export default function BakedShell() {
  const { scene } = useGLTF(GLB)
  const maps = useTexture([LM0, LM1, LM2])
  const entities = useHA((s) => s.entities)

  const material = useMemo(() => {
    for (const m of maps) {
      m.colorSpace = SRGBColorSpace
      m.flipY = false          // glTF 的 UV 原点在左上
      m.needsUpdate = true
    }
    return new LightmapMaterial({
      maps,
      scales: SCALES.map((s) => s.map((v) => v * CALIBRATION)),
      roughness: 0.9,
      metalness: 0,
    })
  }, [maps])

  useEffect(() => {
    const tex = getTextures()
    scene.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = true
      o.receiveShadow = true
      o.layers.set(SHELL_LAYER)

      const src = Array.isArray(o.material) ? o.material[0] : o.material
      const m = material.clone()
      m.userData.lm = material.userData.lm       // 共享 uniform，一次更新全部生效
      m.onBeforeCompile = material.onBeforeCompile

      const surface = SURFACE[src?.name ?? '']
      if (surface) {
        const [key, w, h] = surface
        Object.assign(m, tiled(tex[key], w / 0.95, h / 1.4))
        m.color.set('#ffffff')
        m.normalScale.set(0.5, 0.5)
      } else if (src?.color) {
        m.color.copy(src.color)
      }
      for (const key of ['map', 'normalMap', 'roughnessMap']) {
        if (m[key]) {
          m[key].flipY = false
          m[key].needsUpdate = true
        }
      }
      o.material = m
    })
  }, [scene, material])

  const levels = useRef(SLOTS.map(() => 0))
  const colors = useMemo(() => SLOTS.map(() => new Color()), [])

  useFrame((_, dt) => {
    SLOTS.forEach((id, slot) => {
      if (!id) return
      const e = entities[id]
      if (!e) return
      levels.current[slot] = damp(levels.current[slot], lightLevel(e), 7, dt)
      const a = e.attributes
      if (a.rgb_color) rgbArrayToColor(a.rgb_color, colors[slot])
      else kelvinToColor(a.color_temp_kelvin ?? 3000, colors[slot])
      material.setLamp(slot, levels.current[slot], colors[slot])
    })
  })

  return <primitive object={scene} />
}

useGLTF.preload(GLB)

import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

// 可选：加载外部 glTF 户型模型替换程序化白模。
// 约定：在 Blender 里给需要联动的物体加自定义属性 ha_entity（导出后落在 glTF extras），
// 例如 ha_entity = "light.living_main"。运行时自动建立 实体 -> 物体 的映射，无需改代码。
export function collectEntityBindings(root) {
  const map = new Map()
  root.traverse((obj) => {
    const id = obj.userData?.ha_entity
    if (id) {
      if (!map.has(id)) map.set(id, [])
      map.get(id).push(obj)
    }
  })
  return map
}

export default function ExternalHouse({ url, onBindings }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    onBindings?.(collectEntityBindings(scene))
  }, [scene, onBindings])

  return <primitive object={scene} />
}

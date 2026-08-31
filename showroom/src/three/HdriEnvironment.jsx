import { useEffect } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { PMREMGenerator } from 'three'

// 不用 drei 的 <Environment files=...>：它靠文件扩展名挑 loader，
// 而单文件构建会把 HDRI 内联成 base64 data URI，没有扩展名可认。
// 这里直接走 RGBELoader + PMREM，两种形式都能加载。
export default function HdriEnvironment({ url }) {
  const texture = useLoader(RGBELoader, url)
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const env = pmrem.fromEquirectangular(texture).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [texture, gl, scene])

  return null
}

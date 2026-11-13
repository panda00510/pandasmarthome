import { useEffect } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { PMREMGenerator } from 'three'
import { useHA } from '../ha/store'

// 加载屏进度：场景块一加载就登记 HDRI 这一项，环境贴图就绪时记完成
useHA.getState().loadStart()
let counted = false

// 不用 drei 的 <Environment files=...>：它靠文件扩展名挑 loader，
// 而单文件构建会把 HDRI 内联成 base64 data URI，没有扩展名可认。
// 这里直接走 HDRLoader + PMREM，两种形式都能加载。文件已在 main.jsx 里 preload。
export default function HdriEnvironment({ url }) {
  const texture = useLoader(HDRLoader, url)
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const env = pmrem.fromEquirectangular(texture).texture
    scene.environment = env
    if (!counted) {
      counted = true
      useHA.getState().loadDone()
    }
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [texture, gl, scene])

  return null
}

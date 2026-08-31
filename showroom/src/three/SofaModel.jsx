import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
// 放在 public/ 下按需加载：开关关闭时它不会进 bundle。
// 跟随 BASE_URL，部署到子目录也能找到。
const url = `${import.meta.env.BASE_URL}models/sofa_03.glb`

// Poly Haven「Sofa 03」，CC0。8k 三角形，2K 贴图降到 1K 后整包 888 KB。
export default function SofaModel(props) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} {...props} />
}

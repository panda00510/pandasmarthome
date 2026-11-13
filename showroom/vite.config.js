import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// mode=single 时打包成一个自包含的 HTML，便于直接发给客户查看
export default defineConfig(({ mode }) => {
  const single = mode === 'single'
  return {
    // 相对路径：部署到 example.com/showroom/ 这类子目录时资源才不会 404
    base: './',
    plugins: [react(), ...(single ? [viteSingleFile()] : [])],
    build: {
      outDir: single ? 'dist-single' : 'dist',
      chunkSizeWarningLimit: 4000,
      ...(single ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false } : null),
      // three 单独成块（版本少变、缓存命中高）；R3F / drei / 后处理另成一块。都随 3D 场景懒加载，不在首屏 JS 里。
      rollupOptions: single ? undefined : {
        output: {
          advancedChunks: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|zustand)[\\/]/, priority: 30 },
              { name: 'three', test: /node_modules[\\/]three[\\/]/, priority: 20 },
              { name: 'r3f', test: /node_modules[\\/](@react-three|postprocessing|n8ao|three-stdlib|maath|camera-controls|troika|@monogrid|@use-gesture|its-fine|suspend-react)/, priority: 10 },
            ],
          },
        },
      },
    },
  }
})

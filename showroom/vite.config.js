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
    },
  }
})

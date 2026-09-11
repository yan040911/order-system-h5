import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 让打包后的资源用相对路径，方便直接丢到 GitHub Pages / 任意静态托管
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 5173 },
})

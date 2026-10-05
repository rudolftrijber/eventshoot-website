import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { localApiPlugin } from './plugins/vite-local-api'

export default defineConfig({
  plugins: [vue(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'safari14',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        interview: path.resolve(__dirname, 'interview.html'),
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})

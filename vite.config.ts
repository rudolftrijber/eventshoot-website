import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { localApiPlugin } from './plugins/vite-local-api'

/** iPad Safari can stall on modulepreload and on crossorigin module scripts. */
function ipadModuleFix(): Plugin {
  return {
    name: 'ipad-module-fix',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const scripts = [...html.matchAll(/<script type="module"[\s\S]*?<\/script>/g)].map((match) =>
          match[0].replace(/\s+crossorigin(?:="[^"]*")?/g, ''),
        )
        let out = html
          .replace(/<link rel="modulepreload"[\s\S]*?>/g, '')
          .replace(/<script type="module"[\s\S]*?<\/script>/g, '')
          .replace(/\s+crossorigin(?:="[^"]*")?/g, '')
        if (scripts.length) {
          out = out.replace('</body>', `${scripts.join('\n    ')}\n  </body>`)
        }
        return out
      },
    },
  }
}

export default defineConfig({
  plugins: [vue(), localApiPlugin(), ipadModuleFix()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'safari12',
    modulePreload: false,
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

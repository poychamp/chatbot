import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const root = import.meta.dirname
const pagesDir = resolve(root, 'assets/pages')

const pages = Object.fromEntries(
  readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [entry.name, resolve(pagesDir, entry.name, 'main.js')]),
)

const djangoTemplateReload = {
  name: 'django-template-reload',
  apply: 'serve',
  configureServer(server) {
    server.watcher.add(resolve(root, '**/templates/**/*.html'))
  },
  handleHotUpdate({ file, server }) {
    if (file.includes('/templates/') && file.endsWith('.html')) {
      server.ws.send({ type: 'full-reload', path: '*' })
      return []
    }
  },
}

export default defineConfig(({ command, mode }) => {
  // '' loads every key, not just VITE_-prefixed ones. Nothing here reaches client code.
  const env = loadEnv(mode, process.cwd(), '')

  const devProtocol = env.VITE_DEV_SERVER_PROTOCOL || 'http'
  const devHost = env.VITE_DEV_SERVER_HOST || 'localhost'
  const devPort = Number(env.VITE_DEV_SERVER_PORT || 5173)
  const hmrProtocol = devProtocol === 'https' ? 'wss' : 'ws'
  const djangoOrigin = `http://localhost:${env.DOCKER_HOST_PORT || '8000'}`

  return {
    // Build-only: base prefixes dev module URLs too, and the template points at bare
    // /assets/... on the dev server.
    base: command === 'build' ? '/static/' : '/',
    plugins: [
      tailwindcss(),
      vue({
        template: {
          transformAssetUrls: { base: null, includeAbsolute: false },
        },
      }),
      djangoTemplateReload,
    ],
    build: {
      manifest: true,
      outDir: 'assets/dist',
      rollupOptions: { input: pages },
    },
    server: {
      host: '0.0.0.0',
      port: devPort,
      strictPort: true,
      origin: `${devProtocol}://${devHost}:${devPort}`,
      cors: { origin: djangoOrigin },
      hmr: {
        host: devHost,
        protocol: hmrProtocol,
      },
    },
  }
})

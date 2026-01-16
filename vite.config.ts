import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      // Configure _routes.json to exclude HTML files from Worker
      // This allows Cloudflare Pages to serve them as static assets
      exclude: ['/static/*', '/*.html']
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: false
  }
})

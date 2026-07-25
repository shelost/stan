import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// One HTML entry per version. Each is mapped to its own subdomain by
// the host rewrites in vercel.json, and stays reachable at /<name>.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        books: resolve(__dirname, 'books.html'),
        editions: resolve(__dirname, 'editions.html'),
        phone: resolve(__dirname, 'phone.html'),
        atlas: resolve(__dirname, 'atlas.html'),
        press: resolve(__dirname, 'press.html'),
        terminal: resolve(__dirname, 'terminal.html'),
        flip: resolve(__dirname, 'flip.html'),
        desk: resolve(__dirname, 'desk.html'),
        orbit: resolve(__dirname, 'orbit.html'),
      },
    },
  },
})

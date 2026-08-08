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
        options: resolve(__dirname, 'options.html'),
        books: resolve(__dirname, 'books.html'),
        editions: resolve(__dirname, 'editions.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        phone: resolve(__dirname, 'phone.html'),
        atlas: resolve(__dirname, 'atlas.html'),
        press: resolve(__dirname, 'press.html'),
        flip: resolve(__dirname, 'flip.html'),
        home: resolve(__dirname, 'home.html'),
        chat: resolve(__dirname, 'chat.html'),
        grid: resolve(__dirname, 'grid.html'),
        stan: resolve(__dirname, 'stan.html'),
        nike: resolve(__dirname, 'nike.html'),
      },
    },
  },
})

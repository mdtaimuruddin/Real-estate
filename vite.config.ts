import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.microburbs.com.au',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/report_generator/api'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Forward headers from the original request
            const authHeader = req.headers['authorization']
            if (authHeader) {
              proxyReq.setHeader('Authorization', authHeader)
            } else {
              proxyReq.setHeader('Authorization', 'Bearer test')
            }
            proxyReq.setHeader('Content-Type', 'application/json')
          })
        },
      },
    },
  },
})

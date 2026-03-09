import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('If-None-Match');
            proxyReq.removeHeader('If-Modified-Since');
          });
        },
      },
      '/domains': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('If-None-Match');
            proxyReq.removeHeader('If-Modified-Since');
          });
        },
      },
      '/dns': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('If-None-Match');
            proxyReq.removeHeader('If-Modified-Since');
          });
        },
      },
      '/sys': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('If-None-Match');
            proxyReq.removeHeader('If-Modified-Since');
          });
        },
      },
      '/v3': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('If-None-Match');
            proxyReq.removeHeader('If-Modified-Since');
          });
        },
      },
      '/ip': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('If-None-Match');
            proxyReq.removeHeader('If-Modified-Since');
          });
        },
      },
      '/subnet/': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('If-None-Match');
            proxyReq.removeHeader('If-Modified-Since');
          });
        },
      },
    },
  },
});






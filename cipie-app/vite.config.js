import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 5175;

export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT, host: true,
    proxy: {
      // '/auth-api': {
      //   target: 'http://10.208.10.83',
      //   changeOrigin: true,
      //   secure: false,

      //   // 🔑 THIS IS REQUIRED
      //   rewrite: (path) => path.replace(/^\/auth-api/, ''),

      //   // 🔍 Debug proof
      //   configure: (proxy) => {
      //     proxy.on('proxyReq', (proxyReq, req) => {
      //       console.log('Proxying →', req.url);
      //     });
      //   },
      // },
      // '/application-api': {
      //   target: 'http://10.208.11.127:80',
      //   changeOrigin: true,
      //   secure: false,


      //   // 🔑 THIS IS REQUIRED
      //   rewrite: (path) => path.replace(/^\/application-api/, ''),

      //   // 🔍 Debug proof
      //   configure: (proxy) => {
      //     proxy.on('proxyReq', (proxyReq, req) => {
      //       console.log('Proxying →', req.url);
      //     });
      //   },
      // },

      // '/document-api': {
      //   target: 'http://10.208.10.194:84',
      //   changeOrigin: true,
      //   secure: false,


      //   // 🔑 THIS IS REQUIRED
      //   rewrite: (path) => path.replace(/^\/document-api/, ''),

      //   // 🔍 Debug proof
      //   configure: (proxy) => {
      //     proxy.on('proxyReq', (proxyReq, req) => {
      //       console.log('Proxying →', req.url);
      //     });
      //   },
      // },
      '/eventImageUrl': {
        // target: 'http://10.208.10.194:83',
        target: 'https://cipie.in',
        changeOrigin: true,
        secure: false,


        // 🔑 THIS IS REQUIRED
        rewrite: (path) => path.replace(/^\/eventimage/, ''),

        // 🔍 Debug proof
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying →', req.url);
          });
        },
      },
      '/blogImageUrl': {
        // target: 'http://10.208.10.194:82',
        target: 'https://cipie.in',
        changeOrigin: true,
        secure: false,


        // 🔑 THIS IS REQUIRED
        // rewrite: (path) => path.replace(/^\/blog-image-api/, ''),

        // 🔍 Debug proof
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying →', req.url);
          });
        },
      },
    },
  },
  preview: { port: PORT, host: true },
});

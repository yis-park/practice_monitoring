import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyPath = env.VITE_DEV_PROXY_PATH || '/api';
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'https://www.jecheon.go.kr/';
  const proxyRewriteTo = env.VITE_DEV_PROXY_REWRITE_TO || '/smbiz_support/api/';

  return {
    base: env.VITE_APP_BASE || '/smbiz_support/kiosk/',
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        [proxyPath]: {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(new RegExp(`^${proxyPath}`), proxyRewriteTo),
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      include: ['@emotion/react', '@emotion/styled'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
  };
});

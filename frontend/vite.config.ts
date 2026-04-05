import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.API_URL || 'http://localhost:4100',
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    define: {
      'import.meta.env.API_URL': JSON.stringify(env.API_URL || 'http://localhost:4100'),
      'import.meta.env.APP_NAME': JSON.stringify(env.APP_NAME || 'ClickBazaar'),
      'import.meta.env.ENVIRONMENT': JSON.stringify(env.ENVIRONMENT || 'development'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

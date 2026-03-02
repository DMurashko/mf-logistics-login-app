import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {federation} from '@module-federation/vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'login_app',
      filename: 'remoteEntry.js',
      dts: false,
      exposes: {
        './LoginPage': './src/features/login/pages/LoginPage.tsx',
        './RegisterPage': './src/features/registration/pages/RegisterPage.tsx',
        './auth': './src/features/auth/index.ts',
        './api': './src/api/index.ts',
      },
      remotes: {
        ui_library: {
          type: 'module',
          name: 'ui_library',
          entry:
            process.env.VITE_UI_LIBRARY_URL ||
            'http://localhost:3003/remoteEntry.js',
          entryGlobalName: 'ui_library',
          shareScope: 'default',
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react/jsx-runtime': { singleton: true, requiredVersion: '^19.0.0' },
        'react/jsx-dev-runtime': { singleton: true, requiredVersion: '^19.0.0' },
        '@mui/material': { singleton: true },
        '@emotion/react': { singleton: true },
        '@emotion/styled': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        'react-router-dom': { singleton: true },
        axios: { singleton: true },
      },
    }),
    react(),
  ],
  server: {
    port: 3001,
    strictPort: true,
    origin: 'http://localhost:3001',
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
});

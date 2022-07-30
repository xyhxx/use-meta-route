import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/*'],
      outputDir: 'types',
    }),
  ],
  test: {
    include: ['__tests__/*.{test, spec}.tsx'],
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '.',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'useMetaRoutes',
      fileName: format => `${format}/index.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDom',
          'react-router': 'ReactRouterDom',
        },
      },
    },
  },
});

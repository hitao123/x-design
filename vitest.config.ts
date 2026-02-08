import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.spec.ts', '**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      '@x-design/components': resolve(__dirname, './packages/components/index.ts'),
      '@x-design/icons': resolve(__dirname, './packages/icons/index.ts'),
      '@x-design/theme': resolve(__dirname, './packages/theme/index.ts'),
      '@x-design/utils': resolve(__dirname, './packages/utils/index.ts'),
    },
  },
});

/// <reference types="vitest" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslintPlugin from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import dotenv from 'dotenv';
import path from 'path';
import autoprefixer from 'autoprefixer';

dotenv.config({
  path: path.resolve(__dirname, `environments/.env.${process.env.NODE_ENV}`),
});

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_URL || './',
  plugins: [tsconfigPaths(), vue(), eslintPlugin(), checker({ vueTsc: true })],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/shared.scss";
        `,
      },
    },
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});

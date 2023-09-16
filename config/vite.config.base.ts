import { resolve } from 'path';
import { defineConfig, PluginOption } from 'vite';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    vue(),
    // Provides Vue 3 JSX & TSX support with HMR.
    vueJsx(),
    // arcoDesign按需引入样式
    configArcoStyleImportPlugin() as PluginOption,
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});

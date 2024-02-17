import { resolve } from 'path';
import { defineConfig, PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tailwindcss from 'tailwindcss';
import svgLoader from 'vite-svg-loader';
import autoprefixer from 'autoprefixer';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';

export default defineConfig({
  plugins: [
    vue({
      script: {
        // 当前vue版本(3.3.4) defineModel api为实验性功能，后面如果遇到问题可以考虑升级到更高版本以使用正式功能
        defineModel: true,
      },
    }),
    // Provides Vue 3 JSX & TSX support with HMR.
    vueJsx(),
    // 使用 vite-svg-loader
    svgLoader(),
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

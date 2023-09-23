import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import router from './router';
import i18n from './locale';
import App from './App.vue';
import '@/styles/tailwind.css';

// 全量引入样式
// import '@arco-design/web-vue/dist/arco.css';
const pinia = createPinia();
const app = createApp(App);
app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app');

import { createApp } from 'vue';
import App from './app';
import router from './router';
import store from './store';
import '@/assets/style/index.scss';
import 'element-plus/lib/theme-chalk/index.css';

createApp(App).use(store).use(router).mount('#app');

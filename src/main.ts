import App from './App.vue';
import { createApp } from 'vue';

import router from './router/index';
import store from './store/index';
import '@/commons/styles/var.scss';
import '@/commons/styles/tailwind-index.css';

const app = createApp(App);

app.use(router).use(store).mount('#app');

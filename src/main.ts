import App from './App.vue';
import { createApp } from 'vue';

import router from './router/index';
// import store from './store/index.js';
import '@/commons/styles/var.scss';

const app = createApp(App);
app.use(router).mount('#app');
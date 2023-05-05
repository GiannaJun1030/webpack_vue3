import App from './App.vue';
import { createApp } from 'vue';

// 路由
import router from './router/index';

// 状态管理库
import store from './store/index';

// 样式
import '@/commons/styles/var.scss';
import '@/commons/styles/tailwind-index.scss';

// 动态设置rem
import '@/utils/setRem';

const app = createApp(App);

app.use(router).use(store).mount('#app');

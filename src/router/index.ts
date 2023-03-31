import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/tailwind-page',
      name: 'TailwindPage',
      component: () => import('@/views/tailwind-page/index.vue'),
    },
  ],
});

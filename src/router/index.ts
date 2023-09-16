import { createRouter, createWebHistory } from 'vue-router';
import { NO_PERMISSION } from './routes/base';
import { appRoutes } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    ...appRoutes,
    NO_PERMISSION,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
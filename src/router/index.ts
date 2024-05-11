import { createRouter, createWebHistory } from 'vue-router';
import { NO_PERMISSION } from './routes/base';
// import DETAIL from './routes/candidate';
import { appRoutes } from './routes';
import createRouteGuard from './guard';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      // 暂时重定向到总览
      redirect: '/overview',
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
    // DETAIL,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;

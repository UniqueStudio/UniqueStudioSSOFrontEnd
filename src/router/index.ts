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
      redirect: '/overview/apply-info',
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

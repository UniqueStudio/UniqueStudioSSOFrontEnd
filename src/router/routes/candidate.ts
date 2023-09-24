import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from './base';

const DETAIL: RouteRecordRaw = {
  path: '/overview/candidate',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.overview.candidate',
    requiresAuth: true,
  },
  children: [
    {
      path: 'detail/:id',
      name: 'detail',
      component: () => import('@/views/overview/candidate/detail/index.vue'),
      meta: {
        locale: 'menu.overview.candidate',
        requiresAuth: true,
        activeMenu: 'candidate',
        // roles: ['*'],
      },
    },
  ],
};

export default DETAIL;

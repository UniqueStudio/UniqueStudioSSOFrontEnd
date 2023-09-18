import { DEFAULT_LAYOUT } from '../base';

const DASHBOARD = {
  path: '/overview',
  name: 'overview',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.overview',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'apply-info',
      name: 'applyInfo',
      component: () => import('@/views/overview/applyInfo/index.vue'),
      meta: {
        locale: 'menu.overview.applyInfo',
        requiresAuth: true,
        // roles: ['*'],
      },
    },
    {
      path: 'candidate',
      name: 'candidate',
      component: () => import('@/views/overview/candidate/index.vue'),
      meta: {
        locale: 'menu.overview.candidate',
        requiresAuth: true,
        // roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;

import { DEFAULT_LAYOUT } from '../base';
// import { AppRouteRecordRaw } from '../types';

const DASHBOARD = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 0,
  },
  children: [
    {
      path: 'set-roles',
      name: 'setRoles',
      component: () => import('@/views/dashboard/setRoles/index.vue'),
      meta: {
        locale: 'menu.dashboard.setRoles',
        requiresAuth: true,
        //roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;

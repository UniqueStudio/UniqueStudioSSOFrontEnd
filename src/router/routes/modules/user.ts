import { DEFAULT_LAYOUT } from '../base';

const DASHBOARD = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.user',
    requiresAuth: true,
    icon: 'icon-user',
    order: 2,
  },
  children: [
    {
      path: 'edit-info',
      name: 'editInfo',
      component: () => import('@/views/user/editInfo/index.vue'),
      meta: {
        locale: 'menu.user.editInfo',
        requiresAuth: true,
        // roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;

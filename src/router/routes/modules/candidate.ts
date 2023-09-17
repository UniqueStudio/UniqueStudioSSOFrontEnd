import { DEFAULT_LAYOUT } from '../base';

const DASHBOARD = {
  path: '/candidate',
  name: 'candidate',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.candidate',
    requiresAuth: true,
    icon: 'icon-user',
    order: 1,
  },
};

export default DASHBOARD;

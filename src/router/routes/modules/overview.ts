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
};

export default DASHBOARD;

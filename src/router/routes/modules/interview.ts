import { DEFAULT_LAYOUT } from '../base';

const DASHBOARD = {
  path: '/interview',
  name: 'interview',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.interview',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 1,
  },
  children: [
    {
      path: 'management',
      name: 'interviewMangement',
      component: () => import('@/views/interview/management/index.vue'),
      meta: {
        locale: 'menu.interview.management',
        requiresAuth: true,
        // roles: ['*'],
      },
    },
    {
      path: 'schedule',
      name: 'interviewSchedule',
      component: () => import('@/views/interview/schedule/index.vue'),
      meta: {
        locale: 'menu.interview.schedule',
        requiresAuth: true,
        // roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;

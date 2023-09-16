import type { RouteRecordRaw } from 'vue-router';

export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');

export const NO_PERMISSION:RouteRecordRaw = {
  path:'/no-permission',
  name:'noPermission',
  component:() => import('@/views/noPermission/index.vue'),
}
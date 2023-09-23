import localeApi from '@/api/locale/zh-CN';

import localeLogin from '@/views/login/locale/zh-CN';
import localeNoPermission from '@/views/noPermission/locale/zh-CN';

import localeMenu from './zh-CN/menu';

export default {
  ...localeMenu,
  ...localeApi,
  ...localeLogin,
  ...localeNoPermission,
};

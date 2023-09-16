import localeApi from '@/api/locale/zh-CN';

import localeLogin from '@/views/login/locale/zh-CN';
import localeNoPermission from '@/views/noPermission/locale/zh-CN';

export default {
  'menu.dashboard': '角色设置',
  ...localeApi,
  ...localeLogin,
  ...localeNoPermission,
}
import localeApi from '@/api/locale/zh-CN';
import localeNoPermission from '@/views/noPermission/locale/zh-CN';
import localeCandidate from '@/views/overview/candidate/locale/zh-CN';

import localeMenu from './zh-CN/menu';
import localeCommon from './zh-CN/common';
import localeSms from './zh-CN/sms';

export default {
  ...localeMenu,
  ...localeApi,
  ...localeNoPermission,
  ...localeCandidate,
  ...localeCommon,
  ...localeSms,
};

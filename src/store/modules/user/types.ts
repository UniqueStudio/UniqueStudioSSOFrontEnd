import type { User } from '@/constants/httpMsg/user/getUserInfoMsg';

export type UserState = {
  data: User | null;
};

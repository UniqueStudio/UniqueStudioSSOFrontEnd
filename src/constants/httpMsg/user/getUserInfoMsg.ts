import { Gender, Group } from '@/constants/team';
import { Application } from '../application/getApplicationMsg';
import { HttpRes } from '../_httpResTemplate';

export interface User {
  uid: string;
  phone: string;
  email: string;
  name: string;
  avatar_url: string;
  gender: Gender;
  join_time: string;
  groups: Group[];
  lark_union_id: string;
  applications: Application[];
}

export type UserInfoResponse = HttpRes<User>;

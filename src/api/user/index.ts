import { UserInfoResponse } from '@/constants/httpMsg/user/getUserInfoMsg';
import request from '../_request';

export default async function getUserInfo(): Promise<UserInfoResponse> {
  const res: UserInfoResponse = await request({
    url: '/user/me',
    method: 'GET',
  });
  return res;
}

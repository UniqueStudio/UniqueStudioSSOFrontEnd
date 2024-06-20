import {
  UserInfoResponse,
  PingResponse,
} from '@/constants/httpMsg/user/getUserInfoMsg';
import request from '../_request';

export async function getUserInfo(): Promise<UserInfoResponse> {
  const res: UserInfoResponse = await request({
    url: '/user/me',
    method: 'GET',
  });
  return res;
}

export async function ping(): Promise<PingResponse> {
  return request({
    url: '/ping',
    method: 'GET',
  });
}

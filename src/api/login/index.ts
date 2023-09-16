import request from '../_request';
import {phoneLoginRequest,emailLoginRequest,LoginResponse } from '@/constants/httpMsg/register/LoginStatusMsg';

export async function ssoLogin(
  data:phoneLoginRequest | emailLoginRequest
):Promise<LoginResponse>{
  const res:LoginResponse = await request({
    url:'/v1/login',
    method:'POST',
    data
  })
  return res;
}
import {
  RegisterRequest,
  RegisterResponse,
} from '@/constants/httpMsg/register/RegisterStatusMsg';
import {
  ValidateCodeRequest,
  ValidateCodeResponse,
} from '@/constants/httpMsg/register/ValidateStatusMsg';
import request from '../_request';

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const res: RegisterResponse = await request({
    url: '/v1/register',
    method: 'POST',
    data,
  });
  return res;
}

export async function sendValidateCode(
  data: ValidateCodeRequest,
): Promise<ValidateCodeResponse> {
  const res: ValidateCodeResponse = await request({
    url: '/v1/code/sms',
    method: 'POST',
    data,
  });
  return res;
}

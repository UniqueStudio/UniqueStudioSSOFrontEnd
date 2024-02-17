import { SmsRequest, SmsResponse } from '@/constants/httpMsg/sms/sendSmsMsg';
import request from '../_request';

export default async function sendSms(data: SmsRequest): Promise<SmsResponse> {
  const res: SmsResponse = await request({
    url: '/sms/',
    method: 'POST',
    data,
  });
  return res;
}

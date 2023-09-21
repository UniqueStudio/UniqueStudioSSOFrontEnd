import { Gender } from '@/views/login/type';
import { HttpRes } from '../_httpResTemplate';

export interface RegisterRequest {
  name: string;
  gender: Gender;
  phone: string;
  email: string;
  password: string;
  validate_code: string;
}

export type RegisterResponse = HttpRes<{
  message: string;
  data: string;
}>;

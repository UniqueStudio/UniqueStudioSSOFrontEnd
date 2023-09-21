import { HttpRes } from '../_httpResTemplate';

export interface phoneLoginRequest {
  phone: string;
  password: string;
}

export interface emailLoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = HttpRes<{
  message: string;
  data: string;
}>;

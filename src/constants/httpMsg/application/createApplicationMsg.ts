import { HttpRes } from '../_httpResTemplate';
import { Application } from './getApplicationMsg';

export interface CreateApplicationRequest {
  grade?: string;
  institute?: string;
  major?: string;
  rank?: string;
  group?: string;
  intro?: string;
  recruitment_id?: string;
  referrer?: string;
  resume?: File;
}

export type CreateApplicationResponse = HttpRes<Application>;

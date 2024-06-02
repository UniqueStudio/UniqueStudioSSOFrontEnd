import { Group, Step } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';
import { Application } from './getApplicationMsg';

export interface UpdateApplicationRequest {
  grade?: string;
  institute?: string;
  major?: string;
  rank?: string;
  group?: Group;
  intro?: string;
  referrer?: string;
  is_quick?: boolean;
  resume?: File;
}

export interface UpdateApplicationStepRequest {
  from: Step;
  to: Step;
}

export interface AllocateApplicationInterviewRequest {
  interview_id: string;
}

export interface SelectApplicationInterviewRequest {
  iids: string[];
}

export type UpdateApplicationResponse = HttpRes<Application>;

export type RejectApplicationResponse = HttpRes<object>;

export type UpdateApplicationStepResponse = HttpRes<object>;

export type AllocateApplicationInterviewResponse = HttpRes<object>;

export type SelectApplicationInterviewResponse = HttpRes<object>;

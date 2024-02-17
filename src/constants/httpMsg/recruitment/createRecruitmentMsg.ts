import { TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';
import { Recruitment } from './getRecruitmentMsg';

export interface CreateRecruitmentRequest {
  name: string;
  beginning: TimeString;
  deadline: TimeString;
  end: TimeString;
}

export type CreateRecruitmentResponse = HttpRes<Recruitment>;

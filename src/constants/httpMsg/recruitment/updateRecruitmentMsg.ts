import { TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';
import { CreateRecruitmentRequest } from './createRecruitmentMsg';

export type UpdateRecruitmentRequest = Partial<CreateRecruitmentRequest>;

export type UpdateRecruitmentResponse = HttpRes<object>;

export type SetStressTestTimeRequest = {
  stress_test_start: TimeString;
  stress_test_end: TimeString;
};

export type SetStressTestTimeResponse = HttpRes<object>;

export type UploadTestRequest = File;

export type UploadTestResponse = HttpRes<object>;

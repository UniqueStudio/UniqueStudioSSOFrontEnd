import { HttpRes } from '../_httpResTemplate';
import { CreateRecruitmentRequest } from './createRecruitmentMsg';

export type UpdateRecruitmentRequest = Partial<CreateRecruitmentRequest>;

export type UpdateRecruitmentResponse = HttpRes<object>;

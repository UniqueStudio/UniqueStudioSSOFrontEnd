import { Recruitment } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';

export interface RecruitmentState {
  data: Recruitment[];
  currentRid: string;
  currentRec?: Recruitment;
}

export type { Recruitment };
export type { UpdateRecruitmentRequest as UpdateParams } from '@/constants/httpMsg/recruitment/updateRecruitmentMsg';
export type { CreateRecruitmentRequest as CreateParams } from '@/constants/httpMsg/recruitment/createRecruitmentMsg';

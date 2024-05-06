import { Application } from '@/constants/httpMsg/application/getApplicationMsg';
import { Recruitment } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';

export type CandidateInfo = Application;

export interface RecruitmentState {
  data: Recruitment[];
  currentRid: string;
  currentRec?: Recruitment;
}

export type { Recruitment };
export type {
  UpdateRecruitmentRequest as UpdateParams,
  SetStressTestTimeRequest as SetTimeParams,
} from '@/constants/httpMsg/recruitment/updateRecruitmentMsg';
export type { CreateRecruitmentRequest as CreateParams } from '@/constants/httpMsg/recruitment/createRecruitmentMsg';

export { Group } from '@/constants/team';

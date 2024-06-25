import { Application } from '@/constants/httpMsg/application/getApplicationMsg';
import { Recruitment } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import { Interview } from '@/constants/httpMsg/interview/getInterviewMsg';

export type CandidateInfo = Application;
export type InterviewInfo = Interview;

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
export type { CreateInterviewRequest } from '@/constants/httpMsg/interview/createInterviewMsg';

export { Group } from '@/constants/team';

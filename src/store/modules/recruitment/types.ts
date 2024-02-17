import { Application } from '@/constants/httpMsg/application/getApplicationMsg';
import { Recruitment } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import { ReplaceKeys } from '@/utils/types';
import { Comment } from '@/constants/httpMsg/comment/createCommentMsg';

export type CommentInfo = [Comment[], Comment[], Comment[]];

export type CandidateInfo = ReplaceKeys<
  Application,
  'comments',
  {
    comments: CommentInfo;
  }
>;

export interface RecruitmentState {
  data: Recruitment[];
  currentRid: string;
  currentRec?: Recruitment;
}

export type { Recruitment };
export type { UpdateRecruitmentRequest as UpdateParams } from '@/constants/httpMsg/recruitment/updateRecruitmentMsg';
export type { CreateRecruitmentRequest as CreateParams } from '@/constants/httpMsg/recruitment/createRecruitmentMsg';

import { Step, Gender, Group, TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';
import { InterviewSelection } from '../interview/getInterviewMsg';
import { Comment } from '../comment/createCommentMsg';

interface UserDetail {
  uid: string;
  phone: string;
  email: string;
  name: string;
  avatar_url: string;
  gender: Gender;
  join_time: string;
  groups: Group[];
  lark_union_id: string;
}

export interface Application {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  grade: string;
  institute: string;
  major: string;
  rank: string;
  group: Group;
  intro: string;
  is_quick: false;
  referrer: string;
  resume: string;
  abandoned: false;
  rejected: false;
  step: Step;
  candidate_id: string;
  recruitment_id: string;
  interview_allocations_group: TimeString;
  interview_allocations_team: TimeString;
  user_detail?: UserDetail;
  interview_selections?: InterviewSelection[];
  comments?: Comment[];
}

export type AllApplicationsResponse = HttpRes<Application[]>;

export type ApplicationResponse = HttpRes<Application>;

export type ApplicationResumeResponse = Blob;

export type AvailableInterviewSelectionsResponse = HttpRes<
  InterviewSelection[]
>;

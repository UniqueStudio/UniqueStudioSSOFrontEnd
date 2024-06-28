import { TimeString } from '@/constants/team';
import { Application } from '../application/getApplicationMsg';
import { HttpRes } from '../_httpResTemplate';
import { Interview } from '../interview/getInterviewMsg';

interface Statistics {
  ai?: number;
  mobile?: number;
  android?: number;
  design?: number;
  game?: number;
  ios?: number;
  lab?: number;
  pm?: number;
  web?: number;
}

export interface GroupDetails {
  ai?: number;
  mobile?: number;
  android?: number;
  design?: number;
  game?: number;
  ios?: number;
  lab?: number;
  pm?: number;
  web?: number;
}

export interface Recruitment {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  name: string;
  beginning: TimeString;
  deadline: TimeString;
  end: TimeString;
  statistics?: Statistics;
  group_details?: GroupDetails;
  applications?: Application[];
  interviews?: Interview[];
}

export type AllRecruitmentsResponse = HttpRes<Recruitment[]>;

export type RecruitmentResponse = HttpRes<Recruitment>;

export type LatestRecruitmentResponse = HttpRes<Recruitment>;

export type GetTestResponse = HttpRes<object>;

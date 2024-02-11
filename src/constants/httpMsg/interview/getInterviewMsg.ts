import { Period, Group, TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';

export interface InterviewSelection {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  date: TimeString;
  period: Period;
  name: Group;
  slot_number: number;
  recruitment_id: string;
}

export type InterviewSelectionResponse = HttpRes<InterviewSelection[]>;

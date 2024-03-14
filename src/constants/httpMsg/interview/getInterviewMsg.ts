import { Period, Group, TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';

export interface Interview {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  date: TimeString;
  period: Period;
  name: Group;
  select_number: number;
  slot_number: number;
  recruitment_id: string;
  start: TimeString;
  end: TimeString;
}

export type InterviewSelectionResponse = HttpRes<Interview[]>;

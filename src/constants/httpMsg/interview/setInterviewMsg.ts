import { Period, TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';

export type SetInterviewRequest = {
  uid?: string;
  date: TimeString;
  period: Period;
  slot_number: number;
}[];

export type SetInterviewResponse = HttpRes<object>;

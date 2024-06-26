import { Period, TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';

export type CreateInterviewRequest = {
  date: TimeString;
  period: Period;
  start: TimeString;
  end: TimeString;
}[];

export type CreateInterviewResponse = HttpRes<object>;

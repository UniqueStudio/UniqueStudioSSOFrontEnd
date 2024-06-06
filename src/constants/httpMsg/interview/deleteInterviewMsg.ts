import { HttpRes } from '../_httpResTemplate';

export type DeleteInterviewRequest = {
  iid: string;
}[];

export type DeleteInterviewResponse = HttpRes<object>;

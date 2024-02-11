import { Evaluation, TimeString } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';

export interface Comment {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  application_id: string;
  member_id: string;
  content: string;
  evaluation: Evaluation;
}

export interface CreateCommentRequest {
  content: string;
  evaluation: Evaluation;
  application_id: string;
}

export type CreateCommentResponse = HttpRes<Comment>;

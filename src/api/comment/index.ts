import {
  CreateCommentRequest,
  CreateCommentResponse,
} from '@/constants/httpMsg/comment/createCommentMsg';
import { DeleteCommentResponse } from '@/constants/httpMsg/comment/deleteCommentMsg';
import request from '../_request';

export async function createComment(
  data: CreateCommentRequest,
): Promise<CreateCommentResponse> {
  const res: CreateCommentResponse = await request({
    url: '/comments',
    method: 'POST',
    data,
  });
  return res;
}

export async function deleteComment(
  cid: string,
): Promise<DeleteCommentResponse> {
  const res: DeleteCommentResponse = await request({
    url: `/comments/${cid}`,
    method: 'DELETE',
  });
  return res;
}

import { InterviewSelectionResponse } from '@/constants/httpMsg/interview/getInterviewMsg';
import { Group } from '@/constants/team';
import {
  DeleteInterviewRequest,
  DeleteInterviewResponse,
} from '@/constants/httpMsg/interview/deleteInterviewMsg';
import {
  CreateInterviewRequest,
  CreateInterviewResponse,
} from '@/constants/httpMsg/interview/createInterviewMsg';
import request from '../_request';

export async function getInterview(
  rid: string,
  name: Group,
): Promise<InterviewSelectionResponse> {
  const res: InterviewSelectionResponse = await request({
    url: `/recruitments/${rid}/interviews/${name}`,
    method: 'GET',
  });
  return res;
}

export async function deleteInterview(
  rid: string,
  name: Group,
  data: DeleteInterviewRequest,
): Promise<DeleteInterviewResponse> {
  const res: DeleteInterviewResponse = await request({
    url: `/recruitments/${rid}/interviews/${name}`,
    method: 'DELETE',
    data,
  });
  return res;
}

export async function createInterview(
  rid: string,
  name: Group,
  data: CreateInterviewRequest,
): Promise<CreateInterviewResponse> {
  const res: CreateInterviewResponse = await request({
    url: `/recruitments/${rid}/interviews/${name}`,
    method: 'POST',
    data,
  });
  return res;
}

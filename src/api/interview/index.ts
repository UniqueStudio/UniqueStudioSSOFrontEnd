import { InterviewSelectionResponse } from '@/constants/httpMsg/interview/getInterviewMsg';
import { Group } from '@/constants/team';
import {
  SetInterviewRequest,
  SetInterviewResponse,
} from '@/constants/httpMsg/interview/setInterviewMsg';
import request from '../_request';

export async function getInterview(
  rid: string,
  name: Group,
): Promise<InterviewSelectionResponse> {
  const res: InterviewSelectionResponse = await request({
    url: `/recruitments/${rid}/interviews/${name}/`,
    method: 'GET',
  });
  return res;
}

export async function setInterview(
  rid: string,
  name: Group,
  data: SetInterviewRequest,
): Promise<SetInterviewResponse> {
  const res: SetInterviewResponse = await request({
    url: `/recruitments/${rid}/interviews/${name}/`,
    method: 'PUT',
    data,
  });
  return res;
}

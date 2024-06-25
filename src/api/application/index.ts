import {
  AllApplicationsResponse,
  ApplicationResponse,
  AvailableInterviewSelectionsResponse,
} from '@/constants/httpMsg/application/getApplicationMsg';
import { Group } from '@/constants/team';
import {
  CreateApplicationRequest,
  CreateApplicationResponse,
} from '@/constants/httpMsg/application/createApplicationMsg';
import {
  RejectApplicationResponse,
  AllocateApplicationInterviewRequest,
  AllocateApplicationInterviewResponse,
  SelectApplicationInterviewRequest,
  SelectApplicationInterviewResponse,
  UpdateApplicationRequest,
  UpdateApplicationStepRequest,
  UpdateApplicationStepResponse,
} from '@/constants/httpMsg/application/updateApplicationMsg';
import { UpdateRecruitmentResponse } from '@/constants/httpMsg/recruitment/updateRecruitmentMsg';
import { DeleteApplicationResponse } from '@/constants/httpMsg/application/deleteApplicationMsg';
import { HR_BASE_URL } from '@/constants';
import request from '../_request';

export async function getAllApplications(
  rid: string,
): Promise<AllApplicationsResponse> {
  const res: AllApplicationsResponse = await request({
    url: `/applications/recruitment/${rid}`,
    method: 'GET',
  });
  return res;
}

export async function getApplication(
  aid: string,
): Promise<ApplicationResponse> {
  const res: ApplicationResponse = await request({
    url: `/applications/${aid}`,
    method: 'GET',
  });
  return res;
}

export async function getApplicationResume(aid: string): Promise<Blob> {
  return (
    await fetch(`${HR_BASE_URL}/applications/${aid}/resume`, {
      credentials: 'include',
    })
  ).blob();
}

export async function getApplicationWrittenTestAnswer(
  aid: string,
): Promise<Blob> {
  return (
    await fetch(`${HR_BASE_URL}/applications/${aid}/file/WrittenTest`, {
      credentials: 'include',
    })
  ).blob();
}

export async function getAvailableInterviewSelections(
  aid: string,
  type: Group,
): Promise<AvailableInterviewSelectionsResponse> {
  const res: AvailableInterviewSelectionsResponse = await request({
    url: `/applications/${aid}/slots/${type}`,
    method: 'GET',
  });
  return res;
}

export async function createApplication(
  data: CreateApplicationRequest,
): Promise<CreateApplicationResponse> {
  const res: CreateApplicationResponse = await request({
    url: '/applications',
    method: 'POST',
    data,
  });
  return res;
}

export async function updateApplication(
  aid: string,
  data: UpdateApplicationRequest,
): Promise<UpdateRecruitmentResponse> {
  const res: UpdateRecruitmentResponse = await request({
    url: `/applications/${aid}`,
    method: 'PUT',
    data,
  });
  return res;
}

export async function rejectApplication(
  aid: string,
): Promise<RejectApplicationResponse> {
  const res: RejectApplicationResponse = await request({
    url: `/applications/${aid}/rejected`,
    method: 'PUT',
  });
  return res;
}

export async function updateApplicationStep(
  aid: string,
  data: UpdateApplicationStepRequest,
): Promise<UpdateApplicationStepResponse> {
  const res: UpdateApplicationStepResponse = await request({
    url: `/applications/${aid}/step`,
    method: 'PUT',
    data,
  });
  return res;
}

export async function allocateApplicationInterview(
  aid: string,
  type: 'group' | 'team',
  data: AllocateApplicationInterviewRequest,
): Promise<AllocateApplicationInterviewResponse> {
  const res: AllocateApplicationInterviewResponse = await request({
    url: `/applications/${aid}/interviews/${type}`,
    method: 'PUT',
    data,
  });
  return res;
}

export async function selectApplicationInterview(
  aid: string,
  type: 'group' | 'team',
  data: SelectApplicationInterviewRequest,
): Promise<SelectApplicationInterviewResponse> {
  const res: SelectApplicationInterviewResponse = await request({
    url: `/applications/${aid}/slots/${type}`,
    method: 'PUT',
    data,
  });
  return res;
}

export async function deleteApplication(
  aid: string,
): Promise<DeleteApplicationResponse> {
  const res: DeleteApplicationResponse = await request({
    url: `/applications/${aid}`,
    method: 'DELETE',
  });
  return res;
}

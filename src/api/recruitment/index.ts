import {
  AllRecruitmentsResponse,
  RecruitmentResponse,
  LatestRecruitmentResponse,
  GetTestResponse,
} from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import {
  CreateRecruitmentRequest,
  CreateRecruitmentResponse,
} from '@/constants/httpMsg/recruitment/createRecruitmentMsg';
import {
  SetStressTestTimeRequest,
  SetStressTestTimeResponse,
  UpdateRecruitmentRequest,
  UpdateRecruitmentResponse,
  UploadTestRequest,
  UploadTestResponse,
} from '@/constants/httpMsg/recruitment/updateRecruitmentMsg';
import { Group, Step } from '@/constants/team';
import request from '../_request';

export async function getAllRecruitments(): Promise<AllRecruitmentsResponse> {
  const res: AllRecruitmentsResponse = await request({
    url: '/recruitments/all',
    method: 'GET',
  });
  return res;
}

export async function getRecruitment(
  rid: string,
): Promise<RecruitmentResponse> {
  const res: RecruitmentResponse = await request({
    url: `/recruitments/${rid}`,
    method: 'GET',
  });
  return res;
}

export async function getLatestRecruitment(): Promise<LatestRecruitmentResponse> {
  const res: LatestRecruitmentResponse = await request({
    url: '/recruitments/pending',
    method: 'GET',
  });
  return res;
}

export async function createRecruitment(
  data: CreateRecruitmentRequest,
): Promise<CreateRecruitmentResponse> {
  const res: CreateRecruitmentResponse = await request({
    url: '/recruitments',
    method: 'POST',
    data,
  });
  return res;
}

export async function updateRecruitment(
  rid: string,
  data: UpdateRecruitmentRequest,
): Promise<UpdateRecruitmentResponse> {
  const res: UpdateRecruitmentResponse = await request({
    url: `/recruitments/${rid}/schedule`,
    method: 'PUT',
    data,
  });
  return res;
}

export async function uploadTest(
  rid: string,
  group: Group,
  data: UploadTestRequest,
): Promise<UploadTestResponse> {
  const fd = new FormData();
  fd.append('file', data);
  const res: UploadTestResponse = await request({
    url: `/recruitments/${rid}/file/${group}/${Step.WrittenTest}`,
    method: 'PUT',
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
}

export async function SetStressTestTime(
  rid: string,
  data: SetStressTestTimeRequest,
): Promise<SetStressTestTimeResponse> {
  const res: SetStressTestTimeResponse = await request({
    url: `/recruitments/${rid}/stressTest`,
    method: 'PUT',
    data,
  });
  return res;
}

export async function getTest(
  rid: string,
  group: Group,
): Promise<GetTestResponse> {
  const res: GetTestResponse = await request({
    url: `/recruitments/${rid}/file/${group}/${Step.WrittenTest}`,
    method: 'GET',
  });
  return res;
}

import {
  AllRecruitmentsResponse,
  RecruitmentResponse,
  LatestRecruitmentResponse,
} from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import {
  CreateRecruitmentRequest,
  CreateRecruitmentResponse,
} from '@/constants/httpMsg/recruitment/createRecruitmentMsg';
import {
  UpdateRecruitmentRequest,
  UpdateRecruitmentResponse,
} from '@/constants/httpMsg/recruitment/updateRecruitmentMsg';
import request from '../_request';

export async function getAllRecruitments(): Promise<AllRecruitmentsResponse> {
  const res: AllRecruitmentsResponse = await request({
    url: '/recruitments',
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

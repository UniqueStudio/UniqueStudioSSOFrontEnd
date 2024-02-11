import { Step } from '@/constants/team';
import { HttpRes } from '../_httpResTemplate';

export interface SmsRequest {
  type: 'Accept' | 'Reject';
  current: Step;
  next: Step;
  time: string; // 笔试/面试/熬测时间
  place: string; // 地点
  meetingId: string; // 在线面试的会议id
  rest: string; // 补充信息
  aids: string[]; // 简历id
}

export type SmsResponse = HttpRes<object>;

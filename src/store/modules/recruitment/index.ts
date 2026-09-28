import { defineStore } from 'pinia';
import {
  getAllRecruitments,
  getLatestRecruitment,
  getRecruitment,
  createRecruitment,
  updateRecruitment,
  uploadTest,
  uploadTestUrl,
  SetStressTestTime,
  getTest,
  deleteInterview,
  createInterview,
} from '@/api';
import { getWrittenTestType, setWrittenTestType } from '@/api/recruitment';
import {
  RecruitmentState,
  UpdateParams,
  SetTimeParams,
  CreateParams,
  CandidateInfo,
  Group,
  InterviewInfo,
  CreateInterviewRequest,
} from './types';

const useRecruitmentStore = defineStore('recruitment', {
  state: (): RecruitmentState => ({
    data: [],
    currentRid: '',
    currentRec: undefined,
    isBaseInfo: false,
  }),
  actions: {
    async getAllRecruitments() {
      const res = await getAllRecruitments();
      this.data = res.data;
      if (this.currentRid === '') {
        await this.setCurrentRecruitment(this.currentRid);
      }
    },
    async getRecruitment(rid: string) {
      const res = await getRecruitment(rid);
      return res.data;
    },
    async getLatestRecruitment() {
      const res = await getLatestRecruitment();
      return res.data;
    },
    async setCurrentRecruitment(rid: string) {
      const data = await (rid === ''
        ? this.getLatestRecruitment()
        : this.getRecruitment(rid));
      this.currentRid = data.uid;
      this.currentRec = data;
    },
    async refresh() {
      await this.setCurrentRecruitment(this.currentRid);
    },
    async createRecruitment(data: CreateParams) {
      await createRecruitment(data);
      this.getAllRecruitments();
    },
    async updateRecruitment(rid: string, data: UpdateParams) {
      await updateRecruitment(rid, data);
      if (rid === this.currentRid) {
        await this.setCurrentRecruitment(rid);
      }
      this.getAllRecruitments();
    },
    async uploadTest(rid: string, group: Group, data: File | string) {
      if (typeof data === 'string') {
        await setWrittenTestType(rid, group, 2);
        console.log('上传测试链接', await getWrittenTestType(rid, group));
        const res = await uploadTestUrl(rid, group, data);
        return res;
      }
      await setWrittenTestType(rid, group, 1);
      const res = await uploadTest(rid, group, data);
      return res;
    },
    async SetStressTestTime(rid: string, data: SetTimeParams) {
      const res = await SetStressTestTime(rid, data);
      return res;
    },
    async getTest(rid: string, group: Group) {
      const res = await getTest(rid, group);
      return res.data;
    },
    async deleteInterview(group: Group, iid: string) {
      const res = await deleteInterview(this.currentRid, group, [{ iid }]);
      return res.data;
    },
    async createInterview(group: Group, data: CreateInterviewRequest) {
      const res = await createInterview(this.currentRid, group, data);
      return res.data;
    },
    setBaseInfoActive(active: boolean) {
      this.isBaseInfo = active;
    },
  },
  getters: {
    curApplications(): CandidateInfo[] {
      return this.currentRec?.applications ?? [];
    },
    curInterviews(): InterviewInfo[] {
      return this.currentRec?.interviews ?? [];
    },
    beginningDate(): string {
      return this.currentRec?.beginning ?? '';
    },
  },
});

export default useRecruitmentStore;

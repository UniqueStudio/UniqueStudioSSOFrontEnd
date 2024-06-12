import { defineStore } from 'pinia';
import {
  getAllRecruitments,
  getLatestRecruitment,
  getRecruitment,
  createRecruitment,
  updateRecruitment,
  uploadTest,
  SetStressTestTime,
  getTest,
} from '@/api';
import { Evaluation } from '@/constants/team';
import {
  RecruitmentState,
  UpdateParams,
  SetTimeParams,
  CreateParams,
  CandidateInfo,
  Group,
  InterviewInfo,
} from './types';

const useRecruitmentStore = defineStore('recruitment', {
  state: (): RecruitmentState => ({
    data: [],
    currentRid: '',
    currentRec: undefined,
  }),
  actions: {
    async getAllRecruitments() {
      const res = await getAllRecruitments();
      this.data = res.data;
      if (this.currentRid === '') {
        this.setCurrentRecruitment(this.currentRid);
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
      this.setCurrentRecruitment(this.currentRid);
    },
    async createRecruitment(data: CreateParams) {
      await createRecruitment(data);
      this.getAllRecruitments();
    },
    async updateRecruitment(rid: string, data: UpdateParams) {
      await updateRecruitment(rid, data);
      if (rid === this.currentRid) {
        this.setCurrentRecruitment(rid);
      }
      this.getAllRecruitments();
    },
    async uploadTest(rid: string, group: Group, data: File) {
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
  },
  getters: {
    curApplications(): CandidateInfo[] {
      return this.currentRec?.applications ?? [];
    },
    curInterviews(): InterviewInfo[] {
      return this.currentRec?.interviews ?? [];
    },
  },
});

export default useRecruitmentStore;

import { defineStore } from 'pinia';
import {
  getAllRecruitments,
  getLatestRecruitment,
  getRecruitment,
  createRecruitment,
  updateRecruitment,
} from '@/api';
import { Evaluation } from '@/constants/team';
import {
  RecruitmentState,
  UpdateParams,
  CreateParams,
  CandidateInfo,
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
  },
  getters: {
    curApplications(): CandidateInfo[] {
      return (this.currentRec?.applications ?? []).map((app) => {
        const comments = [
          Evaluation.Good,
          Evaluation.Normal,
          Evaluation.Bad,
        ].map(
          (eva) =>
            app.comments?.filter(({ evaluation }) => evaluation === eva) ?? [],
        ) as unknown as CandidateInfo['comments'];
        return {
          ...app,
          comments,
        };
      });
    },
  },
});

export default useRecruitmentStore;

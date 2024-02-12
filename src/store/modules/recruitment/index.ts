import { defineStore } from 'pinia';
import {
  getAllRecruitments,
  getLatestRecruitment,
  getRecruitment,
  createRecruitment,
  updateRecruitment,
} from '@/api';
import { RecruitmentState, UpdateParams, CreateParams } from './types';

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
});

export default useRecruitmentStore;

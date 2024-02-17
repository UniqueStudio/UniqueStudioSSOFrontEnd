import { defineStore } from 'pinia';
import { getApplication, getApplicationResume } from '@/api';
import { Evaluation } from '@/constants/team';
import { ApplicationState, CandidateInfo } from './types';

const useApplicationStore = defineStore('application', {
  state: (): ApplicationState => ({
    data: undefined,
  }),
  actions: {
    async getApplication(aid: string) {
      const res = await getApplication(aid);
      const comments = [Evaluation.Good, Evaluation.Normal, Evaluation.Bad].map(
        (eva) =>
          res.data.comments?.filter(({ evaluation }) => evaluation === eva) ??
          [],
      ) as unknown as CandidateInfo['comments'];
      this.data = {
        ...res.data,
        comments,
      };
    },
    async getApplicationResume(aid: string) {
      await getApplicationResume(aid);
    },
  },
});

export default useApplicationStore;

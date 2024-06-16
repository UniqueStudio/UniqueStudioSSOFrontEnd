import { defineStore } from 'pinia';
import {
  getApplication,
  getApplicationResume,
  getApplicationWrittenTestAnswer,
} from '@/api';
import { downloadFile } from '@/utils';
import { ApplicationState } from './types';

const useApplicationStore = defineStore('application', {
  state: (): ApplicationState => ({
    data: undefined,
  }),
  actions: {
    async resetApplication() {
      this.data = undefined;
    },
    async getApplication(aid: string) {
      const res = await getApplication(aid);
      this.data = res.data;
    },
    async getApplicationResume(aid: string, fileName: string) {
      const data = await getApplicationResume(aid);
      downloadFile(data, fileName);
    },
    async getApplicationWrittenTestAnswer(aid: string, fileName: string) {
      const data = await getApplicationWrittenTestAnswer(aid);
      downloadFile(data, fileName);
    },
  },
});

export default useApplicationStore;

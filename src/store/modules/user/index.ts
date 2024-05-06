import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { getUserInfo } from '@/api';
import { UserState } from './types';

const router = useRouter();

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    data: null,
  }),
  actions: {
    returnLogin() {
      router.push({
        name: 'login',
      });
    },
    async getUserInfo() {
      const res = await getUserInfo();
      this.data = res.data;
    },
  },
});

export default useUserStore;

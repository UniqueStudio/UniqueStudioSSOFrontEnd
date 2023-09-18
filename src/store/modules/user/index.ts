import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();

const useUserStore = defineStore('user', {
  state: () => ({}),
  actions: {
    returnLogin() {
      router.push({
        name: 'login',
      });
    },
  },
});

export default useUserStore;

import { defineStore } from 'pinia';
import router from '@/router';

const useUserStore = defineStore('user',{
  state:() => ({

  }),
  actions:{
    returnLogin(){
      router.push({
        name:'login',
      })
    }
  },
});

export default useUserStore;
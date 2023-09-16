import { defineStore } from 'pinia';
import defaultSettings from '@/config/settings.json';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),
  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // 会出现ts类型检查错误：Type instantiation is excessively deep and possibly infinite
      // @ts-ignore-next-line
      this.$patch(partial);
    },
  },
});

export default useAppStore;

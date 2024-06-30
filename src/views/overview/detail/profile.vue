<template>
  <div class="flex flex-col gap-3 text-[--color-text-1]">
    <div class="flex pl-5 pb-2 sm:flex-col items-center gap-3 sm:gap-0">
      <a-avatar :size="64">
        <img v-if="user?.avatar_url" :src="user.avatar_url" />
        <span v-else>{{ user?.name ?? '' }}</span>
      </a-avatar>
      <div>
        <div class="pt-3 sm:text-center">{{ user?.name ?? '' }}</div>
        <div class="text-[--color-text-3] sm:text-center">{{
          applyStore.data?.group ?? ''
        }}</div>
        <div class="sm:hidden flex items-center">
          <icon-phone />
          <span class="ml-2.5 w-52 overflow-x-auto">{{
            user?.phone ?? ''
          }}</span>
        </div>
        <div class="sm:hidden flex items-center">
          <icon-email />
          <span class="ml-2.5 w-52 overflow-x-auto">{{
            user?.email ?? ''
          }}</span>
        </div>
      </div>
    </div>

    <div class="hidden sm:flex flex-col justify-around gap-3 w-56 px-2">
      <div class="flex gap-4">
        <div
          class="w-9 h-9 rounded-full flex justify-center items-center bg-[rgb(var(--gray-2))] shrink-0"
        >
          <icon-phone size="20" />
        </div>
        <div>
          <div class="text-[--color-text-3]">
            {{ $t('common.user.phone') }}
          </div>
          <a-scrollbar class="overflow-x-auto" outer-class="w-44 pb-2">{{
            user?.phone ?? ''
          }}</a-scrollbar>
        </div>
      </div>

      <div class="flex gap-3">
        <div
          class="w-9 h-9 rounded-full flex justify-center items-center bg-[rgb(var(--gray-2))] shrink-0"
        >
          <icon-email size="20" />
        </div>
        <div>
          <div class="text-[--color-text-3]">
            {{ $t('common.user.email') }}
          </div>
          <a-scrollbar class="overflow-x-auto" outer-class="w-44 pb-2">{{
            user?.email ?? ''
          }}</a-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useApplicationStore from '@/store/modules/application';

const applyStore = useApplicationStore();
const user = computed(() => applyStore.data?.user_detail);
</script>

<style scoped lang="less"></style>

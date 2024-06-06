<template>
  <div class="bg-[--color-bg-1] w-full p-5 pb-10">
    <div class="text-[--color-text-1] text-xl p-5 font-bold">{{
      $t('common.applyInfo.overview')
    }}</div>
    <div class="flex p-5 justify-evenly">
      <div class="flex mr-96">
        <icon-close-circle-fill
          class="pt-3 pr-5 text-7xl"
        ></icon-close-circle-fill>
        <div class="flex flex-col">
          <span class="text-gray-500 pb-3 text-lg font-medium">{{
            $t('common.applyInfo.groupMemberCounts')
          }}</span>
          <span class="font-bold text-4xl"> 0 </span>
        </div>
      </div>
      <div class="flex mr-24">
        <icon-close-circle-fill
          class="pt-3 pr-5 text-7xl"
        ></icon-close-circle-fill>
        <div class="flex flex-col">
          <span class="text-gray-500 pb-3 text-lg font-medium">{{
            $t('common.applyInfo.candidateCounts')
          }}</span>
          <span class="font-bold text-4xl">
            {{ allGroupMemberCounts }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex w-full">
      <div class="w-1/2">
        <group-pie-chart></group-pie-chart>
      </div>
      <div class="w-1/2">
        <recruitment-pie-chart></recruitment-pie-chart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useRecruitmentStore from '@/store/modules/recruitment';
import groupPieChart from './charts/group-pie-chart.vue';
import recruitmentPieChart from './charts/recruitment-pie-chart.vue';

const recStore = useRecruitmentStore();
const allGroupMemberCounts = computed(() => recStore.curApplications.length);
</script>

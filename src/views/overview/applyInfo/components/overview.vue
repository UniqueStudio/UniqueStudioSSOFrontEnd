<template>
  <div class="bg-[--color-bg-1] w-full p-5 pb-10">
    <div class="text-[--color-text-1] text-xl p-5 font-bold">{{
      $t('common.applyInfo.overview')
    }}</div>
    <div class="p-5 flex justify-around">
      <div class="flex">
        <icon-user-group
          class="pt-3 pr-5 text-7xl text-[--color-text-1]"
        ></icon-user-group>
        <div class="flex flex-col">
          <span class="text-[--color-text-1] pb-3 text-lg font-medium">{{
            $t('common.applyInfo.groupMemberCounts')
          }}</span>
          <span class="font-bold text-4xl text-[--color-text-1]">
            {{ allGroupMemberCounts }}
          </span>
        </div>
      </div>
      <div class="flex">
        <icon-user class="pt-3 pr-5 text-7xl text-[--color-text-1]"></icon-user>
        <div class="flex flex-col">
          <span class="text-[--color-text-1] pb-3 text-lg font-medium">{{
            $t('common.applyInfo.candidateCounts')
          }}</span>
          <span class="font-bold text-4xl text-[--color-text-1]">
            {{ allApplicationCounts }}
          </span>
        </div>
      </div>
    </div>
    <div class="hidden sm:flex sm:w-full">
      <div class="w-1/2">
        <group-pie-chart></group-pie-chart>
      </div>
      <div class="w-1/2">
        <recruitment-pie-chart></recruitment-pie-chart>
      </div>
    </div>
    <a-carousel
      class="h-80 sm:hidden"
      indicator-position="outer"
      indicator-type="line"
    >
      <a-carousel-item>
        <group-pie-chart-sm></group-pie-chart-sm>
      </a-carousel-item>
      <a-carousel-item>
        <recruitment-pie-chart-sm></recruitment-pie-chart-sm>
      </a-carousel-item>
    </a-carousel>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import useRecruitmentStore from '@/store/modules/recruitment';
import groupPieChart from './charts/group-pie-chart.vue';
import recruitmentPieChart from './charts/recruitment-pie-chart.vue';
import groupPieChartSm from './charts/group-pie-chart-sm.vue';
import recruitmentPieChartSm from './charts/recruitment-pie-chart-sm.vue';

const recStore = useRecruitmentStore();
const allApplicationCounts = computed(() => recStore.curApplications.length);
const allGroupMemberCounts = ref(null);

watchEffect(async () => {
  const recruitmentData = await recStore.getLatestRecruitment();
  // @ts-ignore
  allGroupMemberCounts.value = computed(() => {
    return Object.values(recruitmentData.group_details as any[]).reduce(
      (sum, val) => sum + val,
      0,
    );
  });
});
</script>

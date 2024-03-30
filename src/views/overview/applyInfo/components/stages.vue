<template>
  <div class="bg-white w-full p-5 mt-5">
    <div class="flex justify-between">
      <div class="text-[--color-text-1] text-xl font-bold p-3">{{
        $t('common.applyInfo.candidateStagesOverview')
      }}</div>
      <a-select v-model="currentGroup" class="w-28 h-10 bg-white">
        <a-option>PM</a-option>
        <a-option>Design</a-option>
        <a-option>AI</a-option>
        <a-option>Android</a-option>
        <a-option>Web</a-option>
        <a-option>IOS</a-option>
        <a-option>Lab</a-option>
        <a-option>Game</a-option>
      </a-select>
    </div>
    <div class="pl-3 pt-3">
      <span class="text-5xl font-bold mr-3">{{ groupMemberCounts }}</span
      ><span class="text-gray-500 text-sm"
        >{{ currentGroup }}{{ $t('common.applyInfo.candidateCounts') }}</span
      >
    </div>
    <div class="w-full">
      <rect-chart :cur-group="currentGroup"></rect-chart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import useRecruitmentStore from '@/store/modules/recruitment';
import rectChart from './charts/rect-chart.vue';

const recStore = useRecruitmentStore();
const currentGroup = ref('PM');
const groupMemberCounts = computed(
  () =>
    recStore.curApplications.filter(({ group }) => {
      return currentGroup.value.toLowerCase() === group;
    }).length,
);
</script>

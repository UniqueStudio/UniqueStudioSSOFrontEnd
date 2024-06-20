<template>
  <div class="bg-[--color-bg-1] w-full p-5 mt-5">
    <div class="flex justify-between">
      <div class="text-[--color-text-1] text-xl font-bold p-3">{{
        $t('common.applyInfo.candidateStagesOverview')
      }}</div>
      <a-select v-model="currentGroup" class="w-28 h-10 bg-[--color-bg-1]">
        <a-option v-for="item in groups" :key="item">{{ item }}</a-option>
      </a-select>
    </div>
    <div class="pl-3 pt-3">
      <span class="text-5xl font-bold mr-3 text-[--color-text-1]">{{
        groupMemberCounts
      }}</span
      ><span class="text-[--color-text-1] text-sm"
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
import { Group } from '@/constants/team';
import rectChart from './charts/rect-chart.vue';

const recStore = useRecruitmentStore();
const currentGroup = ref('PM');
const groups = Object.values(Group).filter((x) => x !== Group.Unique);
const groupMemberCounts = computed(
  () =>
    recStore.curApplications.filter(({ group }) => {
      return currentGroup.value.toLowerCase() === group;
    }).length,
);
</script>

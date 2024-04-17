<template>
  <div class="flex-1 bg-white rounded p-5 max-h-216">
    <a-scrollbar type="embed" class="overflow-y-auto max-h-193 mb-5">
      <div class="w-full font-normal mb-5 text-xl flex justify-between">
        <span>{{ $t('common.applyInfo.Schedules') }}</span>
        <!-- <a-select v-model="uploadData.group" 
          class="text-[--color-text-2] text-2xl w-28 bg-transparent" 
        >
          <a-option v-for="item in groups" :key="item"> {{ item }} </a-option>
        </a-select> -->
        <a-dropdown>
          <div class="cursor-pointer text-[--color-text-2] text-base">
            <span class="mr-1"> {{ currentGroup }} </span>
            <icon-down />
          </div>
          <template #content>
            <a-doption
              v-for="item in groups"
              :key="item"
              @click="handleGroupClick(item)"
            >
              {{ item }}
            </a-doption>
          </template>
        </a-dropdown>
      </div>
      <div class="flex flex-col">
        <li
          v-for="info in props.infos"
          :key="info.name"
          class="list-none mb-2.5"
        >
          <div class="overflow-hidden flex items-center mb-1">
            <icon-calendar
              class="w-9 h-9 text-xl rounded-full border-2 p-2 bg-gray-100 text-blue-600 float-left mr-2.5"
            />
            <span class="float-left">{{ info.name }}</span>
          </div>
          <div class="overflow-hidden flex items-center">
            <icon-clock-circle
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              info.groupInterviewStart
            }}</span>
          </div>
          <div class="overflow-hidden flex items-center">
            <icon-location
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              'Room 101'
            }}</span>
          </div>
          <div class="overflow-hidden flex items-center">
            <icon-user
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              'Room 101'
            }}</span>
          </div>
          <span class="float-left pl-2 leading-10 text-slate-400 text-sm">{{
            'Room 101'
          }}</span>
        </li>
      </div>
    </a-scrollbar>

    <a-button
      type="dashed"
      class="text-base w-full flex justify-center items-center align-bottom rounded"
      @click="goManagement"
    >
      <span class="mt-0.5">{{
        $t('menu.interview.management')
      }}</span></a-button
    >
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { Group } from '@/constants/team';
import { ref, computed } from 'vue';

interface CandidateInfo {
  name: string;
  step: string;
  groupInterviewEnd: string;
  groupInterviewStart: string;
  teamInterviewEnd: string;
  teamInterviewStart: string;
}
const props = defineProps<{
  infos: CandidateInfo[];
}>();

const currentGroup = ref(Group.Web);
defineExpose({ currentGroup }); // expose currentGroup to parent component

const groups = computed(() =>
  Object.values(Group).filter((x) => x !== Group.Unique),
);

const goManagement = () => {
  router.push({ name: 'interviewMangement' });
};

const handleGroupClick = (item: any) => {
  currentGroup.value = item;
};
</script>

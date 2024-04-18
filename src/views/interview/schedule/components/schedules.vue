<template>
  <div class="rounded p-5 relative bg-[--color-bg-2]">
    <div class="w-full font-normal mb-5 text-xl flex justify-between">
      <span class="text-[--color-text-1]">{{
        $t('common.applyInfo.Schedules')
      }}</span>
      <a-dropdown>
        <div class="cursor-pointer text-[--color-text-1] text-base">
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
    <a-scrollbar type="embed" class="overflow-y-auto mb-5 max-h-158">
      <div class="flex flex-col">
        <li
          v-for="info in props.infos"
          :key="info.name"
          class="list-none mb-2.5"
        >
          <div class="overflow-hidden flex items-center mb-1">
            <icon-calendar
              class="w-9 h-9 text-xl rounded-full border-2 p-2 bg-gray-100 text-blue-600 float-left mr-3"
            />
            <span class="float-left text-[--color-text-1]"
              >{{ info.group }}{{ interviewType(info) }}</span
            >
          </div>
          <div class="overflow-hidden flex items-center">
            <icon-clock-circle
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-[--color-text-3]">{{
              info.interviewPeriod
            }}</span>
          </div>

          <div class="overflow-hidden flex items-center">
            <icon-user
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-[--color-text-3]">{{
              info.name
            }}</span>
          </div>
        </li>
      </div>
      <!-- <div class="flex flex-col">
        <li
          v-for="info in schedulesEg"
          :key="info.name"
          class="list-none mb-2.5"
        >
          <div class="overflow-hidden flex items-center mb-1">
            <icon-calendar
              class="w-9 h-9 text-xl rounded-full border-2 p-2 bg-gray-100 text-blue-600 float-left mr-2.5"
            />
            <span class="float-left"
              >{{ info.name }}</span
            >
          </div>
          <div class="overflow-hidden flex items-center">
            <icon-clock-circle
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              info.time
            }}</span>
          </div>

          <div class="overflow-hidden flex items-center">
            <icon-user
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              info.player
            }}</span>
          </div>
          <span class="float-left pl-2 leading-10 text-slate-400 text-sm">{{
            info.description
          }}</span>
        </li>
      </div> -->
    </a-scrollbar>

    <a-button
      type="dashed"
      class="text-base flex justify-center items-center rounded absolute bottom-5 inset-x-5"
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface CandidateInfo {
  name: string;
  step: string;
  group: string;
  interviewPeriod: string;
}

const props = defineProps<{
  infos: CandidateInfo[];
}>();

const { t } = useI18n();

const currentGroup = defineModel<Group>({
  required: true,
});

const groups = computed(() =>
  Object.values(Group).filter((x) => x !== Group.Unique),
};

const handleGroupClick = (item: any) => {
  currentGroup.value = item;
};

const interviewType = (info: CandidateInfo) => {
  const groupInterview = 'common.steps.GroupInterview';
  const teamInterview = 'common.steps.TeamInterview';
  return t(info.step === 'GroupInterview' ? groupInterview : teamInterview);
};

// const schedulesEg = [
//   {
//     date: new Date('2024-01-01'),
//     name: 'PM组面',
//     time: '13.00-14.00（1h）',
//     player: '苦瓜',
//     description: '可以调时间',
//   },
//   {
//     date: new Date('2024-01-01'),
//     name: 'Design组面',
//     time: '19:00-21:00（2h）',
//     location: '810',
//     player: '周子涵',
//     description: '可以调时间',
//   },
//   {
//     date: new Date('2024-01-01'),
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '柴犬',
//     description: '没别的时间了',
//   },
//   {
//     date: new Date('2024-01-02'),
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: 'kid',
//     description: '没别的时间了',
//   },
//   {
//     date: new Date('2024-01-02'),
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '一架飞机',
//     description: '可以调时间',
//   },
//   {
//     date: new Date('2024-01-03'),
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '菜菜子',
//     description: '没别的时间了',
//   },
// ]; // 测试
</script>

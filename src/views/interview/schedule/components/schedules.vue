<template>
  <div class="flex-1 bg-white rounded p-5 h-193 relative">
    <div class="w-full font-normal mb-5 text-xl flex justify-between">
      <span>{{ $t('common.applyInfo.Schedules') }}</span>
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
    <a-scrollbar type="embed" class="overflow-y-auto mb-5 max-h-158">
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
            <span class="float-left"
              >{{ info.group }}{{ interviewType(info) }}</span
            >
          </div>
          <div class="overflow-hidden flex items-center">
            <icon-clock-circle
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              info.interviewPeriod
            }}</span>
          </div>

          <div class="overflow-hidden flex items-center">
            <icon-user
              class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              info.name
            }}</span>
          </div>
        </li>
      </div>
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
import { defineModel, computed } from 'vue';
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
);

const goManagement = () => {
  router.push({ name: 'interviewMangement' });
};

const handleGroupClick = (item: any) => {
  currentGroup.value = item;
};

const interviewType = (info: CandidateInfo) => {
  const groupInterview = 'common.steps.GroupInterview';
  const teamInterview = 'common.steps.TeamInterview';
  return t(info.step === 'GroupInterview' ? groupInterview : teamInterview);
};
</script>

<template>
  <div>
    <a-button class="pl-1 pr-2" @click="showDateManagement = false">
      <icon-left />
      {{ $t('common.operation.returnInterviewManagement') }}
    </a-button>
  </div>
  <div class="bg-white w-full p-5">
    <div class="flex flex-row justify-between">
      <div class="text-[--color-text-1] text-xl">{{
        $t('common.operation.dateManagement')
      }}</div>
      <team-group-radio v-model="currentGroup"></team-group-radio>
    </div>
  </div>
  <div>
    <li v-for="info in infos" :key="info.name" class="list-none mb-2.5">
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
</template>

<script setup lang="ts">
import { defineModel, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Group } from '@/constants/team';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';

const { t } = useI18n();
const currentGroup = ref(Group.Web);

const showDateManagement = defineModel<boolean>('showDateManagement', {
  type: Boolean,
  default: true,
  required: true,
});
</script>

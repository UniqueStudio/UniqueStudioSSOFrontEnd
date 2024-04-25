<template>
  <div class="flex-4 bg-white rounded-sm h-full">
    <a-calendar v-model="curDate">
      <template #default="{ year, month, date }">
        <div
          class="arco-calendar-date"
          @click="handleCellClick(year, month, date)"
        >
          <div class="arco-calendar-date-value">
            <div class="arco-calendar-date-circle">{{ date }}</div>
          </div>
          <div v-for="(info, index) in props.infos" :key="info.step">
            <div
              v-if="
                formatToday(info.date) === formatDate(year, month, date) &&
                index < 2
              "
              class="flex intems-center mb-1"
            >
              <a-badge
                class="float-left mr-2 flex items-center justify-center"
                :color="COLORS[index]"
              ></a-badge>
              <span class="float-left"
                >{{ info.group }}{{ interviewType(info) }}</span
              >
            </div>
            <div v-else-if="index >= 2">
              <span class="float-left text-blue-500">{{
                `剩余${props.infos.length - 2}条信息`
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';

interface InterviewInfo {
  step: string;
  group: string;
  date: Date;
}

const props = defineProps<{
  infos: InterviewInfo[];
}>();
const COLORS = ['green', 'arcoblue'];
const curDate = ref(new Date('2024-01-01'));
const { t } = useI18n();
const formatToday = inject('formatToday') as (date: Date) => string;
const parseDate = inject('parseDate') as (dateString: string) => Date;
const emits = defineEmits(['dateClick']);

function formatDate(year: number, month: number, date: number) {
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDate = date.toString().padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDate}`;
}

// 点击某个日期cell事件处理
const handleCellClick = (year: number, month: number, date: number) => {
  curDate.value = parseDate(formatDate(year, month, date));
  emits('dateClick', curDate.value);
};

const interviewType = (info: InterviewInfo) => {
  const groupInterview = 'common.steps.GroupInterview';
  const teamInterview = 'common.steps.TeamInterview';
  return t(info.step === 'GroupInterview' ? groupInterview : teamInterview);
};
</script>

<style scoped lang="less"></style>

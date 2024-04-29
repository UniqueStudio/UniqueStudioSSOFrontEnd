<template>
  <div class="flex-4 bg-white rounded-sm h-full">
    <a-calendar v-model="curDate" class="month-row">
      <template #default="{ year, month, date }">
        <div
          class="arco-calendar-date"
          @click="handleCellClick(year, month, date)"
        >
          <div class="arco-calendar-date-value">
            <div class="arco-calendar-date-circle">{{ date }}</div>
          </div>
          <div
            v-for="(info, index) in filteredInfos(year, month, date).slice(
              0,
              2,
            )"
            :key="formatToday(info.date)"
          >
            <div v-if="index < 2" class="flex items-center mb-1">
              <a-badge
                class="float-left mr-2 flex items-center justify-center"
                :color="COLORS[index % COLORS.length]"
              ></a-badge>
              <span class="float-left text-sm"
                >{{ info.group }}{{ interviewType(info) }}</span
              >
            </div>
          </div>
          <div v-if="hasMoreThanTwoInfos(year, month, date)">
            <span class="float-left text-blue-600 text-sm">{{
              `剩余${filteredInfos(year, month, date).length - 2}个日程`
            }}</span>
          </div>
          <!-- <div v-for="(info, index) in filteredInfos(year, month, date).slice(0,2)" :key="info.date">
            <div
              v-if="index < 2"
              class="flex items-center mb-1"
            >
              <a-badge
                class="float-left mr-2 flex items-center justify-center"
                :color="COLORS[index % COLORS.length]"
              ></a-badge>
              <span class="float-left text-sm"
                >{{ info.name }}</span
              >
            </div>
          </div>
          <div
            v-if="hasMoreThanTwoInfos(year, month, date)"
          >
            <span class="float-left text-blue-600 text-sm">{{
              `剩余${filteredInfos(year,month,date).length - 2}个日程`
            }}</span>
          </div> -->
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue';
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

const filteredInfos = (year: number, month: number, date: number) => {
  return props.infos.filter(
    (info) => formatToday(info.date) === formatDate(year, month, date),
  );
};

const hasMoreThanTwoInfos = (
  year: number,
  month: number,
  date: number,
): boolean => {
  const limitedInfos = filteredInfos(year, month, date).slice(0, 2);
  return (
    props.infos.filter(
      (info) => formatToday(info.date) === formatDate(year, month, date),
    ).length > limitedInfos.length
  );
};
// const schedulesEg = [
//   {
//     date: '2024-01-01',
//     name: 'PM组面',
//     time: '13.00-14.00（1h）',
//     player: '苦瓜',
//     description: '可以调时间',
//   },
//   {
//     date: '2024-01-01',
//     name: 'Design组面',
//     time: '19:00-21:00（2h）',
//     location: '810',
//     player: '周子涵',
//     description: '可以调时间',
//   },
//   {
//     date: '2024-01-01',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '柴犬',
//     description: '没别的时间了',
//   },
//   {
//     date: '2024-01-02',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: 'kid',
//     description: '没别的时间了',
//   },
//   {
//     date: '2024-01-02',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '一架飞机',
//     description: '可以调时间',
//   },
//   {
//     date: '2024-01-03',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '菜菜子',
//     description: '没别的时间了',
//   },
//   {
//     date: '2024-01-03',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '菜菜子',
//     description: '没别的时间了',
//   },
//   {
//     date: '2024-01-03',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '菜菜子',
//     description: '没别的时间了',
//   },
//   {
//     date: '2024-01-03',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '菜菜子',
//     description: '没别的时间了',
//   },
//   {
//     date: '2024-01-03',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '菜菜子',
//     description: '没别的时间了',
//   },
//   {
//     date: '2024-01-03',
//     name: 'web组面',
//     time: '13:00-13:30（0.5h）',
//     location: '811',
//     player: '菜菜子',
//     description: '没别的时间了',
//   },
// ]; // 测试
</script>

<style scoped lang="less">
.month-row {
  :deep(.arco-calendar-month-row) {
    height: 115px;
  }
}
</style>

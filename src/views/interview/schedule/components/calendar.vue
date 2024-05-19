<template>
  <div class="bg-white rounded-sm">
    <a-calendar v-model="curDate" class="month-min">
      <template #default="{ year, month, date }">
        <div
          class="arco-calendar-date"
          @click="handleCellClick(year, month, date)"
        >
          <div class="arco-calendar-date-value">
            <div class="arco-calendar-date-circle lg:text-lg">{{ date }}</div>
          </div>
          <div
            v-for="(info, index) in filteredInfos(year, month, date).slice(
              0,
              2,
            )"
            :key="info.date.getTime()"
            class="mt-1.5 hidden lg:block"
          >
            <div class="flex items-center mb-0.5">
              <a-badge
                class="float-left mr-2 flex items-center justify-center"
                :color="COLORS[index]"
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

// 优化 filteredInfos 性能
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
  const filteredInfosList = filteredInfos(year, month, date);
  return filteredInfosList.length > 2;
};
</script>

<style scoped lang="less">
.month-min {
  :deep(.arco-calendar-month .arco-calendar-month-row) {
    height: 50px;
  }

  :deep(.arco-calendar-header) {
    padding: 24px 12px;
    white-space: nowrap;

    &-icon {
      width: 21px;
      margin-right: 8px;
      &:not(:first-child) {
        margin: 0 8px;
      }
    }
  }

  :deep(.arco-btn-size-small) {
    padding: 0 10px;
  }

  :deep(.arco-calendar-week-list-item) {
    padding: 10px 0;
    text-align: center;
  }
}

@media (min-width: 1024px) {
  .month-min {
    :deep(.arco-calendar-month .arco-calendar-month-row) {
      height: 99px;
    }
  }
}
</style>

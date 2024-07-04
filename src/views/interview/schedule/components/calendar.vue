<template>
  <div class="rounded-sm bg-[--color-bg-2]">
    <a-calendar v-model="curDate" class="month-min">
      <template #default="{ year, month, date }">
        <div
          class="arco-calendar-date"
          @click="handleCellClick(year, month, date)"
        >
          <div
            class="arco-calendar-date-value flex justify-center lg:justify-start"
          >
            <div class="arco-calendar-date-circle lg:text-lg text-center">{{
              date
            }}</div>
          </div>
          <div
            v-for="(info, index) in filteredInfos(year, month, date).slice(
              0,
              2,
            )"
            :key="info.date.getTime()"
            class="hidden lg:block"
          >
            <div class="flex items-center">
              <a-badge
                class="float-left mr-2 flex items-center justify-center"
                :color="COLORS[index]"
              ></a-badge>
              <span class="float-left text-sm text-[var(--color-neutral-10)]"
                >{{ info.group }}{{ interviewType(info) }}</span
              >
            </div>
          </div>
          <div v-if="hasMoreThanTwoInfos(year, month, date)">
            <span class="hidden lg:block float-left text-blue-500 text-xs">{{
              remainingSchedules(year, month, date)
            }}</span>
          </div>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useRecruitmentStore from '@/store/modules/recruitment';
import dayjs from 'dayjs';

function formatDate(year: number, month: number, date: number) {
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDate = String(date).padStart(2, '0');
  return dayjs(`${year}-${formattedMonth}-${formattedDate}`).format(
    'YYYY-MM-DD',
  );
}

interface InterviewInfo {
  step: string;
  group: string;
  date: Date;
}

const recStore = useRecruitmentStore();

const props = defineProps<{
  infos: InterviewInfo[];
}>();

const { t } = useI18n();
const formatToday = inject('formatToday') as (date: Date) => string;
const emits = defineEmits(['dateClick']);
const COLORS = ['green', 'arcoblue'];

const curDate = ref<Date>();

watch(
  () => recStore.beginningDate,
  (newDate) => {
    if (newDate) {
      curDate.value = new Date(newDate);
    }
  },
  { immediate: true },
);

// 点击某个日期cell事件处理
const handleCellClick = (year: number, month: number, date: number) => {
  curDate.value = dayjs(formatDate(year, month, date)).toDate();
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

const remainingSchedules = (year: number, month: number, date: number) => {
  const count = filteredInfos(year, month, date).length - 2;
  return count > 0 ? t('common.result.remainingSchedules', { count }) : '';
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
      height: 97px;
    }
  }
}
</style>

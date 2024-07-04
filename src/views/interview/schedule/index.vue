<template>
  <a-scrollbar
    class="w-full h-full sm:pr-4 overflow-y-auto overflow-x-hidden"
    outer-class="w-full h-full"
  >
    <div class="lg:flex lg:flex-row lg:gap-5 lg:h-fit h-full flex-col">
      <calender
        :infos="overview"
        class="flex-4 border-[--color-border-4] max-lg:mb-4"
        @date-click="handleDateClick"
      ></calender>
      <schedules
        v-model="currentGroup"
        :infos="candidates"
        class="flex-1 h-1/2 lg:h-174"
      ></schedules>
    </div>
  </a-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { Group, recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import dayjs from 'dayjs';
import calender from './components/calendar.vue';
import schedules from './components/schedules.vue';

// 格式化日期
const formatToday = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

// ISO 8601日期
function parseDate(dateString: string) {
  return dayjs(dateString).toDate();
}

function formatDate(dateString: string) {
  return formatToday(parseDate(dateString));
}

function formatTime(date: Date) {
  return dayjs(date).format('HH:mm');
}

function Duration(start: Date, end: Date) {
  const timeRange = `${formatTime(start)}-${formatTime(end)}`;
  const diffInMinutes = dayjs(end).diff(dayjs(start), 'minute');
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  if (!hours) return `${timeRange}(${minutes}min)`;
  if (!minutes) return `${timeRange}(${hours}h)`;
  return `${timeRange}(${hours}h${minutes}min)`;
}

const props = defineProps({
  curStep: {
    type: Number,
    default: 0,
    required: true,
  },
});

provide('formatToday', formatToday);
const currentGroup = ref(Group.Web);
const selectedDate = ref<string>('2024-01-01');
const recStore = useRecruitmentStore();

// 监听calendar组件的dateClick事件，更新选中日期
const handleDateClick = (date: Date) => {
  selectedDate.value = formatToday(date);
};

// 本次招新面试日程overview
const appInInterview = computed(() =>
  recStore.curApplications.filter(({ step }) => {
    const isStep =
      recruitSteps[3].value.includes(step) ||
      recruitSteps[6].value.includes(step);
    return isStep;
  }),
);
const overview = computed(() => {
  return appInInterview.value.flatMap((app) => {
    const interviewDate =
      app.step === 'GroupInterview'
        ? parseDate(app.interview_allocations_group?.start ?? '')
        : parseDate(app.interview_allocations_team?.start ?? '');
    return {
      step: app.step,
      group: app.group ?? '',
      date: interviewDate,
    };
  });
});

// 筛选当天，该组，组面或群面选手
const filteredApps = computed(() =>
  recStore.curApplications.filter(
    ({
      step,
      group,
      interview_allocations_group,
      interview_allocations_team,
    }) => {
      const groupStartDate = interview_allocations_group?.start ?? '';
      const teamStartDate = interview_allocations_team?.start ?? '';
      const isStep =
        recruitSteps[3].value.includes(step) ||
        recruitSteps[6].value.includes(step);
      const isTime =
        step === 'GroupInterview'
          ? selectedDate.value === formatDate(groupStartDate)
          : selectedDate.value === formatDate(teamStartDate);
      const isGroup = group === currentGroup.value;
      return isStep && isGroup && isTime;
    },
  ),
);

const candidates = computed(() => {
  return filteredApps.value
    .flatMap((app) => {
      const groupEndDate = parseDate(
        app.interview_allocations_group?.end ?? '',
      );
      const groupStartDate = parseDate(
        app.interview_allocations_group?.start ?? '',
      );
      const groupInterviewPeriod = Duration(groupStartDate, groupEndDate);
      const teamEndDate = parseDate(app.interview_allocations_team?.end ?? '');
      const teamStartDate = parseDate(
        app.interview_allocations_team?.start ?? '',
      );
      const teamInterviewPeriod = Duration(teamStartDate, teamEndDate);
      const interviewPeriod =
        app.step === 'GroupInterview'
          ? groupInterviewPeriod
          : teamInterviewPeriod;

      return {
        name: app.user_detail?.name ?? '',
        step: app.step ?? recruitSteps[props.curStep].value[0],
        group: app.group ?? '',
        interviewPeriod,
        startDate:
          app.step === 'GroupInterview' ? groupStartDate : teamStartDate,
      };
    })
    .sort((a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix());
});
</script>

<style scoped lang="less"></style>

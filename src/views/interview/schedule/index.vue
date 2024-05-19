<template>
  <div
    class="lg:flex lg:flex-row lg:place-content-between lg:gap-5 flex-col h-206"
  >
    <calender
      :infos="overview"
      class="mb-4 flex-4 max-h-179"
      @date-click="handleDateClick"
    ></calender>
    <schedules
      v-model="currentGroup"
      :infos="candidates"
      class="flex-1 h-1/2 lg:h-183"
    ></schedules>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { Group, recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import calender from './components/calendar.vue';
import schedules from './components/schedules.vue';

// 格式化日期
const formatToday = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ISO 8601日期
function parseDate(dateString: string): Date {
  return new Date(dateString);
}

function formatDate(dateString: string) {
  return formatToday(parseDate(dateString));
}
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function calculateDuration(start: Date, end: Date): string {
  const diffInMs = end.getTime() - start.getTime();
  const diffInMinutes = Math.round(diffInMs / 1000 / 60);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  if (!hours) return `${minutes}min`;
  if (!minutes) return `${hours}h`;
  return `${hours}h${minutes}min`;
}

const props = defineProps({
  curStep: {
    type: Number,
    default: 0,
    required: true,
  },
});

provide('formatToday', formatToday);
provide('parseDate', parseDate);

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
  return filteredApps.value.flatMap((app) => {
    const groupEndDate = parseDate(app.interview_allocations_group?.end ?? '');
    const groupStartDate = parseDate(
      app.interview_allocations_group?.start ?? '',
    );
    const groupInterviewPeriod = `${formatTime(groupStartDate)}-${formatTime(
      groupEndDate,
    )} 
                                  (${calculateDuration(
                                    groupStartDate,
                                    groupEndDate,
                                  )})`;
    const teamEndDate = parseDate(app.interview_allocations_team?.end ?? '');
    const teamStartDate = parseDate(
      app.interview_allocations_team?.start ?? '',
    );
    const teamInterviewPeriod = `${formatTime(teamStartDate)}-${formatTime(
      teamEndDate,
    )} 
                                (${calculateDuration(
                                  teamStartDate,
                                  teamEndDate,
                                )})`;
    const interviewPeriod =
      app.step === 'GroupInterview'
        ? groupInterviewPeriod
        : teamInterviewPeriod;

    return {
      name: app.user_detail?.name ?? '',
      step: app.step ?? recruitSteps[props.curStep].value[0],
      group: app.group ?? '',
      interviewPeriod,
    };
  });
});
</script>

<style scoped lang="less"></style>

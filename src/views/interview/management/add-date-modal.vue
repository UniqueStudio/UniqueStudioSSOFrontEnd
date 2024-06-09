<template>
  <a-modal v-model:visible="visible" title-align="start" @ok="handleCreate">
    <template #title>
      <span class="font-semibold">{{
        $t('common.operation.arrangeSchedule')
      }}</span>
    </template>

    <div>
      <div class="font-semibold mb-2">{{
        $t('common.applyInfo.interviewName')
      }}</div>
      <div class="flex justify-between mb-6">
        <a-select
          v-model:model-value="currentGroup"
          :placeholder="$t('common.user.group')"
          class="w-5/12"
        >
          <a-option
            v-for="group in groupOptions"
            :key="group.label"
            :value="group.value"
          >
            {{ group.label }}
          </a-option>
        </a-select>
      </div>

      <div class="flex justify-between mb-2 sm:flex-row flex-col">
        <div class="sm:w-1/2 w-4/5 sm:mb-0 mb-4">
          <div class="font-semibold mb-2">
            {{ $t('common.date') }}<span class="text-blue-600">*</span>
          </div>
          <a-date-picker v-model="interviewDate" class="w-5/6" />
        </div>
        <div class="sm:w-1/2 w-4/5 pr-2">
          <div class="font-semibold mb-2">
            {{ $t('common.time') }}<span class="text-blue-600">*</span>
          </div>
          <a-time-picker
            v-model="interviewTime"
            type="time-range"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, defineModel } from 'vue';
import { Group, Period, PeriodDefineHour } from '@/constants/team';
import { createInterview } from '@/api';
import { CreateInterviewRequest } from '@/constants/httpMsg/interview/createInterviewMsg';
import useRecruitmentStore from '@/store/modules/recruitment';

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
  required: true,
});
const props = defineProps({
  currentGroupStart: {
    type: String,
    default: Group.Web,
    required: true,
  },
});

const currentGroup = ref(props.currentGroupStart as Group);
const interviewDate = ref('');
const interviewTime = ref([] as string[]);
const recStore = useRecruitmentStore();

const groupOptions = Object.keys(Group)
  .filter((x) => x !== 'Unique')
  .map((key) => ({
    value: Group[key as keyof typeof Group],
    label: key,
  }));

const calcPeriod = (time: Date): Period => {
  const hour = time.getHours();
  if (hour >= PeriodDefineHour.morning[0] && hour < PeriodDefineHour.morning[1])
    return Period.Morning;
  if (
    hour >= PeriodDefineHour.afternoon[0] &&
    hour < PeriodDefineHour.afternoon[1]
  )
    return Period.Afternoon;
  return Period.Evening;
};

const handleCreate = async () => {
  const [startTime, endTime] = interviewTime.value;

  // 创建日期和时间的ISO格式
  const startDate = new Date(`${interviewDate.value}T${startTime}`);
  const start = startDate.toISOString();
  const end = new Date(`${interviewDate.value}T${endTime}`).toISOString();

  const requestData: CreateInterviewRequest = [
    {
      date: new Date(interviewDate.value).toISOString(),
      period: calcPeriod(startDate),
      start,
      end,
    },
  ];

  let res;
  try {
    res = await createInterview(
      recStore.currentRid,
      currentGroup.value,
      requestData,
    );
    visible.value = false;
    return true;
  } catch (err) {
    return false;
  } finally {
    if (res) {
      recStore.refresh();
    }
  }
};
</script>

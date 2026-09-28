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

      <div class="flex gap-4 mb-6">
        <div class="flex-1">
          <div class="font-semibold mb-2">
            {{ $t('common.interview.duration') }}
          </div>
          <a-input-number v-model="duration" :min="1" />
        </div>
        <div class="flex-1">
          <div class="font-semibold mb-2">
            {{ $t('common.interview.rest') }}
          </div>
          <a-input-number v-model="rest" :min="0" />
        </div>
      </div>

      <div class="flex gap-4">
        <div class="w-3/12">
          <div class="font-semibold mb-2">
            {{ $t('common.date') }}<span class="text-blue-600">*</span>
          </div>
          <a-date-picker v-model="interviewDate" class="w-full" />
        </div>

        <div class="flex-1">
          <div class="font-semibold mb-2">
            {{ $t('common.timeAndSlotNumber')
            }}<span class="text-blue-600">*</span>
          </div>
          <div
            v-for="(_, index) in interviewTimes"
            :key="index"
            class="flex items-center mb-2 gap-2"
          >
            <a-time-picker
              v-model="interviewTimes[index]"
              type="time-range"
              format="HH:mm"
              class="flex-1"
              @change="(val: any) => handleTimeRangeChange(index, val)"
            />
            <a-input-number
              v-model="slotNumbers[index]"
              :min="1"
              :placeholder="$t('common.interview.slotNumber')"
              class="w-12 mx-2"
            />
            <a-button
              type="text"
              status="danger"
              @click="removeTimeRange(index)"
            >
              <template #icon><icon-delete /></template>
            </a-button>
            <a-button
              v-if="index === interviewTimes.length - 1"
              type="text"
              @click="addTimeRange"
            >
              <template #icon><icon-plus /></template>
            </a-button>
            <!-- 占位，保证对齐 -->
            <div v-else class="w-8"></div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from 'vue';
import { Group, Period, PeriodDefineHour } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';

const { t } = useI18n();

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
  required: true,
});
const props = defineProps({
  currentGroupStart: {
    type: String as PropType<Group>,
    required: false,
    default: Group.Web,
  },
  initialDate: {
    type: String,
    default: '',
  },
  initialTimeRange: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(['success']);

const currentGroup = ref<Group>(props.currentGroupStart);
const interviewDate = ref<string>('');
const interviewTimes = ref<string[][]>([[]]);
const slotNumbers = ref<number[]>([1]);
const duration = ref(30);
const rest = ref(10);
const recStore = useRecruitmentStore();

// 根据面试时长和休息时长，将一段总时间自动拆分为多个面试场次
function splitRange(
  startStr: string,
  endStr: string,
  dur: number,
  rst: number,
): string[][] {
  if (!startStr || !endStr) return [];
  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);
  const startMins = sh * 60 + (sm || 0);
  const endMins = eh * 60 + (em || 0);
  if (endMins <= startMins) return [[startStr, endStr]];

  const validDur = Math.max(dur, 5);
  const validRest = Math.max(rst, 0);

  // 如果跨度不超过单场时长，则无需划分
  if (endMins - startMins <= validDur) {
    return [[startStr, endStr]];
  }

  const result: string[][] = [];
  let cur = startMins;
  while (cur + validDur <= endMins) {
    const sH = String(Math.floor(cur / 60)).padStart(2, '0');
    const sM = String(cur % 60).padStart(2, '0');
    const e = cur + validDur;
    const eH = String(Math.floor(e / 60)).padStart(2, '0');
    const eM = String(e % 60).padStart(2, '0');
    result.push([`${sH}:${sM}`, `${eH}:${eM}`]);
    cur = e + validRest;
  }
  return result.length > 0 ? result : [[startStr, endStr]];
}

watch(
  () => visible.value,
  (val) => {
    if (val) {
      currentGroup.value = props.currentGroupStart;
      interviewDate.value = props.initialDate || '';
      if (
        props.initialTimeRange &&
        props.initialTimeRange.length === 2 &&
        props.initialTimeRange[0] &&
        props.initialTimeRange[1]
      ) {
        const slots = splitRange(
          props.initialTimeRange[0],
          props.initialTimeRange[1],
          duration.value,
          rest.value,
        );
        interviewTimes.value =
          slots.length > 0 ? slots : [props.initialTimeRange];
        slotNumbers.value = Array(interviewTimes.value.length).fill(1);
      } else {
        interviewTimes.value = [[]];
        slotNumbers.value = [1];
      }
    }
  },
  { immediate: true },
);

// 当用户在时间选择器中选中一个较长时间跨度时，自动按休息时间和时长划分为多个场次
const handleTimeRangeChange = (index: number, val: any) => {
  if (!val || val.length < 2 || !val[0] || !val[1]) return;
  const [startStr, endStr] = val;
  const slots = splitRange(startStr, endStr, duration.value, rest.value);
  if (slots.length > 1) {
    const currentSlotNum = slotNumbers.value[index] || 1;
    interviewTimes.value.splice(index, 1, ...slots);
    const newSlots = Array(slots.length).fill(currentSlotNum);
    slotNumbers.value.splice(index, 1, ...newSlots);
    Message.info(
      `已按面试时长(${duration.value}分钟)和休息(${rest.value}分钟)自动划分为 ${slots.length} 个场次`,
    );
  }
};

const addTimeRange = () => {
  const lastRange = interviewTimes.value[interviewTimes.value.length - 1];
  if (lastRange && lastRange[1]) {
    const [h, m, s] = lastRange[1].split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, s || 0);

    const nextStart = new Date(date.getTime() + rest.value * 60000);
    const nextEnd = new Date(nextStart.getTime() + duration.value * 60000);

    const format = (d: Date) =>
      `${String(d.getHours()).padStart(2, '0')}:${String(
        d.getMinutes(),
      ).padStart(2, '0')}`;

    interviewTimes.value.push([format(nextStart), format(nextEnd)]);
  } else {
    interviewTimes.value.push([]);
  }
  const lastSlotNumber = slotNumbers.value[slotNumbers.value.length - 1] || 1;
  slotNumbers.value.push(lastSlotNumber);
};

const removeTimeRange = (index: number) => {
  if (interviewTimes.value.length > 1) {
    interviewTimes.value.splice(index, 1);
    slotNumbers.value.splice(index, 1);
  } else {
    interviewTimes.value = [[]];
    slotNumbers.value = [1];
  }
};

const groupOptions = Object.entries(Group).map(([label, value]) => ({
  label,
  value,
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
  if (
    !interviewDate.value ||
    interviewTimes.value.some(
      (time) => !time || time.length < 2 || !time[0] || !time[1],
    )
  ) {
    Message.warning(t('common.interview.error.incompleteInfo'));
    return;
  }

  // 提交时保底进行自动拆分，确保所有时间段均按休息时间和时长划分为多个独立场次
  const expandedList = interviewTimes.value.flatMap((time, i) => {
    const slots = splitRange(time[0], time[1], duration.value, rest.value);
    const slotNum = slotNumbers.value[i] || 1;
    return slots.map((s) => ({
      start: s[0],
      end: s[1],
      slotNumber: slotNum,
    }));
  });

  const interviews = expandedList.map(
    ({ start: startTime, end: endTime, slotNumber }) => {
      const startDate = new Date(`${interviewDate.value}T${startTime}`);
      const start = startDate.toISOString();
      const end = new Date(`${interviewDate.value}T${endTime}`).toISOString();
      return {
        date: new Date(interviewDate.value).toISOString(),
        period: calcPeriod(startDate),
        start,
        end,
        slot_number: slotNumber,
      };
    },
  );

  visible.value = false;
  const res = await recStore.createInterview(currentGroup.value, interviews);
  if (res) {
    recStore.refresh();
    Message.success(t('common.result.addInterviewSuccess'));
    emit('success');
  }
};
</script>

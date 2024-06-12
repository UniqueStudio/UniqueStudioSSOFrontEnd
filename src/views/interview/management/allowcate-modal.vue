<template>
  <a-modal
    v-model:visible="showAllowcate"
    :title="$t('common.operation.allocateInterviewTime')"
    :width="widthType === 'sm' ? '90%' : ''"
    @before-ok="handleBeforeOk"
  >
    <a-form
      :model="form"
      :layout="widthType === 'sm' ? 'vertical' : 'horizontal'"
    >
      <a-form-item
        field="seletedTime"
        :label="$t('common.operation.candidateSeletedTime')"
      >
        <a-space wrap>
          <a-tag
            v-for="(time, index) in displayData.selectedTime"
            :key="index"
            color="arcoblue"
          >
            {{ time }}
          </a-tag>
        </a-space>
      </a-form-item>
      <a-form-item
        field="seleteInterviewId"
        :label="$t('common.operation.allocateTime')"
      >
        <a-cascader
          v-model="form.selectInterviewId"
          :options="displayData.timeOptions"
          expand-trigger="hover"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, defineModel, computed } from 'vue';
import { allocateApplicationInterview } from '@/api/application';
import { CascaderOption, Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import useRecruitmentStore from '@/store/modules/recruitment';
import { getDate, getTime } from '@/views/interview/management/getData';
import useWindowResize from '@/hooks/resize';

const { t } = useI18n();
const { widthType } = useWindowResize();

const props = defineProps({
  applicationId: {
    type: String,
    default: '',
    required: true,
  },
  interviewType: {
    type: String,
    default: 'group',
    required: true,
  },
});

const showAllowcate = defineModel<boolean>('showAllowcate', {
  type: Boolean,
  default: false,
  required: true,
});

const form = ref<{
  selectInterviewId: string;
}>({ selectInterviewId: '' });
const recStore = useRecruitmentStore();

const getTimeOptions = () => {
  // 面试分类 date->period->time
  const optionsData = {} as {
    [key: string]: { [key: string]: { time: string; interviewId: string }[] };
  };
  recStore.curInterviews.forEach((interview) => {
    if (interview.start && interview.period) {
      const date = getDate(interview.start);
      const time = getTime(interview.start, interview.end);
      if (optionsData[date] && optionsData[date][interview.period]) {
        optionsData[date][interview.period].push({
          time,
          interviewId: interview.uid,
        });
      } else if (optionsData[date]) {
        optionsData[date][interview.period] = [
          { time, interviewId: interview.uid },
        ];
      } else {
        optionsData[date] = {
          [interview.period]: [{ time, interviewId: interview.uid }],
        };
      }
    }
  });

  // 数据格式转换 change the data in optionsData to timeOptions
  const timeOptionsTmp: CascaderOption[] = [];
  Object.entries(optionsData).forEach(([date, valueThisDate]) => {
    const DateChildren = [] as CascaderOption[];
    Object.entries(valueThisDate).forEach(([period, valueThisPeriod]) => {
      const periodChildren = [] as CascaderOption[];
      valueThisPeriod.forEach(({ time, interviewId }) => {
        periodChildren.push({
          label: time,
          value: interviewId,
        });
      });
      DateChildren.push({
        label: t(`common.period.${period}`),
        value: t(`common.period.${period}`),
        children: periodChildren,
      });
    });
    timeOptionsTmp.push({
      label: date,
      value: date,
      children: DateChildren,
    });
  });

  return timeOptionsTmp;
};

const displayData = computed(() => {
  const index =
    recStore.curApplications.findIndex(
      ({ uid }) => uid === props.applicationId,
    ) ?? -1;
  let timeOptions: CascaderOption[] = [];
  let selectedTime: string[] = [];
  timeOptions = getTimeOptions();
  selectedTime =
    recStore.curApplications[index]?.interview_selections?.map(
      (interview) =>
        `${getDate(interview.start)} ${getTime(
          interview.start,
          interview.end,
        )}`,
    ) ?? [];
  return { timeOptions, selectedTime };
});

const handleBeforeOk = () => {
  allocateApplicationInterview(
    props.applicationId,
    props.interviewType as 'group' | 'team',
    { interview_id: form.value.selectInterviewId },
  ).then(() => {
    recStore.refresh();
    Message.success(t('common.operation.allocateInterviewSuccess'));
  });
  return true;
};
</script>

<template>
  <a-modal
    v-model:visible="showAllowcate"
    :title="$t('common.operation.allocateInterviewTime')"
    :width="isMobile ? '90%' : ''"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <a-form :model="form" :layout="isMobile ? 'vertical' : 'horizontal'">
      <a-form-item
        field="seletedTime"
        :label="$t('common.operation.candidateSeletedTime')"
      >
        <a-space wrap>
          <a-tag
            v-for="(time, index) in selectedInterview"
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
          :options="timeOptions"
          expand-trigger="hover"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, watch, ref, defineModel } from 'vue';
import { allocateApplicationInterview } from '@/api/application';
import { CascaderOption } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import useRecruitmentStore from '@/store/modules/recruitment';
import { Interview } from '@/constants/httpMsg/interview/getInterviewMsg';
import { Application } from '@/constants/httpMsg/application/getApplicationMsg';
import { getDate, getTime } from '@/views/interview/management/getData';

const { t } = useI18n();

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
  isMobile: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const showAllowcate = defineModel<boolean>('showAllowcate', {
  type: Boolean,
  default: false,
  required: true,
});

const form = ref({ selectInterviewId: '' as string });
const recStore = useRecruitmentStore();

const timeOptions = ref([] as CascaderOption[]);
const getTimeOptions = async () => {
  if (!recStore.currentRec || !recStore.currentRec.interviews) return;

  const interviewArr = recStore.currentRec.interviews;

  // 面试分类 date->period->time
  const optionsData = {} as {
    [key: string]: { [key: string]: { time: string; interviewId: string }[] };
  };
  interviewArr.forEach((interview) => {
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
    timeOptions.value.push({
      label: date,
      value: date,
      children: DateChildren,
    });
  });

  // console.log('%c [ timeOptions ]-93', 'font-size:13px; background:#d93d60; color:#ff81a4;', timeOptions);
};

const getApplicationIndex = async (): Promise<number> => {
  if (!recStore.currentRec || !recStore.currentRec.applications) return -1;
  return recStore.currentRec.applications.findIndex(
    (application) => application.uid === props.applicationId,
  );
};

const selectedInterview = ref([] as string[]);
const getSelectedTime = async (applicationIndex: number) => {
  // console.log('%c [ recStore.currentRec ]-166', 'font-size:13px; background:#84bab3; color:#c8fef7;', recStore.currentRec);
  if (
    !recStore.currentRec ||
    !(recStore.currentRec.applications as Application[])[applicationIndex]
      .interview_selections
  )
    selectedInterview.value = [];
  else {
    selectedInterview.value = (
      (recStore.currentRec.applications as Application[])[applicationIndex]
        .interview_selections as Interview[]
    ).map(
      (interview) =>
        `${getDate(interview.start)} ${getTime(
          interview.start,
          interview.end,
        )}`,
    );
  }
};

watch(showAllowcate, async (newShowAllowcate) => {
  if (newShowAllowcate) {
    await recStore.refresh();
    const index = await getApplicationIndex();
    if (index === -1) {
      showAllowcate.value = false;
    } else {
      timeOptions.value = [];
      await getTimeOptions();
      await getSelectedTime(index);
    }
  }
});

const handleCancel = () => {
  showAllowcate.value = false;
};

const submitSelectInterviewTime = async (selectInterviewId: string) => {
  // console.log('%c [ selectInterviewId ]-185', 'font-size:13px; background:#e28e6b; color:#ffd2af;', selectInterviewId);
  allocateApplicationInterview(
    props.applicationId,
    props.interviewType as 'group' | 'team',
    { interview_id: selectInterviewId },
  );
  // TODO: 提交后刷新数据
};

const handleBeforeOk = async () => {
  // console.log(form);
  submitSelectInterviewTime(form.value.selectInterviewId);
  return true;
};
</script>

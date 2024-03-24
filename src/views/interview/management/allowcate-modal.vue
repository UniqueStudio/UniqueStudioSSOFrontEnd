<template>
  <a-modal
    v-model:visible="showAllowcate"
    :title="$t('common.operation.allocateInterviewTime')"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <a-form :model="form">
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
import { getRecruitment } from '@/api/recruitment';
import { allocateApplicationInterview } from '@/api/application';
import { CascaderOption } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import { RecruitmentResponse } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import { Interview } from '@/constants/httpMsg/interview/getInterviewMsg';
import { Application } from '@/constants/httpMsg/application/getApplicationMsg';

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
});

const showAllowcate = defineModel<boolean>('showAllowcate', {
  type: Boolean,
  default: false,
  required: true,
});

const form = ref({ selectInterviewId: '' as string });
let totalData = {} as RecruitmentResponse;

const dataEndIndex = 10;
const getDate = (time: string): string => {
  return time.substring(0, dataEndIndex);
};
const getTime = (startStr: string, endStr: string): string => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  return `${start.getHours().toString().padStart(2, '0')}:${start
    .getMinutes()
    .toString()
    .padStart(2, '0')}-${end.getHours().toString().padStart(2, '0')}:${end
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

const timeOptions = ref([] as CascaderOption[]);
const getTimeOptions = async () => {
  if (!totalData.data.interviews) return;

  // 有效面试筛选
  const usefulInterview = totalData.data.interviews.filter(
    (interview) => interview.slot_number > interview.select_number,
  );

  // 面试分类 date->period->time
  const optionsData = {} as {
    [key: string]: { [key: string]: { time: string; interviewId: string }[] };
  };
  usefulInterview.forEach((interview) => {
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
  if (!totalData.data.applications) return -1;
  return totalData.data.applications.findIndex(
    (application) => application.uid === props.applicationId,
  );
};

const selectedInterview = ref([] as string[]);
const getSelectedTime = async (applicationIndex: number) => {
  if (
    !(totalData.data.applications as Application[])[applicationIndex]
      .interview_selections
  )
    selectedInterview.value = [];
  else {
    selectedInterview.value = (
      (totalData.data.applications as Application[])[applicationIndex]
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

watch(showAllowcate, async (newVal) => {
  if (newVal) {
    const nowRid = 'ba10675e-22ae-4335-83c8-8e84a4a6855b'; // 调试
    // TODO: 获取最新id (await getLatestRecruitment()).data.uid;
    totalData = await getRecruitment(nowRid);
    Object.freeze(totalData);
    const index = await getApplicationIndex();
    if (index === -1) {
      showAllowcate.value = false;
    } else {
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

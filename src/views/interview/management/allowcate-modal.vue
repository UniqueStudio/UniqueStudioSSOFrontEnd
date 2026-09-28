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
            v-for="(time, index) in selectedTime"
            :key="index"
            :color="
              isOverlappingWithAny(
                new Date(time.start),
                new Date(time.end),
                mergedTimeRanges,
              )
                ? 'red'
                : 'arcoblue'
            "
            @click="
              () => {
                form.selectInterviewId =
                  optionsData[time.date]?.[time.period].find(
                    (v) => v.time === time.time,
                  )?.interviewId ?? '';
              }
            "
          >
            {{ time.formatedTime }}
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
import { ref, computed, PropType } from 'vue';
import { allocateApplicationInterview } from '@/api/application';
import { CascaderOption, Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import useRecruitmentStore from '@/store/modules/recruitment';
import useWindowResize from '@/hooks/resize';
import dayjs from 'dayjs';
import { Group } from '@/constants/team';
import { Application } from '@/constants/httpMsg/application/getApplicationMsg';
import { isOverlappingWithAny, timeRangesType } from '@/utils/isOverlapping';

const { t } = useI18n();
const { widthType } = useWindowResize();

const props = defineProps({
  applicationId: {
    type: String,
    required: false,
    default: '',
  },
  interviewType: {
    type: String,
    required: false,
    default: 'group',
  },
  currentGroup: {
    type: String as PropType<Group>,
    required: false,
    default: Group.Web,
  },
  filteredApps: {
    type: Array as PropType<Application[]>,
    required: false,
    default: () => [],
  },
  mergedTimeRanges: {
    type: Array as PropType<timeRangesType[]>,
    required: false,
    default: () => [],
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

const filteredInterviews = computed(() =>
  props.interviewType === 'group'
    ? recStore.curInterviews.filter((item) => item.name === props.currentGroup)
    : recStore.curInterviews.filter((item) => item.name === 'unique'),
);

const optionsData = computed(() => {
  // 面试分类 date->period->time
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const optionsData = {} as {
    [key: string]: { [key: string]: { time: string; interviewId: string }[] };
  };

  filteredInterviews.value.forEach((interview) => {
    if (interview.start && interview.period) {
      const date = dayjs(interview.start).format('YYYY-MM-DD');
      const time = `${dayjs(interview.start).format('HH:mm')}
        - ${dayjs(interview.end).format('HH:mm')}`;
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
  return optionsData;
});

const timeOptions = computed(() => {
  // 数据格式转换 change the data in optionsData to timeOptions
  const timeOptionsTmp: CascaderOption[] = [];
  Object.entries(optionsData.value).forEach(([date, valueThisDate]) => {
    const DateChildren = [] as CascaderOption[];
    Object.entries(valueThisDate).forEach(([period, valueThisPeriod]) => {
      const periodChildren = [] as CascaderOption[];
      valueThisPeriod.forEach(({ time, interviewId }) => {
        const interview = filteredInterviews.value.find(
          (i) => i.uid === interviewId,
        );
        const maxSlot = interview?.slot_number;
        const isTeam = props.interviewType === 'team';
        const assignedCount = recStore.curApplications.filter((app) => {
          const allo = isTeam
            ? app.interview_allocations_team
            : app.interview_allocations_group;
          return allo?.uid === interviewId;
        }).length;

        const curApp = recStore.curApplications.find(
          (a) => a.uid === props.applicationId,
        );
        const currentAllo = isTeam
          ? curApp?.interview_allocations_team
          : curApp?.interview_allocations_group;
        const isSelfAssigned = currentAllo?.uid === interviewId;

        const isFull =
          maxSlot !== undefined &&
          maxSlot !== null &&
          assignedCount >= maxSlot &&
          !isSelfAssigned;

        let labelText = time;
        if (maxSlot !== undefined && maxSlot !== null) {
          labelText = `${time} (${assignedCount}/${maxSlot}人${
            isFull ? ' - 已满' : ''
          })`;
        }

        periodChildren.push({
          label: labelText,
          value: interviewId,
          disabled: isFull,
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
});

const selectedTime = computed(() => {
  const nowApplication = recStore.curApplications.find(
    ({ uid }) => uid === props.applicationId,
  );
  return (
    nowApplication?.interview_selections
      ?.map((interview) => ({
        formatedTime: `${dayjs(interview.start).format('YYYY-MM-DD')} ${dayjs(
          interview.start,
        ).format('HH:mm')}-${dayjs(interview.end).format('HH:mm')}`,
        date: dayjs(interview.start).format('YYYY-MM-DD'),
        time: `${dayjs(interview.start).format('HH:mm')}
        - ${dayjs(interview.end).format('HH:mm')}`,
        period: interview.period,
        start: interview.start,
        end: interview.end,
      }))
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      ) ?? []
  );
});

const handleBeforeOk = async () => {
  if (!form.value.selectInterviewId) {
    Message.warning(
      t('common.operation.allocateTimeRequired') || '请选择面试场次',
    );
    return false;
  }

  // 校验所选场次是否已达最大人数
  const targetInterview = filteredInterviews.value.find(
    (i) => i.uid === form.value.selectInterviewId,
  );
  if (
    targetInterview &&
    targetInterview.slot_number !== undefined &&
    targetInterview.slot_number !== null
  ) {
    const isTeam = props.interviewType === 'team';
    const assignedCount = recStore.curApplications.filter((app) => {
      if (app.uid === props.applicationId) return false;
      const allo = isTeam
        ? app.interview_allocations_team
        : app.interview_allocations_group;
      return allo?.uid === targetInterview.uid;
    }).length;

    if (assignedCount >= targetInterview.slot_number) {
      Message.warning('选择人数不能超过最大人数，该场次已满');
      return false;
    }
  }

  const res = await allocateApplicationInterview(
    props.applicationId,
    props.interviewType as 'group' | 'team',
    { interview_id: form.value.selectInterviewId },
  );
  if (!res) return false;
  recStore.refresh();
  Message.success(t('common.result.allowcateTimeSuccess'));
  return true;
};
</script>

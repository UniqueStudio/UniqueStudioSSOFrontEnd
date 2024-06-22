<template>
  <div id="rectChart" class="h-48"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useRecruitmentStore from '@/store/modules/recruitment';
import { Step } from '@/constants/team';
import { watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const recStore = useRecruitmentStore();

const props = defineProps({
  curGroup: {
    type: String,
    default: 'PM',
    required: true,
  },
});

const getStepCounts = (...steps: string[]) => {
  return recStore.curApplications.filter(({ group, step }) => {
    return group === props.curGroup.toLowerCase() && steps.includes(step);
  }).length;
};
onMounted(() => {
  watch(
    () => props.curGroup,
    () => {
      const myChart = echarts.init(document.getElementById('rectChart'));
      const option = {
        xAxis: {
          show: false,
        },
        yAxis: {
          data: [''],
          show: false,
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          data: [
            t('common.steps.SignUp'),
            t('common.steps.WrittenTest'),
            t('common.steps.GroupInterview'),
            t('common.steps.StressTest'),
            t('common.steps.TeamInterview'),
            t('common.steps.Pass'),
          ],
          bottom: 10,
          itemGap: 10,
          textStyle: {
            fontSize: 16,
            color: '#a9aeb8',
          },
        },
        series: [
          {
            data: [getStepCounts(Step.SignUp)],
            type: 'bar',
            name: t('common.steps.SignUp'),
            stack: 'x',
            barWidth: 40,
            itemStyle: {
              borderRadius: [10, 10, 10, 10],
              borderColor: '#fff',
              borderWidth: 5,
            },
          },
          {
            data: [getStepCounts(Step.WrittenTest)],
            type: 'bar',
            name: t('common.steps.WrittenTest'),
            stack: 'x',
            itemStyle: {
              borderRadius: [10, 10, 10, 10],
              borderColor: '#fff',
              borderWidth: 5,
            },
          },
          {
            data: [
              getStepCounts(
                Step.GroupInterview,
                Step.GroupTimeSelection,
                Step.OnlineGroupInterview,
              ),
            ],
            type: 'bar',
            name: t('common.steps.GroupInterview'),
            stack: 'x',
            itemStyle: {
              borderRadius: [10, 10, 10, 10],
              borderColor: '#fff',
              borderWidth: 5,
            },
          },
          {
            data: [getStepCounts(Step.StressTest)],
            type: 'bar',
            name: t('common.steps.StressTest'),
            stack: 'x',
            itemStyle: {
              borderRadius: [10, 10, 10, 10],
              borderColor: '#fff',
              borderWidth: 5,
            },
          },
          {
            data: [
              getStepCounts(
                Step.TeamInterview,
                Step.TeamTimeSelection,
                Step.OnlineTeamInterview,
              ),
            ],
            type: 'bar',
            name: t('common.steps.TeamInterview'),
            stack: 'x',
            itemStyle: {
              borderRadius: [10, 10, 10, 10],
              borderColor: '#fff',
              borderWidth: 5,
            },
          },
          {
            data: [getStepCounts(Step.Pass)],
            type: 'bar',
            name: t('common.steps.Pass'),
            stack: 'x',
            itemStyle: {
              borderRadius: [10, 10, 10, 10],
              borderColor: '#fff',
              borderWidth: 5,
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    { immediate: true },
  );
});
</script>

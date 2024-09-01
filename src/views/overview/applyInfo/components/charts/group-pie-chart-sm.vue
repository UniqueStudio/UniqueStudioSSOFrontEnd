<template>
  <div class="w-full">
    <div id="group-pie-chart1" ref="groupChartRef1" class="h-80"></div>
  </div>
</template>

<script setup lang="ts">
import useRecruitmentStore from '@/store/modules/recruitment';
import * as echarts from 'echarts';
import { onMounted, computed, ref, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { GroupDetails } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import { groupMapping } from '@/constants/team';

const { t } = useI18n();

const props = defineProps({
  counts: {
    type: Number,
    required: true,
  },
});

const recStore = useRecruitmentStore();

const groupChartRef1 = ref(null);
let myChart: echarts.ECharts | null = null;

const resizeChart = () => {
  myChart?.resize();
};

const recruitmentData = computed(() => recStore.currentRec);

const allGroupMemberCounts = computed(() => {
  return Object.values(recruitmentData.value?.group_details as any[]).reduce(
    (sum, val) => sum + val,
    0,
  );
});

const groupMemberCounts = computed(() => {
  return (targetGroup: string) => {
    // 在group_details加上可选链后仍报错：对象可能为“未定义”，暂无法解决
    return recruitmentData.value?.group_details
      ? // @ts-ignore
        recruitmentData.value.group_details[targetGroup as keyof GroupDetails] /
          allGroupMemberCounts.value
      : 0;
  };
});

const createDataObject = (group: string, name: string) => {
  return {
    value: groupMemberCounts.value(group),
    name,
  };
};

const option = computed(() => {
  return {
    title: {
      text: t('common.applyInfo.groupMembers'),
      left: 'center',
      top: 'center',
      fontSize: '12px',
      textStyle: {
        color: '#a9aeb8',
      },
    },
    tooltip: {
      formatter: '{b} : {d}%',
    },
    series: [
      {
        type: 'pie',
        data: Object.entries(groupMapping).map(([name, group]) =>
          createDataObject(group, name),
        ),
        label: {
          show: true,
          formatter(params: any) {
            return params.value === 0 ? '' : params.name;
          },
        },
        radius: ['90%', '70%'],
      },
    ],
  };
});

const initChart = () => {
  resizeChart();
  if (props.counts > 0) myChart?.setOption(option.value);
};

watch(
  () => [option.value],
  () => {
    initChart();
  },
  { deep: true },
);

onMounted(() => {
  myChart = echarts.init(groupChartRef1.value);
  if (!myChart.getOption()) initChart();
});

window.addEventListener('resize', resizeChart);

onUnmounted(() => {
  myChart?.dispose();
  window.removeEventListener('resize', resizeChart);
});
</script>

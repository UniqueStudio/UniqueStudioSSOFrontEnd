<template>
  <div id="pie-chart" ref="chartRef1" class="h-80"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useRecruitmentStore from '@/store/modules/recruitment';
import { groupMapping } from '@/constants/team';
import { onMounted, ref, onUnmounted, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const recStore = useRecruitmentStore();

const chartRef1 = ref(null);
let myChart: echarts.ECharts | null = null;

onMounted(() => {
  myChart = echarts.init(chartRef1.value);
});

const resizeChart = () => {
  myChart?.resize();
};

const fetchData = async () => {
  const recruitmentData = await recStore.getRecruitment(recStore.currentRid);
  const allApplicationCounts = recruitmentData.applications?.length;

  const applicationCounts = (targetGroup: string) => {
    return recruitmentData.applications
      ? recruitmentData.applications.filter(({ group }) => {
          return group === targetGroup;
        }).length / allApplicationCounts!
      : 0;
  };

  const createDataObject = (group: string, name: string) => {
    return {
      value: applicationCounts(group),
      name,
    };
  };

  const initChart = () => {
    const option = {
      tooltip: {
        formatter: '{b} : {d}%',
      },
      title: {
        text: t('common.applyInfo.candidates'),
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#a9aeb8',
        },
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
    myChart?.setOption(option);
  };

  initChart();
};

const stop = watchEffect(() => fetchData());
window.addEventListener('resize', resizeChart);

onUnmounted(() => {
  myChart?.dispose();
  stop();
  window.removeEventListener('resize', resizeChart);
});
</script>

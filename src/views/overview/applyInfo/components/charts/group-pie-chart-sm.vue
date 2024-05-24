<template>
  <div class="w-full">
    <div id="group-pie-chart1" class="h-80"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

onMounted(() => {
  const myChart = echarts.init(document.getElementById('group-pie-chart1'));
  myChart.setOption({
    title: {
      text: t('common.applyInfo.groupMembers'),
      left: 'center',
      top: 'center',
      fontSize: '12px',
    },
    tooltip: {
      formatter: '{b} : {d}%',
    },
    series: [
      {
        type: 'pie',
        data: [
          {
            value: 0,
            name: 'PM',
          },
          {
            value: 0,
            name: 'Design',
          },
          {
            value: 0,
            name: 'AI',
          },
          {
            value: 0,
            name: 'Android',
          },
          {
            value: 0,
            name: 'Web',
          },
          {
            value: 0,
            name: 'IOS',
          },
          {
            value: 0,
            name: 'Lab',
          },
          {
            value: 0,
            name: 'Game',
          },
        ],
        label: {
          show: true,
          formatter(params: any) {
            return params.value === 0 ? '' : params.name;
          },
        },
        radius: ['90%', '70%'],
      },
    ],
  });
  window.addEventListener('resize', () => {
    myChart.resize();
  });
});
</script>

<template>
  <div class="w-full">
    <div id="group-pie-chart" class="h-80 w-96"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

setTimeout(() => {
  const myChart = echarts.init(document.getElementById('group-pie-chart'));
  myChart.setOption({
    title: {
      text: t('common.applyInfo.groupMembers'),
      left: 'center',
      top: 'center',
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
}, 0);
</script>

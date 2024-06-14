<template>
  <div id="pie-chart" class="h-80"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useRecruitmentStore from '@/store/modules/recruitment';
import { Group } from '@/constants/team';
import { onMounted, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

onMounted(() => {
  const recStore = useRecruitmentStore();

  watchEffect(() => {
    const myChart = echarts.init(document.getElementById('pie-chart'));
    const allApplicationCounts = recStore.curApplications.length;

    const groupMapping = {
      PM: Group.Pm,
      Design: Group.Design,
      AI: Group.Ai,
      Android: Group.Android,
      Web: Group.Web,
      IOS: Group.Ios,
      Lab: Group.Lab,
      Game: Group.Game,
    };

    const applicationCounts = (targetGroup: string) => {
      return (
        recStore.curApplications.filter(({ group }) => {
          return group === targetGroup;
        }).length / allApplicationCounts
      );
    };

    const createDataObject = (group: string, name: string) => {
      return {
        value: applicationCounts(group),
        name,
      };
    };

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
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  });
});
</script>

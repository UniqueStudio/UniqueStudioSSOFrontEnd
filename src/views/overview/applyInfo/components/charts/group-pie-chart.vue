<template>
  <div class="w-full">
    <div id="group-pie-chart" class="h-80"></div>
  </div>
</template>

<script setup lang="ts">
import { Group } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import * as echarts from 'echarts';
import { watchEffect, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

onMounted(async () => {
  const recStore = useRecruitmentStore();

  watchEffect(async () => {
    const myChart = echarts.init(document.getElementById('group-pie-chart'));
    const recruitmentData = await recStore.getLatestRecruitment();

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

    // @ts-ignore
    const allGroupMemberCounts: number = computed(() => {
      return Object.values(recruitmentData.group_details as any[]).reduce(
        (sum, val) => sum + val,
        0,
      );
    });

    const groupMemberCounts = (targetGroup: string) => {
      // @ts-ignore
      return (
        recruitmentData.group_details[targetGroup] / allGroupMemberCounts.value
      );
    };

    const createDataObject = (group: string, name: string) => {
      return {
        value: groupMemberCounts(group),
        name,
      };
    };
    const option = {
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
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  });
});
</script>

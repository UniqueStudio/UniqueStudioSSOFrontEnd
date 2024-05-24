<template>
  <div id="pieChart1" class="h-80"></div>
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
    const myChart = echarts.init(document.getElementById('pieChart1'));
    const allGroupMemberCounts = recStore.curApplications.length;
    const groupMemberCounts = (targetGroup: string) => {
      return (
        recStore.curApplications.filter(({ group }) => {
          return group === targetGroup;
        }).length / allGroupMemberCounts
      );
    };
    const option = {
      tooltip: {
        formatter: '{b} : {d}%',
      },
      title: {
        text: t('common.applyInfo.candidates'),
        left: 'center',
        top: 'center',
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              value: groupMemberCounts(Group.Pm),
              name: 'PM',
            },
            {
              value: groupMemberCounts(Group.Design),
              name: 'Design',
            },
            {
              value: groupMemberCounts(Group.Ai),
              name: 'AI',
            },
            {
              value: groupMemberCounts(Group.Android),
              name: 'Android',
            },
            {
              value: groupMemberCounts(Group.Web),
              name: 'Web',
            },
            {
              value: groupMemberCounts(Group.Ios),
              name: 'IOS',
            },
            {
              value: groupMemberCounts(Group.Lab),
              name: 'Lab',
            },
            {
              value: groupMemberCounts(Group.Game),
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
    };
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  });
});
</script>

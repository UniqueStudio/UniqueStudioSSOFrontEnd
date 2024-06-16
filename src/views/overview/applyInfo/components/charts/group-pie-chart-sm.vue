<template>
  <div class="w-full">
    <div id="group-pie-chart1" ref="groupChartRef1" class="h-80"></div>
  </div>
</template>

<script setup lang="ts">
import useRecruitmentStore from '@/store/modules/recruitment';
import * as echarts from 'echarts';
import { onMounted, computed, ref, onUnmounted, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import type { GroupDetails } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import { groupMapping } from '@/constants/team';

const { t } = useI18n();
const recStore = useRecruitmentStore();

const groupChartRef1 = ref(null);
let myChart: echarts.ECharts | null = null;

onMounted(() => {
  myChart = echarts.init(groupChartRef1.value);
});

const resizeChart = () => {
  myChart?.resize();
};

const fetchData = async () => {
  const recruitmentData = await recStore.getRecruitment(recStore.currentRid);

  const allGroupMemberCounts = computed(() => {
    return Object.values(recruitmentData.group_details as any[]).reduce(
      (sum, val) => sum + val,
      0,
    );
  });

  const groupMemberCounts = (targetGroup: string) => {
    // 在group_details加上可选链后仍报错：对象可能为“未定义”，暂无法解决
    return recruitmentData.group_details
      ? // @ts-ignore
        recruitmentData.group_details[targetGroup as keyof GroupDetails] /
          allGroupMemberCounts.value
      : 0;
  };

  const createDataObject = (group: string, name: string) => {
    return {
      value: groupMemberCounts(group),
      name,
    };
  };

  const initChart = () => {
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
    myChart?.setOption(option);
  };

  initChart();
};

const stop = watchEffect(() => {
  fetchData();
});

window.addEventListener('resize', resizeChart);

onUnmounted(() => {
  myChart?.dispose();
  stop();
  window.removeEventListener('resize', resizeChart);
});
</script>

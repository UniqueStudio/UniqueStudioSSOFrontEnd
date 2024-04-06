<template>
  <div class="flex place-content-between gap-5">
    <calender @date-click="handleDateClick"></calender>
    <schedules :filtered-items="filteredItems"></schedules>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import calender from './components/calendar.vue';
import schedules from './components/schedules.vue';

const selectedDate = ref<string>('2024-01-01');
const schedulesEg = [
  {
    date: new Date('2024-01-01'),
    name: 'PM组面',
    time: '13.00-14.00（1h）',
    location: '809',
    player: '苦瓜',
    description: '可以调时间',
  },
  {
    date: new Date('2024-01-01'),
    name: 'Design组面',
    time: '19:00-21:00（2h）',
    location: '810',
    player: '周子涵',
    description: '可以调时间',
  },
  {
    date: new Date('2024-01-01'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: '柴犬',
    description: '没别的时间了',
  },
  {
    date: new Date('2024-01-02'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: 'kid',
    description: '没别的时间了',
  },
  {
    date: new Date('2024-01-02'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: '一架飞机',
    description: '可以调时间',
  },
  {
    date: new Date('2024-01-03'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: '菜菜子',
    description: '没别的时间了',
  },
]; // 测试
// 格式化日期
const formatDate = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// 监听calendar组件的dateClick事件，更新选中日期
const handleDateClick = (date: Date) => {
  selectedDate.value = formatDate(date);
};

// 根据选中日期过滤对象数组
const filteredItems = computed(() => {
  if (!selectedDate.value) return [];
  const selectedDateValue = new Date(selectedDate.value);
  return schedulesEg.filter((schedule) => {
    const itemDate = new Date(schedule.date);
    return itemDate.getTime() === selectedDateValue.getTime();
  });
});
</script>

<style scoped lang="less"></style>

<template>
  <div class="flex-4 bg-white rounded-sm h-full">
    <a-calendar :model-value="curDate" @change="handleClick">
      <template #default="{ year, month, date }">
        <div class="arco-calendar-date">
          <div class="arco-calendar-date-value">
            <div class="arco-calendar-date-circle">{{ date }}</div>
            <div
              v-if="isSelectedDate(year, month, date)"
              class="flex justify-between"
            >
              <a-badge :color="'arcoblue'"></a-badge>
              <span>xxx</span>
            </div>
          </div>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface InterviewInfo {
  step: string;
  group: string;
}

const props = defineProps<{
  infos: InterviewInfo[];
}>();

const curDate = ref(new Date('2024-01-01'));

function isSelectedDate(year: number, month: number, date: number) {
  const yearNumber = curDate.value.getFullYear();
  const monthNumber = curDate.value.getMonth() + 1; // 加1是因为 getMonth() 返回的月份是从0开始的
  const dayNumber = curDate.value.getDate();

  return year === yearNumber && month === monthNumber && date === dayNumber;
}

const emits = defineEmits(['dateClick']);

// 点击某天的事件处理函数
const handleClick = (date: Date) => {
  curDate.value = date;
  emits('dateClick', date);
};
</script>

<style scoped lang="less"></style>

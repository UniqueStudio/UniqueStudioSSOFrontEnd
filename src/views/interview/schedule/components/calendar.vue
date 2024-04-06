<template>
  <div class="flex-4 bg-white rounded-sm">
    <a-calendar :model-value="startDate" @change="handleClick" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const startDate = ref(new Date('2024-01-01'));
const emits = defineEmits(['dateClick']);

// 日历组件的点击事件处理函数
const handleClick = (date: Date) => {
  emits('dateClick', date); // 触发自定义事件，传递选中日期
};
</script>

<style scoped lang="less"></style>

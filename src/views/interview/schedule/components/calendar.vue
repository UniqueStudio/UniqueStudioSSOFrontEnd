<template>
  <div class="flex-4 bg-white rounded-sm">
    <a-calendar :model-value="startDate" @update:modelValue="updateValue" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 格式化日期
const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return date.toLocaleDateString('en-US', options);
};
const startDate = ref(new Date('2024-01-01'));
const formattedDate = ref(formatDate(startDate.value));
// 更新日期
const updateValue = (newValue) => {
  startDate.value = newValue;
  formattedDate.value = formatDate(newValue);
};
</script>

<style scoped lang="less"></style>

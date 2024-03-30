<template>
  <div>
    <div class="bg-white w-full h-full p-5">
      <a-calendar :model-value="startDate" @update:modelValue="updateValue" />
      <p>Selected Date: {{ formattedDate }}</p>
    </div>
    <div> </div>
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

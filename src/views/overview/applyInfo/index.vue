<template>
  <div class="flex">
    <div class="flex flex-col w-2/3">
      <overview></overview>
      <stages></stages>
    </div>
    <div class="w-1/3 bg-[--color-bg-1] ml-5">
      <schedules></schedules>
    </div>
  </div>
</template>

<script setup lang="ts">
import overview from './components/overview.vue';
import stages from './components/stages.vue';
import schedules from './components/schedules.vue';
</script>

<style scoped lang="less"></style>

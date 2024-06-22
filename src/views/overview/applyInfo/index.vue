<template>
  <div class="overflow-scroll">
    <div class="sm:flex">
      <div class="flex flex-col w-full sm:w-2/3 sm:min-w-500">
        <overview></overview>
        <stages></stages>
      </div>
      <div class="w-full bg-[--color-bg-2] mt-5 sm:w-1/3 sm:ml-5 sm:min-w-400">
        <schedules></schedules>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import overview from './components/overview.vue';
import stages from './components/stages.vue';
import schedules from './components/schedules.vue';
</script>

<style scoped lang="less"></style>

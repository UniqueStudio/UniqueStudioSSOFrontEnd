<template>
  <div class="flex justify-end gap-2 pt-5">
    <a-button type="primary" @click="switchStage">
      {{ $t('common.operation.switchStage') }} </a-button
    ><a-button status="danger" @click="terminate">
      {{ $t('common.operation.terminate') }} </a-button
    ><a-button type="outline" @click="notify">
      <template #icon>
        <icon-plus />
      </template>
      {{ $t('common.operation.notify') }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
const switchStage = () => {};
const terminate = () => {};
const notify = () => {};
</script>

<style scoped lang="less"></style>

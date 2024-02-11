<template>
  <div class="candidate-wrapper">
    <div class="title">{{ $t('menu.overview.candidate') }}</div>
    <div class="flex justify-between">
      <a-steps
        v-model:current="currentStep"
        class="flex-1 max-w-4xl"
        changeable
      >
        <a-step
          v-for="(item, index) in recruitSteps"
          :key="index"
          :description="`${'todo'}${$t('candidate.person')}`"
          >{{ $t(item.i18Key) }}</a-step
        >
      </a-steps>
      <div class="flex">
        <a-step
          class="step-fail"
          :description="`${114}${$t('candidate.person')}`"
        >
          <template #icon>
            <icon-close />
          </template>
          {{ $t('common.steps.Fail') }}</a-step
        >
        <a-step class="step-all" :description="`${514}${$t('common.person')}`">
          <template #icon> <icon-user /> </template
          >{{ $t('common.steps.All') }}</a-step
        >
      </div>
    </div>
    <a-divider />
    <candidate-info></candidate-info>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { recruitSteps } from '@/constants/team';
import candidateInfo from './components/candidate-info.vue';

const currentStep = ref(0);
</script>

<style scoped lang="less">
.candidate-wrapper {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 20px;
  .title {
    color: #1d2129;
    font-size: 20px;
    padding-bottom: 20px;
  }
  .step-fail {
    :deep(.arco-steps-icon) {
      color: rgb(var(--red-6));
      background-color: rgb(var(--red-1));
    }
  }
  .step-all {
    :deep(.arco-steps-icon) {
      color: rgb(var(--arcoblue-6));
      background-color: rgb(var(--arcoblue-1));
    }
  }
}
</style>

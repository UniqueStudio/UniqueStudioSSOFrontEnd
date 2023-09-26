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
          v-for="(item, index) in steps"
          :key="index"
          :description="`${item.num}${$t('candidate.person')}`"
          >{{ $t(item.step) }}</a-step
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
          {{ $t('candidate.steps.fail') }}</a-step
        >
        <a-step
          class="step-all"
          :description="`${514}${$t('candidate.person')}`"
        >
          <template #icon> <icon-user /> </template
          >{{ $t('candidate.steps.all') }}</a-step
        >
      </div>
    </div>
    <a-divider />
    <candidate-info
      :step-info="{
        cur: steps[currentStep]?.step,
        next: steps[currentStep + 1]?.step,
      }"
    ></candidate-info>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { recruitSteps } from '@/constants/team';
import candidateInfo from './components/candidate-info.vue';

const steps = Object.values(recruitSteps).map((step, num) => ({ step, num }));
const currentStep = ref(2);
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
    font-weight: 500;
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

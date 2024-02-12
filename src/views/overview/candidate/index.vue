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
          :description="`${stepCnt[index]}${$t('candidate.person')}`"
          >{{ $t(item.i18Key) }}</a-step
        >
      </a-steps>
      <div class="flex">
        <a-step
          class="step-fail"
          :description="`${failCnt}${$t('candidate.person')}`"
        >
          <template #icon>
            <icon-close />
          </template>
          {{ $t('common.steps.Fail') }}</a-step
        >
        <a-step
          class="step-all"
          :description="`${curApplications.length}${$t('common.person')}`"
        >
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
import { ref, computed } from 'vue';
import { recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import candidateInfo from './components/candidate-info.vue';

const recStore = useRecruitmentStore();

const currentStep = ref(0);
const curApplications = computed(() => recStore.currentRec?.applications ?? []);
const stepCnt = computed(() =>
  recruitSteps.map(
    ({ value }) =>
      curApplications.value.filter(({ step }) => value.includes(step)).length,
  ),
);

const failCnt = computed(
  () => curApplications.value.filter(({ rejected }) => rejected).length,
);
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

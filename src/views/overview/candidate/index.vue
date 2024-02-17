<template>
  <div class="bg-white w-full h-full p-5">
    <div class="text-[--color-text-1] text-xl pb-5">{{
      $t('menu.overview.candidate')
    }}</div>
    <div class="flex justify-between">
      <a-steps
        v-model:current="currentStep"
        class="flex-1 max-w-4xl"
        changeable
        small
      >
        <a-step
          v-for="(item, index) in recruitSteps"
          :key="item.i18Key"
          :description="`${stepCnt[index]}${$t('common.person')}`"
        >
          <span :title="$t(item.i18Key)">{{ $t(item.i18Key) }}</span>
        </a-step>
      </a-steps>
      <div class="flex">
        <a-step
          class="step-fail"
          :description="`${failCnt}${$t('common.person')}`"
        >
          <template #icon>
            <icon-close />
          </template>
          {{ $t('common.steps.Fail') }}</a-step
        >
        <a-step
          class="step-all"
          :description="`${recStore.curApplications.length}${$t(
            'common.person',
          )}`"
        >
          <template #icon> <icon-user /> </template
          >{{ $t('common.steps.All') }}</a-step
        >
      </div>
    </div>
    <a-divider />
    <candidate-info :cur-step="currentStep - 1"></candidate-info>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import candidateInfo from './components/candidate-info.vue';

const recStore = useRecruitmentStore();

const currentStep = ref(1);
const stepCnt = computed(() =>
  recruitSteps.map(
    ({ value }) =>
      recStore.curApplications.filter(({ step }) => value.includes(step))
        .length,
  ),
);

const failCnt = computed(
  () =>
    recStore.curApplications.filter(
      ({ rejected, abandoned }) => rejected || abandoned,
    ).length,
);
</script>

<style scoped lang="less">
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
</style>

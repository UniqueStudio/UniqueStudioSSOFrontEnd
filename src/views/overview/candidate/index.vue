<template>
  <div
    class="flex flex-col sm:bg-[--color-bg-1] w-full h-full pt-9 sm:p-5 overflow-hidden"
  >
    <div class="text-[--color-text-1] text-xl pb-5 hidden sm:block">{{
      $t('menu.overview.candidate')
    }}</div>
    <div class="justify-between w-full hidden sm:flex">
      <a-scrollbar
        outer-class="w-[calc(100%-220px)] shrink"
        class="overflow-x-auto overflow-y-hidden pb-3"
        ><a-steps v-model:current="currentStep" changeable small>
          <a-step
            v-for="(item, index) in recruitSteps"
            :key="item.i18Key"
            class="min-w-min"
            :description="`${stepCnt[index]}${$t('common.person')}`"
          >
            <span :title="$t(item.i18Key)">{{ $t(item.i18Key) }}</span>
          </a-step>
        </a-steps>
      </a-scrollbar>

      <div class="flex shrink-0">
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
    <a-divider class="hidden sm:block" />
    <candidate-info v-model="currentStep"></candidate-info>
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

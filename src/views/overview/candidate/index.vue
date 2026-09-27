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
        <a-steps
          :current="currentStep - 8"
          changeable
          @change="(x: number) => (currentStep = x + 8)"
        >
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
            :description="`${allCnt}${$t('common.person')}`"
          >
            <template #icon> <icon-user /> </template
            >{{ $t('common.steps.All') }}</a-step
          >
        </a-steps>
      </div>
    </div>
    <a-divider class="hidden sm:block" />
    <candidate-info
      v-model:cur-step="currentStep"
      v-model:current-group="currentGroup"
    ></candidate-info>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Group, recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import candidateInfo from './components/candidate-info.vue';

const route = useRoute();

const recStore = useRecruitmentStore();

// 从 URL query 或 localStorage 恢复状态（仅初始化时读取一次）
const savedGroup = localStorage.getItem('candidate-view-group') as Group | null;
const initStep = Number(route.query.step);
const initGroup = route.query.group as Group | undefined;

const currentStep = ref(initStep >= 1 && initStep <= 10 ? initStep : 1);
const currentGroup = ref(
  initGroup && Object.values(Group).includes(initGroup)
    ? initGroup
    : savedGroup && Object.values(Group).includes(savedGroup)
    ? savedGroup
    : Group.Web,
);

// 同步状态到 URL 和 localStorage
watch([currentStep, currentGroup], ([step, group]) => {
  localStorage.setItem('candidate-view-group', group);
  // 使用 history API 直接更新 URL，避免触发路由导航
  const url = new URL(window.location.href);
  url.searchParams.set('step', String(step));
  url.searchParams.set('group', group);
  window.history.replaceState(null, '', url.toString());
});
const stepCnt = computed(() =>
  recruitSteps.map(
    ({ value }) =>
      recStore.curApplications.filter(
        ({ step, group }) =>
          value.includes(step) && group === currentGroup.value,
      ).length,
  ),
);

const failCnt = computed(
  () =>
    recStore.curApplications.filter(
      ({ rejected, abandoned, group }) =>
        group === currentGroup.value && (rejected || abandoned),
    ).length,
);

const allCnt = computed(
  () =>
    recStore.curApplications.filter(({ group }) => group === currentGroup.value)
      .length,
);
</script>

<style scoped lang="less">
.step-fail {
  :deep(.arco-steps-icon) {
    color: rgb(var(--red-6));
    background-color: rgb(var(--red-1));
  }
  :deep(&.arco-steps-item-active .arco-steps-icon) {
    color: var(--color-white);
    background-color: rgb(var(--red-6));
  }
}
.step-all {
  :deep(.arco-steps-icon) {
    color: rgb(var(--arcoblue-6));
    background-color: rgb(var(--arcoblue-1));
  }
  :deep(&.arco-steps-item-active .arco-steps-icon) {
    color: var(--color-white);
    background-color: rgb(var(--primary-6));
  }
}
</style>

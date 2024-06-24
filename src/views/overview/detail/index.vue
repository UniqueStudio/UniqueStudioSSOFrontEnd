<template>
  <div
    v-if="applyStore.data && user"
    class="bg-[--color-bg-1] w-full h-full overflow-hidden max-sm:mt-40"
  >
    <div class="w-full h-full sm:relative sm:pb-10">
      <a-scrollbar
        class="w-full h-full overflow-y-auto overflow-x-hidden"
        outer-class="w-full h-full hidden sm:block"
      >
        <div class="pb-4 w-full h-auto hidden sm:flex">
          <div class="flex flex-col items-center gap-9 w-69 px-3 py-4 shrink-0">
            <a-tag
              color="transparent"
              style="color: var(--color-text-3)"
              class="self-start p-0 cursor-pointer"
              size="large"
              @click="$router.back()"
            >
              <template #icon> <icon-left /> </template>
              {{ $t('common.operation.back') }}
            </a-tag>

            <profile />

            <div>
              <div class="text-[--color-text-1] pb-5">
                {{ $t('common.user.currentStage') }}
              </div>
              <a-steps
                v-model:current="currentStep"
                direction="vertical"
                class="w-56 px-2"
                :status="stepStatus.status"
                :title="$t(stepStatus.title)"
              >
                <a-step
                  v-for="(item, index) in recruitSteps"
                  :key="index"
                  :description="''"
                  ><span class="text-sm">{{ $t(item.i18Key) }}</span>
                </a-step>
              </a-steps>
            </div>
          </div>
          <a-divider direction="vertical" class="h-auto m-6" />
          <base-info />
        </div>
      </a-scrollbar>
      <div class="sm:hidden h-full">
        <div class="absolute top-0 left-0 bg-[--color-bg-1] z-10 w-full">
          <div class="w-full relative px-3 py-3">
            <icon-left
              class="absolute left-3"
              :size="20"
              @click="$router.back()"
            />
            <span class="inline-block w-full text-center">{{
              $t('menu.overview.candidate')
            }}</span>
          </div>
          <profile />
        </div>
        <a-tabs default-active-key="1" class="pb-4 h-full">
          <a-tab-pane
            key="1"
            :title="$t('common.user.currentStage')"
            class="h-full w-full flex justify-center"
          >
            <a-steps
              v-model:current="currentStep"
              direction="vertical"
              class="w-56 px-2 pb-48"
              :status="stepStatus.status"
              :title="$t(stepStatus.title)"
            >
              <a-step
                v-for="(item, index) in recruitSteps"
                :key="index"
                :description="''"
              >
                <span class="text-sm">{{ $t(item.i18Key) }} </span>
              </a-step>
            </a-steps>
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('common.user.baseInfo')">
            <a-scrollbar
              class="w-full h-auto flex justify-center overflow-y-auto overflow-x-hidden"
              outer-class="w-full h-min"
            >
              <base-info />
            </a-scrollbar>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="w-full p-4 absolute bottom-0 left-0 bg-[--color-bg-1]">
        <edit-buttons
          :candidates="[
            {
              name: user.name,
              aid: applyStore.data.uid,
              step: applyStore.data.step,
              abandoned: applyStore.data.abandoned,
              rejected: applyStore.data.rejected,
            },
          ]"
          :group="applyStore.data.group"
          :cur-step="currentStep - 1"
        ></edit-buttons>
      </div>
    </div>
  </div>
  <a-result v-else status="404" :title="$t('candidate.applicationNotFound')">
    <template #extra>
      <a-space>
        <a-button
          type="secondary"
          @click="applyStore.getApplication(props.id)"
          >{{ $t('common.operation.refresh') }}</a-button
        >
        <a-button type="primary" @click="$router.back()">{{
          $t('common.operation.back')
        }}</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { computed, onActivated, onDeactivated } from 'vue';
import { recruitSteps } from '@/constants/team';
import useApplicationStore from '@/store/modules/application';
import editButtons from '../candidate/components/edit-buttons.vue';
import profile from './profile.vue';
import BaseInfo from './base-info.vue';

const applyStore = useApplicationStore();

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

onActivated(() => applyStore.getApplication(props.id));

onDeactivated(() => applyStore.resetApplication());

const user = computed(() => applyStore.data?.user_detail);

const currentStep = computed(() => {
  if (!applyStore.data) return 0;
  return (
    recruitSteps.findIndex(({ value }) =>
      value.includes(applyStore.data!.step),
    ) + 1
  );
});

const stepStatus = computed<{
  status: 'error' | 'process' | 'finish';
  title: string;
}>(() => {
  if (applyStore.data?.rejected) {
    return {
      status: 'error',
      title: 'common.status.rejected',
    };
  }
  if (applyStore.data?.abandoned) {
    return {
      status: 'error',
      title: 'common.status.abandoned',
    };
  }
  return currentStep.value < recruitSteps.length
    ? {
        status: 'process',
        title: 'common.status.process',
      }
    : {
        status: 'finish',
        title: 'common.steps.Pass',
      };
});
</script>

<style scoped lang="less">
:deep(.arco-steps-item:not(:last-child)) {
  min-height: 66px;
}
:deep(.arco-tabs-nav-tab) {
  justify-content: center;
}
:deep(.arco-tabs-content) {
  height: 90%;
  overflow: auto;
}
</style>

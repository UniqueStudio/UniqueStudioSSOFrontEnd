<template>
  <div
    v-if="applyStore.data && user"
    class="flex bg-white w-full h-full overflow-hidden"
  >
    <div class="flex flex-col items-center gap-9 w-69 px-3 py-4">
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

      <div class="flex flex-col items-center">
        <a-avatar :size="64">{{ user.avatar_url || user.name || '' }}</a-avatar>
        <div class="text-[--color-text-1] pt-3">{{ user.name ?? '' }}</div>
        <div class="text-[--color-text-3]">{{ applyStore.data.group }}</div>
      </div>

      <div class="flex flex-col justify-around gap-3 w-56 px-2">
        <div class="flex gap-4">
          <div
            class="w-9 h-9 rounded-full flex justify-center items-center bg-[rgb(var(--gray-2))] shrink-0"
          >
            <icon-phone size="20" />
          </div>
          <div>
            <div class="text-[--color-text-3]">
              {{ $t('common.user.phone') }}
            </div>
            <div>{{ user.phone ?? '' }}</div>
          </div>
        </div>

        <div class="flex gap-3">
          <div
            class="w-9 h-9 rounded-full flex justify-center items-center bg-[rgb(var(--gray-2))] shrink-0"
          >
            <icon-email size="20" />
          </div>
          <div>
            <div class="text-[--color-text-3]">
              {{ $t('common.user.email') }}
            </div>
            <div>{{ user.email ?? '' }}</div>
          </div>
        </div>
      </div>

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
    <div class="flex flex-col justify-between w-full px-6 py-4">
      <a-tabs type="rounded" size="large">
        <a-tab-pane key="1" :title="$t('common.user.baseInfo')">
          <div class="flex flex-col gap-9">
            <a-descriptions size="large" layout="inline-vertical" :column="3">
              <a-descriptions-item :label="$t('common.user.gender')">
                {{ $t(GenderMap[user.gender]) }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.institute')">
                {{ applyStore.data.institute }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.major')">
                {{ applyStore.data.major }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.grade')">
                {{ applyStore.data.grade }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.rank')">
                {{ applyStore.data.rank }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.referrer')">
                {{ applyStore.data.referrer }}
              </a-descriptions-item>
            </a-descriptions>
            <div>
              <div class="text-[--color-text-1] pb-5">
                {{ $t('common.user.intro') }}
              </div>
              <div
                class="text-[--color-neutral-8]"
                :class="{ 'line-clamp-3': !showIntroDetail }"
              >
                {{ applyStore.data.intro }}
              </div>
              <div
                class="text-sm text-[rgb(var(--primary-6))] cursor-pointer"
                @click="showIntroDetail = !showIntroDetail"
              >
                {{
                  $t(
                    showIntroDetail
                      ? 'common.operation.close'
                      : 'common.operation.more',
                  )
                }}
              </div>
            </div>
            <comment></comment>
          </div>
        </a-tab-pane>
        <a-button type="text" shape="round">{{
          $t('common.user.baseInfo')
        }}</a-button>
      </a-tabs>
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
        :cur-step="currentStep"
      ></edit-buttons>
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
import { ref, defineProps, computed } from 'vue';
import { recruitSteps, GenderMap } from '@/constants/team';
import useApplicationStore from '@/store/modules/application';
import comment from './comment.vue';
import editButtons from '../components/edit-buttons.vue';

const applyStore = useApplicationStore();

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

applyStore.getApplication(props.id);

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

const showIntroDetail = ref(false);
</script>

<style scoped lang="less">
:deep(.arco-steps-item:not(:last-child)) {
  min-height: 66px;
}
</style>

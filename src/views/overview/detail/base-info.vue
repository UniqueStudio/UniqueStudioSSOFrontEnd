<template>
  <div
    class="flex flex-col justify-between w-full px-6 py-4 shrink max-sm:pb-48"
  >
    <div class="flex flex-col gap-9">
      <div class="pt-1">
        <div class="text-[--color-text-1] pb-5">
          {{ $t('common.user.baseInfo') }}
        </div>
        <a-descriptions
          size="large"
          :layout="widthType === 'sm' ? 'inline-horizontal' : 'inline-vertical'"
          :column="widthType === 'sm' ? 1 : 3"
        >
          <a-descriptions-item :label="$t('common.user.gender')">
            {{ $t(GenderMap[user!.gender]) }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.user.institute')">
            {{ applyStore.data!.institute }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.user.major')">
            {{ applyStore.data!.major }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.user.grade')">
            {{ applyStore.data!.grade }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.user.rank')">
            {{ applyStore.data!.rank }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.user.referrer')">
            {{ applyStore.data!.referrer || $t('common.void') }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.user.isQuick')">
            {{ applyStore.data!.is_quick ? $t('common.yes') : $t('common.no') }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div>
        <div class="text-[--color-text-1] pb-5">
          {{ $t('common.user.intro') }}
        </div>
        <div
          class="text-[--color-neutral-8]"
          :class="{ 'line-clamp-3': !showIntroDetail }"
        >
          {{ applyStore.data!.intro }}
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
      <div>
        <div class="text-[--color-text-1] pb-5">
          {{ $t('common.user.resume') }}
        </div>
        <a-button
          class="w-[min(100%,520px)] h-min py-4"
          long
          :disabled="!applyStore.data?.resume"
          @click="
            applyStore.getApplicationResume(
              applyStore.data!.uid,
              applyStore.data!.resume.split('/').pop()!,
            )
          "
        >
          <div class="flex justify-between w-full items-center">
            <div class="flex gap-3 items-center w-[calc(100%-15px)] shrink">
              <icon-file />
              <div class="w-[calc(100%-35px)] overflow-x-auto">{{
                applyStore.data!.resume.split('/').pop() || $t('common.void')
              }}</div>
            </div>
            <icon-download />
          </div>
        </a-button>
      </div>
      <div>
        <div class="text-[--color-text-1] pb-5">
          {{ $t('common.user.answer') }}
        </div>
        <a-button
          class="w-[min(100%,520px)] h-min py-4"
          long
          :disabled="!applyStore.data?.answer"
          @click="
            applyStore.getApplicationWrittenTestAnswer(
              applyStore.data!.uid,
              applyStore.data!.answer.split('/').pop()!,
            )
          "
        >
          <div class="flex justify-between w-full items-center">
            <div class="flex gap-3 items-center w-[calc(100%-15px)] shrink">
              <icon-file />
              <div class="w-[calc(100%-35px)] overflow-x-auto">{{
                applyStore.data!.answer.split('/').pop() || $t('common.void')
              }}</div>
            </div>
            <icon-download />
          </div>
        </a-button>
      </div>
      <comment></comment>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { GenderMap } from '@/constants/team';
import useApplicationStore from '@/store/modules/application';
import useWindowResize from '@/hooks/resize';
import comment from './comment.vue';

const applyStore = useApplicationStore();
const user = computed(() => applyStore.data?.user_detail);
const showIntroDetail = ref(false);

const { widthType } = useWindowResize();
</script>

<template>
  <div class="detail-wrapper">
    <!-- {{ 'detail' + $route.params.id }}  -->
    <div class="detail-left">
      <a-tag
        color="transparent"
        style="
          color: var(--color-text-3);
          align-self: start;
          padding: 0;
          cursor: pointer;
        "
        size="large"
        @click="$router.back()"
      >
        <template #icon> <icon-left /> </template>
        {{ $t('common.operation.back') }}
      </a-tag>

      <div class="flex flex-col items-center">
        <a-avatar :size="64">{{ user.name }}</a-avatar>
        <div class="detail-left_name">{{ user.name }}</div>
        <div style="color: var(--color-text-3)">{{ user.group }}</div>
      </div>

      <div class="flex flex-col justify-around gap-3 w-56 px-2">
        <div class="flex gap-4">
          <div
            class="w-9 h-9 rounded-full flex justify-center items-center"
            style="background-color: rgb(var(--gray-2))"
          >
            <icon-phone size="20" />
          </div>
          <div>
            <div style="color: var(--color-text-3); font-weight: 500">
              {{ $t('common.user.phone') }}
            </div>
            <div>{{ user.phone }}</div>
          </div>
        </div>

        <div class="flex gap-3">
          <div
            class="w-9 h-9 rounded-full flex justify-center items-center"
            style="background-color: rgb(var(--gray-2))"
          >
            <icon-email size="20" />
          </div>
          <div>
            <div style="color: var(--color-text-3); font-weight: 500">
              {{ $t('common.user.email') }}
            </div>
            <div>{{ user.email }}</div>
          </div>
        </div>
      </div>

      <div class="">
        <div
          style="
            color: var(--color-text-1);
            font-size: 16px;
            padding-bottom: 20px;
          "
        >
          {{ $t('common.user.currentStage') }}
        </div>
        <a-steps
          v-model:current="user.steps.length"
          direction="vertical"
          class="w-56 px-2"
        >
          <a-step
            v-for="(item, index) in steps"
            :key="index"
            :description="item.time"
            ><span style="font-size: 14px">{{ $t(item.step) }}</span>
          </a-step>
        </a-steps>
      </div>
    </div>

    <a-divider direction="vertical" style="height: auto; margin: 24px" />
    <div class="detail-right">right</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Groups, recruitSteps } from '@/constants/team';
import { Gender } from '@/views/login/type';

const user = ref({
  id: 1,
  name: '联小创',
  avatar: '',
  gender: Gender.male,
  school: '计算机学院',
  major: '计科',
  grade: '大一',
  score: '前1%',
  recommender: 'abc',
  intro: '自我介绍',
  comment: {
    good: [
      { name: 'aaa', comment: '好好好' },
      { name: 'aaa', comment: '好好好' },
    ],
    normal: [{ name: 'aaa', comment: '嗯嗯恩' }],
    bad: [{ name: 'aaa', comment: '呃呃呃' }],
  },
  phone: '1145141919',
  email: 'henhen@aaa.hust',
  status: '已终止',
  steps: ['2023.09.09', '2023.09.10'],
  group: Groups.Design,
});
const steps = Object.values(recruitSteps).map((step, num) => ({
  step,
  time: user.value.steps[num],
}));
</script>

<style scoped lang="less">
.detail-wrapper {
  display: flex;
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .detail-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
    width: 274px;
    padding: 12px 16px;
    &_name {
      color: var(--color-text-1);
      padding-top: 12px;
      font-size: 16px;
    }
    :deep(.arco-steps-item:not(:last-child)) {
      min-height: 66px;
    }
  }
}
</style>

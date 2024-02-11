<template>
  <div class="detail-wrapper">
    <div class="detail-left">
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
        <a-avatar :size="64">{{ user.name }}</a-avatar>
        <div class="text-[--color-text-1] pt-3">{{ user.name }}</div>
        <div class="text-[--color-text-3]">{{ user.group }}</div>
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
            <div class="text-[--color-text-3]">
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
            <div class="text-[--color-text-3]">
              {{ $t('common.user.email') }}
            </div>
            <div>{{ user.email }}</div>
          </div>
        </div>
      </div>

      <div>
        <div class="text-[--color-text-1] pb-5">
          {{ $t('common.user.currentStage') }}
        </div>
        <a-steps
          v-model:current="user.steps.length"
          direction="vertical"
          class="w-56 px-2"
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
    <div class="detail-right">
      <a-tabs type="rounded" size="large">
        <a-tab-pane key="1" :title="$t('common.user.baseInfo')">
          <div class="flex flex-col gap-9">
            <a-descriptions size="large" layout="inline-vertical" :column="3">
              <a-descriptions-item :label="$t('common.user.gender')">
                {{ user.gender }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.school')">
                {{ user.school }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.major')">
                {{ user.major }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.grade')">
                {{ user.grade }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.score')">
                {{ user.score }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('common.user.recommender')">
                {{ user.recommender }}
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
                {{ user.intro }}
              </div>
              <div
                style="color: rgb(var(--arcoblue-6))"
                class="text-sm cursor-pointer"
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
            <comment :id="user.id"></comment>
          </div>
        </a-tab-pane>
        <a-button type="text" shape="round">{{
          $t('common.user.baseInfo')
        }}</a-button>
      </a-tabs>
      <edit-buttons
        :candidates="[user]"
        :step-info="{
          cur: 0,
          next: 1,
        }"
      ></edit-buttons>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Group, recruitSteps } from '@/constants/team';
import { Gender } from '@/views/login/type';
import comment from './comment.vue';
import editButtons from '../components/edit-buttons.vue';
import { Candidate } from '../type';

const user = ref<Candidate>({
  id: '1',
  name: '联小创',
  avatar: '',
  gender: Gender.male,
  school: '计算机学院',
  major: '计科',
  grade: '大一',
  score: '前1%',
  recommender: 'abc',
  intro:
    '我热爱阅读与思考，并积极去了解这个世界对我来说的未知。“有两件事物我愈是思考，愈觉得神奇，内心也愈是充满敬畏，那就是我们头顶灿烂的星空和我们内心崇高的道德准则。”我喜欢观察人类，了解他们在想什么。 我想加入产品经理组，并且对于通过设计互联网产品来解决生活中的问题充满激情。例如我自己在生活中喜欢品尝鸡尾酒，但是在大众点评或美团这种常用的第三方消费点评软件中很难了解到一家清吧的鸡尾酒价格以及特色，经常会踩雷或者实际去到店中即使会有调酒师的介绍也不知道哪种酒适合自己的口味，如果没有关注公众号或者加上老板微信也很难及时了解到店里的活动，所以我设想如果有一个针对热爱调酒和品酒文化的用户的专属于清吧的社区软件，就能很好的解决这些问题。在生活中我会积极体验各种各样的产品，仔细观察产品是否存在缺陷，并思考如何改进它们，或创造一款互联网产品来解决空白问题，以提供更好的用户体验。',
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
  group: Group.Design,
});
const steps = Object.values(recruitSteps).map((step, num) => ({
  step,
  time: user.value.steps[num],
}));
const showIntroDetail = ref(false);
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
    :deep(.arco-steps-item:not(:last-child)) {
      min-height: 66px;
    }
  }
  .detail-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 24px 16px;
  }
}
</style>

<template>
  <div class="flex">
    <a-card
      class="w-full"
      :class="{ 'checked-style': checked }"
      title="Arco Card"
      size="small"
      hoverable
      :header-style="{ height: 'auto' }"
    >
      <template #title>
        <div class="flex justify-between">
          <div class="flex justify-start gap-2 items-center">
            <a-link :href="`candidate/detail/${info.id}`">
              <a-avatar class="card-avatar" :size="24">
                {{ info.avatar || info.name }}
              </a-avatar>
              <a-typography-text class="text-lg">
                {{ info.name }}
              </a-typography-text>
            </a-link>
            <a-tag color="red">{{ info.status }}</a-tag>
          </div>
          <a-checkbox :value="info.id"></a-checkbox>
        </div>

        <div class="desc">
          <div>
            <span class="desc-label">{{ $t('common.user.gender') }}</span>
            <span>{{ $t('common.user.gender.other') }}</span>
          </div>
          <div>
            <span class="desc-label">{{ $t('common.user.grade') }}</span>
            <span>{{ '大一' }}</span>
          </div>
          <div>
            <span class="desc-label">{{ $t('common.user.school') }}</span>
            <span>{{ '计算机科学与技术学院' }}</span>
          </div>
        </div>
      </template>
      <div class="flex justify-between">
        <div class="flex gap-2">
          <a-tag
            v-if="info.comment.good.length"
            color="gray"
            class="text-xs rounded-full px-2.5"
          >
            <template #icon> 😘 </template>
            {{ info.comment.good.length }}
          </a-tag>
          <a-tag
            v-if="info.comment.normal.length"
            color="gray"
            class="text-xs rounded-full px-2.5"
          >
            <template #icon> 🤔 </template>
            {{ info.comment.normal.length }}
          </a-tag>
          <a-tag
            v-if="info.comment.bad.length"
            color="gray"
            class="text-xs rounded-full px-2.5"
          >
            <template #icon> 😅 </template>
            {{ info.comment.bad.length }}
          </a-tag>
        </div>
        <a-tag color="transparent" class="comment-tag">
          <template #icon> <icon-message /> </template>
          {{
            `${
              info.comment.good.length +
              info.comment.normal.length +
              info.comment.bad.length
            }条评论`
          }}
        </a-tag>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Candidate } from '../type';

defineProps({
  info: {
    type: Object as PropType<Candidate>,
    default: () => ({}),
  },
  checked: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="less">
.checked-style {
  background-color: #f0f5ff;
}
.card-avatar {
  background-color: rgb(var(--arcoblue-6));
  margin-right: 8px;
}
.desc {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding-top: 12px;
  &-label {
    color: var(--color-text-3);
    padding-right: 7px;
  }
}
.comment-tag {
  font-size: 12px;
  border-radius: 9999px;
  padding: 6px 0 6px 10px;
  background-color: transparent;
  color: var(--color-text-3);
}
</style>

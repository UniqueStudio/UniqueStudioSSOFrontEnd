<template>
  <div>
    <div class="text-[--color-text-1] pb-5">
      {{ $t('common.user.comment') }}
    </div>
    <div class="flex gap-2">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-full py-1.5 px-2.5 text-sm bg-[--color-neutral-2] text-[--color-neutral-8]"
      >
        <span>{{ comment.evaluation }}</span>
        <span>{{ comment.member }}: </span>
        <span>{{ comment.content }}</span>
      </div>
    </div>
    <div class="flex pt-4 text-sm flex-nowrap">
      <a-select v-model="curComment.evaluation" class="w-min" :bordered="false">
        <a-option>😘</a-option>
        <a-option>🤔</a-option>
        <a-option>😅</a-option>
      </a-select>
      <a-input
        class="w-96 rounded-l-sm"
        :placeholder="$t('common.operation.submitComment')"
        allow-clear
      />
      <a-button type="primary" class="rounded-r-sm">
        {{ $t('common.operation.submit') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  id: {
    type: String,
    default: '',
  },
});

const comments = ref([
  {
    id: '1',
    evaluation: '😘',
    member: 'aaa',
    content: '好好好',
  },
  {
    id: '2',
    evaluation: '🤔',
    member: 'aaa',
    content: '嗯嗯嗯',
  },
  {
    id: '3',
    evaluation: '😅',
    member: 'aaa',
    content: '呃呃呃',
  },
]);

const curComment = ref({
  evaluation: '🤔',
  content: '',
});
</script>

<style scoped lang="less"></style>

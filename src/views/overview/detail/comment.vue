<template>
  <div>
    <div class="text-[--color-text-1] pb-5">
      {{ $t('common.user.comment') }}
    </div>
    <div class="flex gap-2 flex-wrap">
      <div
        v-for="comment in applyStore.data?.comments?.flat() ?? []"
        :key="comment.uid"
        :class="[
          'group py-1.5 px-2.5 text-sm bg-[--color-neutral-2] text-[--color-neutral-8]',
          isMultiline(
            `${EvaluationMap[comment.evaluation]} ${comment.member_name}${
              comment.content ? `: ${comment.content}` : ''
            }`,
            containerWidth
          )
            ? 'rounded-3xl'
            : 'rounded-full'
        ]"
      >
        <span>{{ EvaluationMap[comment.evaluation] }}</span>
        <span>{{
          ` ${comment.member_name}${
            comment.content ? `：${comment.content}` : ''
          }`
        }}</span>
        <span
          v-if="comment.member_id === userStore.data?.uid"
          class="inline-block leading-4 ml-1 w-4 h-4 rounded-full hover:bg-[--color-fill-3] text-center"
          @click="handleDeleteComment(comment.uid)"
        >
          <icon-close />
        </span>
      </div>
    </div>
    <div class="flex pt-4 text-sm flex-nowrap">
      <a-select v-model="curComment.evaluation" class="w-min" :bordered="false">
        <a-option
          v-for="(item, index) in EvaluationMap"
          :key="item"
          :value="index"
          >{{ item || $t('common.void') }}</a-option
        >
      </a-select>
      <a-input
        v-model="curComment.content"
        class="w-96 rounded-l-sm"
        :placeholder="$t('common.operation.submitComment')"
        allow-clear
      />
      <a-button
        type="primary"
        class="rounded-r-sm"
        @click="handleCreateComment"
      >
        {{ $t('common.operation.submit') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted  } from 'vue';
import { Evaluation, EvaluationMap } from '@/constants/team';
import { deleteComment, createComment } from '@/api';
import useApplicationStore from '@/store/modules/application';
import useUserStore from '@/store/modules/user';
import { Modal, Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const applyStore = useApplicationStore();
const userStore = useUserStore();

const curComment = ref({
  application_id: applyStore.data?.uid ?? '',
  evaluation: Evaluation.Normal,
  content: '',
});

const handleCreateComment = async () => {
  if (!curComment.value.content && !curComment.value.evaluation) {
    Message.error(t('common.result.commentNotNull'));
    return;
  }
  await createComment(curComment.value);
  await applyStore.getApplication(curComment.value.application_id);
  Message.success(t('common.result.createSuccess'));
  curComment.value.content = '';
};
const handleDeleteComment = async (cid: string) => {
  Modal.confirm({
    title: '',
    content: t('common.operation.confirmDeleteComment'),
    onOk: async () => {
      await deleteComment(cid);
      await applyStore.getApplication(curComment.value.application_id);
      Message.success(t('common.result.deleteSuccess'));
    },
  });
};

const containerWidth = ref(800);

onMounted(() => {
  const container = document.querySelector('.flex.gap-2.flex-wrap');
  if (container) {
    containerWidth.value = container.clientWidth;
  }
});

const isMultiline = (text: string, containerWidth: number) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = 'text-sm';
    return context.measureText(text).width > containerWidth;
  }
  return false;
};
</script>

<style scoped lang="less"></style>

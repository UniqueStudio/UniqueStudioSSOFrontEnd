<template>
  <div class="flex justify-end gap-2 pt-5">
    <a-button type="primary" @click="showSwitchStage = true">
      {{ $t('common.operation.switchStage') }} </a-button
    ><a-button status="danger" @click="showTerminate = true">
      {{ $t('common.operation.terminate') }} </a-button
    ><a-button type="outline" @click="showNotify = true">
      <template #icon>
        <icon-plus />
      </template>
      {{ $t('common.operation.notify') }}
    </a-button>
  </div>
  <a-modal
    v-model:visible="showSwitchStage"
    simple
    message-type="info"
    :title="$t('common.operation.switchStage')"
    :on-before-ok="handleSwitchStage"
  >
    <div
      style="text-align: center"
      v-html="
        $t('candidate.switchStage', {
          num: `<span style='color: rgb(var(--arcoblue-6));'>${selectedCandidates.length}</span>`,
          cur: `<span style='color: rgb(var(--arcoblue-6));'>${$t(
            stepInfo.cur,
          )}</span>`,
          next: `<span style='color: rgb(var(--arcoblue-6));'>${$t(
            stepInfo.next,
          )}</span>`,
        })
      "
    ></div>
  </a-modal>
  <a-modal
    v-model:visible="showTerminate"
    simple
    message-type="warning"
    :title="$t('common.operation.confirmTerminate')"
    :on-before-ok="handleTerminate"
  >
    <div
      style="text-align: center"
      v-html="
        $t('candidate.terminate', {
          num: `<span style='color: rgb(var(--arcoblue-6));'>${selectedCandidates.length}</span>`,
        })
      "
    ></div>
  </a-modal>
  <a-modal
    v-model:visible="showNotify"
    :title="$t('common.operation.notify')"
    :on-before-ok="handleNotify"
  >
    <a-form :model="formData" layout="vertical">
      <a-form-item field="ids" :label="$t('candidate.receiver')">
        <a-input-tag :default-value="['test']" readonly />
      </a-form-item>
      <a-form-item field="content" :label="$t('common.operation.editContent')">
        <a-select
          v-model:model-value="formData.content.stage"
          :trigger-props="{ autoFitPopupMinWidth: true }"
        >
          <a-option v-for="item in steps" :key="item.index" :value="item.index">
            {{ $t(item.step) }}
          </a-option>
        </a-select>
        <a-date-picker v-model="formData.content.date" @change="changeDate" />
        <a-select
          v-model:model-value="formData.content.room"
          :trigger-props="{ autoFitPopupMinWidth: true }"
        >
          <a-option v-for="item in [808, 809, 810, 811]" :key="item">
            {{ item }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="content">
        <a-textarea v-model="formData.content.text" auto-size />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { recruitSteps } from '@/constants/team';

defineProps({
  selectedCandidates: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  stepInfo: {
    type: Object as PropType<{ cur: string; next: string }>,
    default: () => ({}),
  },
});

const steps = Object.values(recruitSteps).map((step, index) => ({
  step,
  index,
}));

const formData = ref({
  ids: [],
  content: {
    stage: 0,
    date: '',
    room: '808',
    text: '',
  },
});
const changeDate = () => {
  console.log(formData.value.content);
};

const showSwitchStage = ref(false);
const showTerminate = ref(false);
const showNotify = ref(false);

const handleSwitchStage = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return true;
};
const handleTerminate = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return true;
};
const handleNotify = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return true;
};
</script>

<style scoped lang="less"></style>

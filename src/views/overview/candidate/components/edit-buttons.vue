<template>
  <div class="flex justify-end gap-2">
    <a-button
      type="primary"
      :disabled="!candidates.length"
      @click="showSwitchStage = true"
    >
      {{ $t('common.operation.switchStage') }}
    </a-button>
    <a-button
      status="danger"
      :disabled="!candidates.length"
      @click="showTerminate = true"
    >
      {{ $t('common.operation.terminate') }}
    </a-button>
    <a-button
      type="outline"
      :disabled="!candidates.length"
      @click="showNotify = true"
    >
      <template #icon> <icon-plus /> </template>
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
      class="text-center"
      v-html="
        $t('candidate.switchStage', {
          num: `<span style='color: rgb(var(--arcoblue-6));'>${candidates.length}</span>`,
          cur: `<span style='color: rgb(var(--arcoblue-6));'>${$t(
            recruitSteps[stepInfo.cur].i18Key,
          )}</span>`,
          next: `<span style='color: rgb(var(--arcoblue-6));'>${$t(
            recruitSteps[stepInfo.next].i18Key,
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
      class="text-center"
      v-html="
        $t('candidate.terminate', {
          num: `<span style='color: rgb(var(--arcoblue-6));'>${candidates.length}</span>`,
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
      <a-form-item>
        <template #label>
          <div class="text-[--color-text-1]">
            {{ $t('candidate.receiver') }}
          </div>
        </template>
        <a-input-tag v-model="names" readonly />
      </a-form-item>
      <a-form-item field="content">
        <template #label>
          <div class="text-[--color-text-1]">
            {{ $t('common.operation.editContent') }}
          </div>
        </template>
        <div class="flex gap-2 justify-between w-full"
          ><a-select
            v-model:model-value="formData.content.stage"
            :trigger-props="{ autoFitPopupMinWidth: true }"
          >
            <a-option
              v-for="(item, index) in recruitSteps"
              :key="index"
              :value="index"
            >
              {{ $t(item.i18Key) }}
            </a-option>
          </a-select>
          <a-date-picker
            v-model="formData.content.date"
            class="min-w-fit"
            @change="changeDate"
          />
          <a-select
            v-model:model-value="formData.content.room"
            :trigger-props="{ autoFitPopupMinWidth: true }"
          >
            <a-option v-for="item in [808, 809, 810, 811]" :key="item">
              {{ item }}
            </a-option>
          </a-select></div
        >
      </a-form-item>
      <a-form-item field="content">
        <a-textarea v-model="formData.content.text" auto-size />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, PropType, computed } from 'vue';
import { recruitSteps } from '@/constants/team';
import { Candidate } from '../type';

const props = defineProps({
  candidates: {
    type: Array as PropType<Candidate[]>,
    default: () => [],
  },
  stepInfo: {
    type: Object as PropType<{ cur: number; next: number }>,
    default: () => ({}),
  },
});

const formData = ref({
  content: {
    stage: 0,
    date: '',
    room: '808',
    text: '[联创团队] {{候选人姓名}}你好，你通过了{{招新名称}}{{组别}}组笔试流程审核，请于{{!请指定时间!}}在{{!请指定地点!}}参加熬测流程，请务必准时到场。',
  },
});

const names = computed(() => props.candidates.map(({ name }) => name));
const changeDate = () => {
  console.log(names);
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

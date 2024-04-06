<template>
  <a-modal
    v-model:visible="showNotify"
    :title="$t('common.operation.notify')"
    :on-before-ok="handleNotify"
    :on-before-close="
      notifyFormRef?.resetFields(['time', 'place', 'rest', 'meeting_id'])
    "
    :width="isMobile ? '90%' : '600px'"
  >
    <a-form
      ref="notifyFormRef"
      :model="formData"
      layout="vertical"
      :rules="preview.rules"
    >
      <a-form-item>
        <!-- 收信人 -->
        <template #label>
          <span>{{ $t('candidate.receiver') }}</span>
          <span
            v-show="props.type === 'Reject'"
            class="text-[rgb(var(--danger-6))]"
            >{{ `(${$t('common.status.rejected')})` }}</span
          >
        </template>
        <a-input-tag
          :model-value="candidates.map(({ name }) => name)"
          readonly
        />
      </a-form-item>
      <div class="flex gap-2 justify-between w-full flex-col sm:flex-row">
        <a-form-item
          field="next"
          :label="$t('common.user.nextStage')"
          asterisk-position="end"
          validate-trigger="change"
        >
          <a-select v-model:model-value="formData.next">
            <a-option
              v-for="item in nextValidSteps"
              :key="item"
              :value="item"
              class="w-min"
              :title="$t(`common.steps.${item}`)"
              >{{ $t(`common.steps.${item}`) }}</a-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          field="time"
          :label="$t('common.time')"
          asterisk-position="end"
          validate-trigger="change"
        >
          <a-date-picker v-model="formData.time" show-time />
        </a-form-item>
        <a-form-item
          field="meeting_id"
          :label="$t('common.sms.meetingId')"
          asterisk-position="end"
          validate-trigger="change"
        >
          <a-input v-model="formData.meeting_id" />
        </a-form-item>
      </div>
      <div class="flex gap-2 justify-between w-full flex-col sm:flex-row">
        <a-form-item
          field="place"
          :label="$t('common.sms.place')"
          asterisk-position="end"
          validate-trigger="change"
        >
          <a-input v-model="formData.place" />
        </a-form-item>
        <a-form-item
          field="rest"
          :label="$t('common.sms.rest')"
          asterisk-position="end"
          validate-trigger="change"
        >
          <a-input v-model="formData.rest" />
        </a-form-item>
      </div>
      <div class="rounded-md border-2 px-4 py-3">
        <i18n-t :keypath="preview.i18nKey" tag="div">
          <template #name>
            <span class="text-[rgb(var(--primary-6))]">{{
              candidates[0]?.name || '{ }'
            }}</span>
          </template>
          <template #recruitment_name>
            <span class="text-[rgb(var(--primary-6))]">{{ recName }}</span>
          </template>
          <template #group>
            <span class="text-[rgb(var(--primary-6))]">{{ group }}</span>
          </template>
          <template #current>
            <span class="text-[rgb(var(--primary-6))]">{{
              $t(recruitSteps[props.curStep].i18Key)
            }}</span>
          </template>
          <template #next>
            <span class="text-[rgb(var(--primary-6))]">{{
              $t(`common.steps.${formData.next}`)
            }}</span>
          </template>
          <template #meeting_id>
            <span class="text-[rgb(var(--primary-6))]">{{
              formData.meeting_id || '{ }'
            }}</span>
          </template>
          <template #time>
            <span class="text-[rgb(var(--primary-6))]">{{
              formData.time || '{ }'
            }}</span>
          </template>
          <template #place>
            <span class="text-[rgb(var(--primary-6))]">{{
              formData.place || '{ }'
            }}</span>
          </template>
          <template #rest>
            <span v-if="formData.rest" class="text-[rgb(var(--primary-6))]">{{
              formData.rest
            }}</span>
            <i18n-t
              v-else-if="props.type === 'Accept'"
              :keypath="preview.restI18nKey"
              tag="span"
            >
              <template #next>
                <span class="text-[rgb(var(--primary-6))]">{{
                  $t(`common.steps.${formData.next}`)
                }}</span>
              </template>
              <template #time>
                <span class="text-[rgb(var(--primary-6))]">{{
                  formData.time || '{ }'
                }}</span>
              </template>
              <template #place>
                <span class="text-[rgb(var(--primary-6))]">{{
                  formData.place || '{ }'
                }}</span>
              </template>
              <template #group>
                <span class="text-[rgb(var(--primary-6))]">{{ group }}</span>
              </template>
            </i18n-t>
          </template>
        </i18n-t>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, defineModel, defineProps, PropType, watch, computed } from 'vue';
import { Group, recruitSteps, Step, SMSTemplate } from '@/constants/team';
import { sendSms } from '@/api';
import { groupBy, isMap } from 'lodash';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  candidates: {
    type: Array as PropType<
      {
        name: string;
        aid: string;
        step: Step;
      }[]
    >,
    required: true,
  },
  curStep: {
    type: Number,
    required: true,
  },
  type: {
    type: String as PropType<'Accept' | 'Reject'>,
    required: true,
  },
  recName: {
    type: String,
    required: true,
  },
  group: {
    type: String as PropType<Group>,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
});
const showNotify = defineModel<boolean>('showNotify', {
  type: Boolean,
  default: false,
  required: true,
});

const nextValidSteps = computed(() => {
  const arr: Step[] = [];
  recruitSteps
    .slice(props.curStep + 1)
    .forEach(({ value }) => arr.push(...value));
  return arr;
});
const formData = ref({
  next: nextValidSteps.value[0], // 下一步流程
  time: '', // 笔试/面试/熬测时间
  place: '', // 地点
  meeting_id: '', // 在线面试的会议id
  rest: '', // 补充信息
});
watch(nextValidSteps, () => {
  [formData.value.next] = nextValidSteps.value;
});

const preview = computed(() => {
  if (props.type === 'Reject')
    return {
      ...SMSTemplate[0],
      rules: {},
    };
  const template = SMSTemplate.find(({ match }) =>
    match.includes(formData.value.next),
  );
  return {
    ...template,
    rules: template
      ? Object.fromEntries(
          template.required.map((key) => [
            key,
            [{ required: !formData.value.rest || !template.restI18nKey }],
          ]),
        )
      : {},
  };
});

const notifyFormRef = ref<any>(null);

watch(
  () => formData.value.next,
  () => {
    notifyFormRef.value?.clearValidate();
  },
);

const handleNotify = async () => {
  const validateError = await notifyFormRef.value?.validate();
  if (validateError) return false;
  const res = groupBy(props.candidates, ({ step }) => step);
  const reqs = Object.entries(res).map(([current, arr]) => {
    const aids = arr.map(({ aid }) => aid);
    return sendSms({
      type: props.type,
      current: current as Step,
      ...formData.value,
      aids,
    });
  });
  await Promise.all(reqs);
  Message.success(t('common.result.sendSuccess'));
  notifyFormRef.value?.resetFields();
  return true;
};
</script>

<style scoped lang="less"></style>

<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('common.operation.createRecruitment')"
    :on-before-ok="sendForm"
    draggable
  >
    <a-space direction="vertical" size="mini">
      <a-form ref="recruitmentForm" :model="formData" layout="vertical">
        <a-form-item
          class="mt-8"
          field="rec_name"
          :label="$t('common.createRec.recName')"
        >
          <a-input
            v-model="formData.name"
            :placeholder="$t('common.createRec.inputRecName')"
          />
        </a-form-item>

        <a-form-item
          field="rec_time_range"
          :label="$t('common.createRec.recTimeRange')"
        >
          <a-range-picker
            v-model="timeRange1"
            show-time
            :time-picker-props="{ defaultValue: ['00:00:00', '00:00:00'] }"
            format="YYYY-MM-DD HH:mm"
            @ok="onOk1"
          />
        </a-form-item>

        <a-form-item
          field="signup_time_range"
          :label="$t('common.createRec.signupTimeRange')"
        >
          <a-range-picker
            v-model="timeRange2"
            show-time
            :time-picker-props="{ defaultValue: ['00:00:00', '00:00:00'] }"
            format="YYYY-MM-DD HH:mm"
            @ok="onOk2"
          />
        </a-form-item>
      </a-form>
    </a-space>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { createRecruitment } from '@/api';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
  required: true,
});

const formData = ref({
  name: '', // 招新名称
  beginning: '', // 招新起始时间
  deadline: '', // 报名结束时间
  start: '', // 报名开始时间
  end: '', // 招新结束时间
});

const form = ref({
  name: '',
  beginning: '',
  deadline: '',
  end: '',
});

const emit = defineEmits<{
  (e: 'recruitmentCreated'): void;
}>();

const timeRange1 = ref([]);
const timeRange2 = ref([]);

const formatName = (name: string) => {
  let normalizedName = name.trim();
  if (normalizedName.includes('春')) {
    normalizedName = normalizedName.replace(/春.*/, 'S');
  } else if (normalizedName.includes('夏')) {
    normalizedName = normalizedName.replace(/夏.*/, 'C');
  } else if (normalizedName.includes('秋')) {
    normalizedName = normalizedName.replace(/秋.*/, 'A');
  }
  return normalizedName;
};

const formValidate = () => {
  const errors: { [key: string]: string } = {};
  const originalName = formData.value.name;

  if (!originalName) {
    errors.name = t('common.createRec.nameRequired');
  }
  const formattedName = formatName(originalName);
  const nameRegex = /^\d{4}[SAC]$/;
  if (!nameRegex.test(formattedName)) {
    errors.name = t('common.createRec.nameFormat');
  }

  if (!formData.value.beginning || !formData.value.end) {
    errors.rec_time_range = t('common.createRec.recTimeRangeRequired');
  }

  if (!formData.value.start || !formData.value.deadline) {
    errors.signup_time_range = t('common.createRec.signupTimeRangeRequired');
  }

  if (
    formData.value.beginning &&
    formData.value.end &&
    formData.value.start &&
    formData.value.deadline
  ) {
    const endTime = new Date(formData.value.end).getTime(); // 招新结束时间
    const deadlineTime = new Date(formData.value.deadline).getTime(); // 报名结束时间

    if (deadlineTime >= endTime) {
      errors.signup_time_range = t(
        'common.createRec.signupEndTimeBeforeRecEndTime',
      );
    }
  }

  if (Object.keys(errors).length > 0) {
    Message.error(Object.values(errors).join('; '));
    return false;
  }

  formData.value.name = formattedName;
  return true;
};

const sendForm = async () => {
  try {
    const isValid = formValidate();
    if (!isValid) {
      return false;
    }
    form.value = { ...formData.value };
    const response = await createRecruitment(form.value);
    if (response.data) {
      console.log(response.data);
      Message.success(t('common.createRec.succeed'));
      emit('recruitmentCreated');
    }
    return true;
  } catch (error) {
    Message.error((error as any).message);
    return false;
  }
};

const onOk1 = (dateString: any, _date: any) => {
  formData.value.beginning = new Date(dateString[0]).toISOString(); // 招新开始时间
  formData.value.end = new Date(dateString[1]).toISOString(); // 招新结束时间
};

const onOk2 = (dateString: any, _date: any) => {
  formData.value.start = new Date(dateString[0]).toISOString(); // 报名开始时间
  formData.value.deadline = new Date(dateString[1]).toISOString(); // 报名结束时间
};
</script>

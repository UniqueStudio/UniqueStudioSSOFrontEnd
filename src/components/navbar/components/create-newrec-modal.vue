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
          :rules="[{ required: true, message: '请输入招新名称' }]"
        >
          <a-input
            v-model="formData.name"
            :placeholder="$t('common.createRec.inputRecName')"
          />
        </a-form-item>

        <a-form-item
          field="rec_time_range"
          :label="$t('common.createRec.recTimeRange')"
          :rules="[{ required: true, message: '请输入招新起止日期' }]"
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
          :rules="signupTimeRangeRules"
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
import { ref } from 'vue';
import { createRecruitment } from '@/api';

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
  required: true,
});

const formData = ref({
  name: '', // 招新名称
  beginning: '', // 招新起始时间
  deadline: '', // 报名结束时间
  end: '', // 招新结束时间
});

const recruitmentForm = ref();
const timeRange1 = ref([]);
const timeRange2 = ref([]);

const signupTimeRangeRules = [
  { required: true, message: '请输入报名起止日期' },
  {
    validator: (_rule: any, value: any) => {
      const [start, end] = value;
      const [recStart] = timeRange1.value;

      if (new Date(start).getTime() !== new Date(recStart).getTime()) {
        return Promise.reject(new Error('报名开始时间必须等于招新开始时间'));
      }
      if (new Date(end).getTime() > new Date(recStart).getTime()) {
        return Promise.reject(new Error('报名结束时间必须早于招新结束时间'));
      }
      return Promise.resolve();
    },
  },
];

const transToEN = (source: string) => {
  if (source?.includes('春')) {
    return source.replace(source.slice(4, source.length), 'S');
  }
  if (source?.includes('夏')) {
    return source.replace(source.slice(4, source.length), 'C');
  }
  if (source?.includes('秋')) {
    return source.replace(source.slice(4, source.length), 'A');
  }
  return '';
};

const sendForm = async () => {
  const form = recruitmentForm.value;
  try {
    await form.validate();
    formData.value.name = transToEN(formData.value.name);
    const response = await createRecruitment(formData.value);
    if (response.data) {
      console.log(response.data);
    }
  } catch (error) {
    console.error('Validation failed:', error);
  }
};

const onOk1 = (dateString: any, _date: any) => {
  // console.log('onOk: ', dateString);
  formData.value.beginning = new Date(dateString[0]).toISOString();
  formData.value.end = new Date(dateString[1]).toISOString();
};

const onOk2 = (dateString: any, _date: any) => {
  formData.value.deadline = new Date(dateString[1]).toISOString();
};
</script>

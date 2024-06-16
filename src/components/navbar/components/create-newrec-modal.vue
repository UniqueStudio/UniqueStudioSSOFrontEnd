<template>
  <a-modal
    v-model:visible="visible"
    :width="modalWidth"
    :title="$t('common.operation.createRecruitment')"
    :on-before-ok="sendForm"
    draggable
  >
    <a-space direction="vertical" size="mini">
      <a-form :model="formData" layout="vertical">
        <a-form-item
          class="mt-8"
          field="rec_name"
          :label="$t('common.createRec.recName')"
          validate-trigger="change"
        >
          <a-input
            v-model="formData.name"
            :placeholder="$t('common.createRec.inputRecName')"
          />
        </a-form-item>

        <a-form-item
          field="rec_time_range"
          :label="$t('common.createRec.recTimeRange')"
          validate-trigger="change"
        >
          <a-range-picker
            :width="modalWidth"
            show-time
            :time-picker-props="{ defaultValue: ['00:00:00', '00:00:00'] }"
            format="YYYY-MM-DD HH:mm"
            value="{timeRange1}"
            @ok="onOk1"
          />
        </a-form-item>

        <a-form-item
          field="signup_time_range"
          :label="$t('common.createRec.signupTimeRange')"
          validate-trigger="change"
        >
          <a-range-picker
            :width="modalWidth"
            show-time
            :time-picker-props="{ defaultValue: ['00:00:00', '00:00:00'] }"
            format="YYYY-MM-DD HH:mm"
            value="timeRange2"
            @ok="onOk2"
          />
        </a-form-item>
      </a-form>
    </a-space>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, defineModel } from 'vue';
import { createRecruitment } from '@/api';

const modalWidth = ref('auto');
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

const sendForm = async () => {
  const response = await createRecruitment(formData.value);
  if (response.data) {
    /* eslint-disable no-console */
    console.log('hello');
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onOk1 = (dateString: any, _date: any) => {
  // console.log('onOk: ', dateString);
  formData.value.beginning = new Date(dateString[0]).toISOString();
  formData.value.end = new Date(dateString[1]).toISOString();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onOk2 = (dateString: any, _date: any) => {
  formData.value.deadline = new Date(dateString[1]).toISOString();
  // console.log('formData: ', formData);
};
</script>

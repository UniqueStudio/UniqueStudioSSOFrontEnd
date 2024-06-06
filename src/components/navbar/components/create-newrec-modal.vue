<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('common.operation.createRecruitment')"
    :on-before-ok="sendForm"
  >
    <a-space direction="vertical" size="mini">
      <a-form :model="formData" layout="vertical">
        <a-form-item
          field="rec_name"
          :label="$t('common.createRec.recName')"
          validate-trigger="change"
        >
          <a-input
            v-model="formData.name"
            style="width: 400px; margin: 0 24px 24px 0"
            :placeholder="$t('common.createRec.inputRecName')"
          />
        </a-form-item>

        <a-form-item
          field="rec_time_range"
          :label="$t('common.createRec.recTimeRange')"
          validate-trigger="change"
        >
          <a-range-picker
            style="width: 400px; margin: 0 24px 24px 0"
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
            style="width: 400px; margin: 0 24px 24px 0"
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
  // if (response) console.log(response);
  // else console.log('error');
};

const onOk1 = (dateString: any, _date: any) => {
  // console.log('onOk: ', dateString);
  formData.value.beginning = new Date(dateString[0]).toISOString();
  formData.value.end = new Date(dateString[1]).toISOString();
};

const onOk2 = (dateString: any, _date: any) => {
  formData.value.deadline = new Date(dateString[1]).toISOString();
  // console.log('formData: ', formData);
};
</script>

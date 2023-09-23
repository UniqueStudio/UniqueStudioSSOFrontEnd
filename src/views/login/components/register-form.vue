<template>
  <a-form ref="registerForm" :model="registerFormInfo" layout="vertical">
    <a-form-item
      field="name"
      hide-label
      :rules="[{ required: true, message: $t('register.form.name.errMsg') }]"
    >
      <a-input
        v-model="registerFormInfo.name"
        size="large"
        :placeholder="$t('register.form.name')"
        allow-clear
      >
        <template #prefix>
          <icon-user />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      field="gender"
      hide-label
      :rules="[{ required: true, message: $t('register.form.gender.errMsg') }]"
    >
      <a-select
        v-model="<number>registerFormInfo.gender"
        size="large"
        :placeholder="$t('register.form.gender.placeholder')"
        allow-clear
      >
        <template #prefix>
          <icon-user-group />
        </template>
        <a-option :value="Gender.male">男</a-option>
        <a-option :value="Gender.female">女</a-option>
        <a-option :value="Gender.other">其它</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="phoneNumber"
      hide-label
      :rules="[
        { required: true, message: $t('login.form.phoneNumber.errMsg') },
        {
          match: /^1[3-9]\d{9}$/,
          message: $t('login.form.phoneNumber.formatErr'),
        },
      ]"
    >
      <a-input
        v-model="registerFormInfo.phoneNumber"
        size="large"
        :placeholder="$t('register.form.phoneNumber')"
        allow-clear
      >
        <template #prefix>
          <icon-phone />
        </template>
      </a-input>
      <a-button
        type="primary"
        size="large"
        :disabled="isSendValidateCode"
        class="w-[160px]"
        @click="handleValidateCode(registerForm)"
        >{{ buttonContent }}</a-button
      >
    </a-form-item>
    <a-form-item
      field="email"
      hide-label
      :rules="[
        { required: true, message: $t('login.form.email.errMsg') },
        {
          match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: $t('login.form.email.formatErr'),
        },
      ]"
    >
      <a-input
        v-model="registerFormInfo.email"
        size="large"
        :placeholder="$t('register.form.email')"
        allow-clear
      >
        <template #prefix>
          <Icon-email />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      field="password"
      hide-label
      :rules="[
        { required: true, message: $t('login.form.password.errMsg') },
        { minLength: 6, message: $t('login.form.password.minLength') },
      ]"
    >
      <a-input-password
        v-model="registerFormInfo.password"
        size="large"
        :placeholder="$t('register.form.password')"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item
      field="validateCode"
      hide-label
      :validate-trigger="['change', 'blur']"
      :rules="[
        { required: true, message: $t('register.form.validateCode.errMsg') },
      ]"
    >
      <a-input
        v-model="registerFormInfo.validateCode"
        size="large"
        :placeholder="$t('register.form.validateCode')"
        allow-clear
      >
        <template #prefix>
          <icon-safe />
        </template>
      </a-input>
    </a-form-item>
  </a-form>
  <a-button
    type="primary"
    long
    size="large"
    @click="handleRegister(registerForm)"
    >{{ $t('register.form.register') }}</a-button
  >
  <a-button type="text" long class="mt-2" @click="setIsRegister(false)">{{
    $t('register.form.login')
  }}</a-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

// type
import { Gender } from '../type';
// store
import { useLoginStore, useRegisterStore } from '../store';

// 绑定 a-form
const registerForm = ref(null);

const loginStore = useLoginStore();
const { setIsRegister } = loginStore;

const registerStore = useRegisterStore();
const { handleRegister, handleValidateCode } = registerStore;
const { registerFormInfo, isSendValidateCode, buttonContent } =
  storeToRefs(registerStore);
</script>

<style lang="less" scoped>
// 修改arcodesign-tabs原生样式
:deep(.arco-tabs-nav-tab-list) {
  width: 100%;
  .arco-tabs-tab {
    width: 50%;
    margin: 0;
    justify-content: center;
  }
}
</style>

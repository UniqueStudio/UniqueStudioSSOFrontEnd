<template>
  <a-tabs
    v-model:active-key="loginMethod"
    :default-active-key="LoginMethod.phone"
    size="large"
  >
    <a-tab-pane :key="LoginMethod.phone" title="手机号">
      <a-form ref="phoneLoginRef" :model="loginFormInfo" layout="vertical">
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
            v-model="loginFormInfo.phoneNumber"
            size="large"
            :placeholder="$t('login.form.phoneNumber.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-phone />
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
            v-model="loginFormInfo.password"
            size="large"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-tab-pane>
    <a-tab-pane :key="LoginMethod.email" title="邮箱">
      <a-form ref="emailLoginRef" :model="loginFormInfo" layout="vertical">
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
            v-model="loginFormInfo.email"
            size="large"
            :placeholder="$t('login.form.email.placeholder')"
            allow-clear
          >
            <template #prefix>
              <IconEmail />
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
            v-model="loginFormInfo.password"
            size="large"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-tab-pane>
  </a-tabs>
  <div class="flex justify-between w-full">
    <a-checkbox checked="rememberPassword">{{
      $t('login.form.rememberPassword')
    }}</a-checkbox>
    <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
  </div>
  <a-button
    type="primary"
    long
    size="large"
    class="mt-4"
    @click="handleLogin(phoneLoginRef, emailLoginRef)"
    >{{ $t('login.form.login') }}</a-button
  >
  <a-button type="text" long class="mt-2" @click="setIsRegister(true)">{{
    $t('login.form.register')
  }}</a-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
// type
import { LoginMethod } from '../type';
// store
import { useLoginStore } from '../store';

const loginStore = useLoginStore();
const { setIsRegister, handleLogin } = loginStore;
const { loginFormInfo, loginMethod } = storeToRefs(loginStore);

const phoneLoginRef = ref(null);
const emailLoginRef = ref(null);
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

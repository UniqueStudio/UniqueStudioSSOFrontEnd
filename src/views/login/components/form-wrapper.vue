<template>
  <div class="login-wrapper">
    <div class="login-form-body flex flex-col justify-center items-center">
      <div class="login-form-title mb-4">{{ $t('login.form.title') }}</div>
      <a-popover position="right">
        <div class="login-form-sub-title mb-4">{{ '什么是sso系统' }}</div>
      </a-popover>
      <login-form v-if="!isRegister" />
      <register-form v-if="isRegister" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
// components
import loginForm from './login-form.vue';
import registerForm from './register-form.vue';
// store
import { useLoginStore } from '../store';

const loginStore = useLoginStore();
const { isRegister } = storeToRefs(loginStore);
</script>

<style lang="less" scoped>
.login-wrapper {
  border: 1px solid var(--color-border-1);
  border-radius: 8px;
  box-shadow:
    rgba(22, 14, 45, 0.02) 0px 0px 40px,
    rgba(22, 14, 45, 0.06) 0px 0px 104px;

  .login-form {
    &-body {
      //height: 520px;
      width: 440px;
      padding: 48px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 28px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-password-actions {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

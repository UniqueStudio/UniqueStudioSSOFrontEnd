<template>
  <div class="login-container flex justify-center items-center">
    <form-wrapper />
  </div>
</template>

<script setup lang="ts">
import formWrapper from './components/form-wrapper.vue';
</script>

<style scoped lang="less">
.login-container {
  height: 100vh;
  width: 100vw;
}
</style>

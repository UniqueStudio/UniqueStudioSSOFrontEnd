<template>
    <a-result status="403" :subtitle="$t('noPermission.subtitle')" class="h-screen flex flex-col justify-center">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="returnLogin">{{ $t('noPermission.back') }}</a-button>
        </a-space>
      </template>
    </a-result>
</template>

<script setup lang="ts">
import useUserStore from '@/store/module/user';
const userStore = useUserStore();
const { returnLogin } = userStore;
</script>

<style scoped lang="less">
</style>
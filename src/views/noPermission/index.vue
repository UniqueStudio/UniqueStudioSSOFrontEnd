<template>
  <a-result
    status="403"
    :subtitle="$t('noPermission.subtitle')"
    class="h-screen flex flex-col justify-center"
  >
    <template #icon>
      <NoPermissionSVG />
    </template>
    <template #extra>
      <a-space>
        <a-button type="primary" @click="returnLogin">{{
          $t('noPermission.back')
        }}</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import NoPermissionSVG from '@/assets/svg/no-permission.svg';

const userStore = useUserStore();
const { returnLogin } = userStore;
</script>

<style scoped lang="less">
:deep(.arco-result-icon-tip) {
  width: auto;
  height: auto;
}
</style>

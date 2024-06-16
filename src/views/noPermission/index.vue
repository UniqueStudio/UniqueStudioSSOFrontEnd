<template>
  <a-result
    status="403"
    :subtitle="$t('noPermission.subtitle')"
    class="h-screen flex flex-col justify-center pb-40"
  >
    <template #icon>
      <NoPermissionSVG class="max-w-[min(404px,90%)]" />
    </template>
  </a-result>
</template>

<script setup lang="ts">
import NoPermissionSVG from '@/assets/svg/no-permission.svg';
</script>

<style scoped lang="less">
:deep(.arco-result-icon-tip) {
  width: auto;
  height: auto;
}
</style>

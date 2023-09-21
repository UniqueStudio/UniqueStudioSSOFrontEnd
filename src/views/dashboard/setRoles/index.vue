<template>
  <div class="container">
    <Breadcrumb :items="['menu.dashboard', 'menu.dashboard.setRoles']" />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/components/breadcrumb/index.vue';
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  margin-bottom: 20px;
}
</style>

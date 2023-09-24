<template>
  <div class="detail-wrapper"> {{ 'detail' + $route.params.id }} </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.detail-wrapper {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: hidden;
}
</style>

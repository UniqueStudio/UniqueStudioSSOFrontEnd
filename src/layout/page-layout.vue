<template>
  <router-view v-slot="{ Component, route }">
    <div class="p-5 h-full max-h-full">
      <component :is="Component" :key="route.fullPath"
    /></div>
  </router-view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>

<template>
  <router-view v-slot="{ Component, route }">
    <div class="p-5 h-full max-h-full relative">
      <keep-alive exclude="detail">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </div>
  </router-view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>

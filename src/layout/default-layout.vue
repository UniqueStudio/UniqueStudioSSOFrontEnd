<template>
  <a-layout class="fixed top-0 left-0 right-0 bottom-0 items-stretch">
    <NavBar class="w-full h-[60px] shrink-0" />
    <a-layout class="overflow-hidden">
      <a-layout-sider
        v-if="renderMenu"
        :width="menuWidth"
        class="layout-sider hidden sm:block"
      >
        <div class="menu-wrapper">
          <Menu />
        </div>
      </a-layout-sider>
      <a-layout class="bg-[--color-fill-2]">
        <a-layout-content class="">
          <page-layout />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, onMounted } from 'vue';
import { useAppStore } from '@/store';
import NavBar from '@/components/navbar/index.vue';
import Menu from '@/components/menu/index.vue';
import PageLayout from './page-layout.vue';

const appStore = useAppStore();
const navbarHeight = `60px`;
const navbar = computed(() => appStore.navbar);
const hideMenu = computed(() => appStore.hideMenu);
const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
const menuWidth = computed(() => {
  // 48是左侧菜单收起的宽度
  return appStore.menuCollapse ? 48 : appStore.menuWidth;
});
</script>

<style scoped lang="less">
@nav-size-height: 60px;

.layout-navbar {
  width: 100%;
  height: @nav-size-height;
}

.menu-wrapper {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  // :deep(.arco-menu) {
  //   ::-webkit-scrollbar {
  //     width: 12px;
  //     height: 4px;
  //   }

  //   ::-webkit-scrollbar-thumb {
  //     border: 4px solid transparent;
  //     background-clip: padding-box;
  //     border-radius: 7px;
  //     background-color: var(--color-text-4);
  //   }

  //   ::-webkit-scrollbar-thumb:hover {
  //     background-color: var(--color-text-3);
  //   }
  // }
}

.layout-content {
  min-height: 100vh;
  overflow-y: hidden;
  background-color: var();
  //transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
</style>

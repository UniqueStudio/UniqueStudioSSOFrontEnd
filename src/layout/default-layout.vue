<template>
  <a-layout class="h-full w-full">
    <div class="layout-navbar">
      <NavBar />
    </div>
    <a-layout>
      <a-layout-sider
        v-if="renderMenu"
        :width="menuWidth"
        class="layout-sider"
        :style="{ paddingTop: navbar ? navbarHeight : '' }"
      >
        <div class="menu-wrapper">
          <Menu />
        </div>
      </a-layout-sider>
      <a-layout class="layout-content" :style="pagePaddingStyle">
        <a-layout-content>
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
const pagePaddingStyle = computed(() => {
  const paddingLeft =
    renderMenu.value && !hideMenu.value
      ? { paddingLeft: `${menuWidth.value}px` }
      : {};
  const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
  return { ...paddingLeft, ...paddingTop };
});
</script>

<style scoped lang="less">
@nav-size-height: 60px;

.layout-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: @nav-size-height;
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  // &::after {
  //   position: absolute;
  //   top: 0;
  //   right: -1px;
  //   display: block;
  //   width: 1px;
  //   height: 100%;
  //   background-color: var(--color-border);
  //   content: '';
  // }

  // > :deep(.arco-layout-sider-children) {
  //   overflow-y: hidden;
  // }
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
  background-color: var(--color-fill-2);
  //transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
</style>

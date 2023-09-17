<template>
  <div class="navbar">
    <div class="left-side">
      <LogoSVG />
    </div>
    <ul class="right-side">
      <li>
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
          >
            B
          </a-avatar>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import LogoSVG from '@/assets/svg/logo.svg';
</script>

<style scoped lang="less">
@nav-size-height: 60px;

.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}
.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.right-side {
  display: flex;
  align-items: center;
  padding-right: 20px;
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
}
</style>

<template>
  <a-select
    v-model="currentGroup"
    class="text-[rgb(var(--primary-6))] text-right lg:hidden flex w-24"
    :bordered="false"
  >
    <a-option v-for="item in groups" :key="item.val" :value="item.val">{{
      item.label
    }}</a-option>
  </a-select>
  <!-- 移动端 -->

  <a-radio-group
    v-model="currentGroup"
    class="pl-5 bg-[--color-bg-2] hidden lg:flex"
  >
    <template v-for="(item, index) in groups" :key="item.val">
      <a-radio :value="item.val">
        <template #radio="{ checked }">
          <span
            :class="[
              'hover:text-[rgb(var(--primary-5))]',
              checked
                ? 'text-[rgb(var(--primary-6))]'
                : 'text-[--color-text-1]',
              index && 'team-group-radio-item',
            ]"
            >{{ item.label }}</span
          >
        </template>
      </a-radio>
    </template>
  </a-radio-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Group } from '@/constants/team';

const groups = computed(() =>
  Object.entries(Group)
    .filter(([_, val]) => val !== Group.Unique)
    .map(([label, val]) => ({ label, val })),
);

const currentGroup = defineModel<Group>({
  required: true,
});
</script>

<style lang="less">
.team-group-radio-item::before {
  position: absolute;
  top: 50%;
  left: -9px;
  display: block;
  width: 2px;
  height: 12px;
  background-color: var(--color-fill-3);
  transform: translateY(-50%);
  content: '';
}
</style>

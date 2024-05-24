<template>
  <a-radio-group v-model="currentGroup" class="bg-[--color-bg-1]">
    <template v-for="(item, index) in groups" :key="item">
      <a-radio :value="item">
        <template #radio="{ checked }">
          <span
            :class="[
              'hover:text-[rgb(var(--primary-5))]',
              checked && 'text-[rgb(var(--primary-6))]',
              index && 'team-group-radio-item',
            ]"
            >{{ item }}</span
          >
        </template>
      </a-radio>
    </template>
  </a-radio-group>
</template>

<script setup lang="ts">
import { defineModel, computed } from 'vue';
import { Group } from '@/constants/team';

const groups = computed(() =>
  Object.values(Group).filter((x) => x !== Group.Unique),
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

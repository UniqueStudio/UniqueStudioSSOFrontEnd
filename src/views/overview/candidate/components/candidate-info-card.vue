<template>
  <div class="flex">
    <a-card class="w-80" title="Arco Card" hoverable>
      <template #title>
        <div class="flex justify-start gap-2">
          <a-avatar class="card-avatar" :size="22">
            {{ info.avatar || info.name }}
          </a-avatar>
          <a-typography-text>{{ info.name }}</a-typography-text>
          <a-tag color="red">{{ info.status }}</a-tag>
        </div>
      </template>
      <template #extra>
        <a-checkbox :value="info.id"></a-checkbox>
      </template>
      Card content <br />
      Card content
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Candidate } from '../type';

defineProps({
  info: {
    type: Object as PropType<Candidate>,
    default: () => ({}),
  },
  checked: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="less">
.card-avatar {
  background-color: rgb(var(--arcoblue-6));
}
</style>

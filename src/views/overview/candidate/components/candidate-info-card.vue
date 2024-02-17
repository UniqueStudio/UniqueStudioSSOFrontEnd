<template>
  <div class="flex">
    <a-card
      class="w-full"
      :class="{ 'bg-[#f0f5ff]': checked }"
      title="Arco Card"
      size="small"
      hoverable
      :header-style="{ height: 'auto' }"
    >
      <template #title>
        <div class="flex justify-between">
          <div class="flex justify-start gap-2 items-center">
            <a-link :href="`candidate/detail/${info.uid}`">
              <a-avatar class="bg-[rgb(var(--primary-6))] mr-2" :size="24">
                {{
                  info.user_detail?.avatar_url || info.user_detail?.name || ''
                }}
              </a-avatar>
              <a-typography-text class="text-lg">
                {{ info.user_detail?.name || '' }}
              </a-typography-text>
            </a-link>
            <a-tag v-if="info.rejected" color="red">{{
              $t('common.status.rejected')
            }}</a-tag>
            <a-tag v-if="info.abandoned" color="gray">{{
              $t('common.status.abandoned')
            }}</a-tag>
          </div>
          <a-checkbox :value="info.uid"></a-checkbox>
        </div>

        <div class="flex justify-between text-xs pt-3">
          <div>
            <span class="text-[--color-text-3] pr-1.5">{{
              $t('common.user.gender')
            }}</span>
            <span>{{ $t(GenderMap[info.user_detail?.gender ?? 0]) }}</span>
          </div>
          <div>
            <span class="text-[--color-text-3] pr-1.5">{{
              $t('common.user.grade')
            }}</span>
            <span>{{ info.grade }}</span>
          </div>
          <div>
            <span class="text-[--color-text-3] pr-1.5">{{
              $t('common.user.institute')
            }}</span>
            <span>{{ info.institute }}</span>
          </div>
        </div>
      </template>
      <div class="flex justify-between">
        <div class="flex gap-2">
          <template v-for="(item, index) in EvaluationMap">
            <a-tag
              v-if="info.comments?.[index].length"
              :key="item"
              color="gray"
              class="text-xs rounded-full px-2.5"
            >
              <template #icon> {{ item }} </template>
              {{ info.comments?.[index].length }}
            </a-tag>
          </template>
        </div>
        <a-tag
          color="transparent"
          style="color: var(--color-text-3)"
          class="text-xs rounded px-1.5 py-1 bg-transparent"
        >
          <template #icon> <icon-message /> </template>
          {{
            `${info.comments?.reduce((res, x) => res + x.length, 0) ?? 0}条评论`
          }}
        </a-tag>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { CandidateInfo } from '@/store/modules/recruitment/types';
import { EvaluationMap, GenderMap } from '@/constants/team';

defineProps({
  info: {
    type: Object as PropType<CandidateInfo>,
    default: () => ({}),
  },
  checked: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="less"></style>

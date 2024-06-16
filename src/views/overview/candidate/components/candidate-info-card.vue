<template>
  <div class="flex h-min">
    <a-card
      class="w-full h-min"
      :class="{ 'bg-[#f0f5ff]': checked }"
      title="Arco Card"
      size="small"
      hoverable
      :header-style="{ height: 'auto' }"
    >
      <template #title>
        <div class="flex justify-between w-full">
          <div
            style="scrollbar-width: none"
            class="flex justify-start gap-2 items-center overflow-y-auto"
          >
            <a-link
              @click="router.push({ path: `candidate-detail/${info.uid}` })"
            >
              <a-avatar class="bg-[rgb(var(--primary-6))] mr-2" :size="24">
                {{
                  info.user_detail?.avatar_url || info.user_detail?.name || ''
                }}
              </a-avatar>
              <a-typography-text class="sm:text-sm md:text-md lg:text-lg">
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
          <template v-for="[item, cnt] in EvaluationCnt" :key="item">
            <a-tag v-if="cnt" color="gray" class="text-xs rounded-full px-2.5">
              <template #icon> {{ item }} </template>
              {{ cnt }}
            </a-tag>
          </template>
        </div>
        <a-link :href="`candidate/detail/${info.uid}`">
          <a-tag
            color="transparent"
            style="color: var(--color-text-3)"
            class="text-xs rounded px-1.5 py-1 bg-transparent"
          >
            <template #icon> <icon-message /> </template>
            {{ `${info.comments?.length ?? 0}条评论` }}
          </a-tag>
        </a-link>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { CandidateInfo } from '@/store/modules/recruitment/types';
import { EvaluationMap, GenderMap } from '@/constants/team';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  info: {
    type: Object as PropType<CandidateInfo>,
    default: () => ({}),
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const EvaluationCnt = computed(() =>
  EvaluationMap.slice(1).map((x, i) => [
    x,
    props.info.comments?.filter(({ evaluation }) => evaluation === i)?.length ??
      0,
  ]),
);
</script>

<style scoped lang="less"></style>

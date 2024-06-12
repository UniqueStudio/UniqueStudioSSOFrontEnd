<template>
  <div class="flex flex-col h-full">
    <div>
      <a-button class="pl-1 pr-2" @click="show = false">
        <icon-left />
        {{ $t('common.operation.returnInterviewManagement') }}
      </a-button>
    </div>
    <div class="bg-[--color-bg-2] w-full sm:p-5 py-3 px-5">
      <div class="flex flex-row justify-between">
        <div class="text-[--color-text-1] text-xl">{{
          $t('common.operation.dateManagement')
        }}</div>
        <team-group-radio v-model="currentGroup"></team-group-radio>
      </div>
    </div>
    <div class="arco-scrollbar-container overflow-auto h-full">
      <div class="flex flex-row flex-wrap mt-4 mb-8">
        <div
          v-for="info in infos"
          :key="info.uid"
          class="flex flex-col bg-[--color-bg-2] p-4 mb-4 sm:mr-6 sm:w-[30%] w-full h-48"
        >
          <div class="overflow-hidden flex items-center mb-1">
            <icon-calendar
              class="w-10 h-10 text-xl rounded-full p-2.5 bg-[rgb(var(--arcoblue-1))] text-[rgb(var(--arcoblue-6))] float-left mr-2.5"
            />
            <span class="float-left text-[--color-text-1]">{{
              info.name
            }}</span>
          </div>
          <!-- 组别 -->
          <div class="overflow-hidden flex items-center">
            <icon-calendar
              class="w-10 h-10 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              getDate(info.start)
            }}</span>
          </div>
          <!-- 日期 -->
          <div class="overflow-hidden flex items-center">
            <icon-clock-circle
              class="w-10 h-10 text-xl p-2 float-left mr-2.5 text-gray-500"
            />
            <span class="float-left leading-10 text-slate-500">{{
              getTime(info.start, info.end)
            }}</span>
          </div>
          <!-- 时间 -->
          <a-button
            type="dashed"
            class="mt-1"
            @click="
              showComfirmDelete = true;
              delInterviewId = info.uid;
            "
          >
            <template #icon>
              <icon-delete />
            </template>
            <template #default>Delete</template>
          </a-button>
          <!-- 删除 -->
        </div>
      </div>
    </div>

    <a-button
      type="outline"
      class="sm:w-auto absolute sm:bottom-10 bottom-3 sm:right-10 right-5"
      @click="showAddDate = true"
    >
      <template #icon> <icon-plus /> </template>
      {{ $t('common.operation.addDate') }}
    </a-button>
    <!-- 添加日程 -->

    <add-date-modal
      v-model:visible="showAddDate"
      :current-group-start="currentGroup"
    />

    <a-modal
      v-model:visible="showComfirmDelete"
      :title="$t('common.operation.deleteDate')"
      @before-ok="comfirmDelOk"
    >
      <p>{{ $t('common.operation.comfirmDeleteDate') }}</p>
    </a-modal>
    <!-- 确认删除日程 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineModel } from 'vue';
import { Group } from '@/constants/team';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import { getDate, getTime } from '@/views/interview/management/getData';
import useRecruitmentStore from '@/store/modules/recruitment';
import { deleteInterview } from '@/api';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import AddDateModal from './add-date-modal.vue';

const currentGroup = ref(Group.Web);
const showAddDate = ref(false);
const showComfirmDelete = ref(false);
const delInterviewId = ref('');
const recStore = useRecruitmentStore();
const { t } = useI18n();

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false,
  required: true,
});

const infos = computed(() => {
  return (
    recStore.curInterviews
      .filter((item) => item.name === currentGroup.value)
      .sort((info1, info2) => (info1.start > info2.start ? 1 : -1)) ?? []
  );
});

const comfirmDelOk = () => {
  if (delInterviewId.value) {
    deleteInterview(recStore.currentRid, currentGroup.value, [
      { iid: delInterviewId.value },
    ]).then((res) => {
      if (res) Message.success(t('common.result.deleteInterviewSuccess'));
      recStore.refresh();
    });
  }
  return true;
};

onMounted(() => {
  recStore.refresh();
});
</script>

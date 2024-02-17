<template>
  <div class="bg-white w-full h-full p-5">
    <div class="text-[--color-text-1] text-xl pb-5">{{
      $t('menu.overview.candidate')
    }}</div>
    <div class="flex justify-between w-full">
      <a-tabs
        v-model:active-key="interviewType"
        class="w-full"
        type="rounded"
        size="medium"
      >
        <template #extra>
          <team-group-radio v-model="currentGroup"></team-group-radio>
        </template>
        <a-tab-pane
          v-for="item in tabItems"
          :key="item.key"
          :title="$t(item.title)"
        >
          <div class="flex justify-between pb-5">
            <a-input-search
              class="w-80"
              :placeholder="$t('common.operation.searchByName')"
            />
            <a-button type="outline" @click="showNotify = true">
              <template #icon> <icon-plus /> </template>
              {{ $t('common.operation.sendNotification') }}
            </a-button>
          </div>

          <a-table
            v-model:selectedKeys="selectedKeys"
            row-key="name"
            :columns="item.columns"
            :data="data"
            :row-selection="{
              type: 'checkbox',
              showCheckedAll: true,
              onlyCurrent: false,
            }"
            :pagination="{
              pageSize: 10,
            }"
          >
            <template #columns>
              <a-table-column
                v-for="col in item.columns"
                :key="col.title"
                :title="$t(col.title)"
                :data-index="col.dataIndex"
              ></a-table-column>
              <a-table-column :title="$t('common.operation.operate')">
                <template #cell="{ record }">
                  <a-button
                    type="text"
                    @click="
                      $modal.info({ title: 'Name', content: record.name })
                    "
                    >{{ $t('common.operation.allocate') }}</a-button
                  >
                  <a-button type="text" @click="showNotify = true">{{
                    $t('common.operation.notify')
                  }}</a-button>
                </template></a-table-column
              >
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <notification-modal
    v-model:showNotify="showNotify"
    :candidates="[]"
    :cur-step="0"
    :rec-name="recStore.currentRec?.name ?? ''"
    :type="'Accept'"
    :group="Group.Web"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Group } from '@/constants/team';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import NotificationModal from '@/views/components/notification-modal.vue';

import useRecruitmentStore from '@/store/modules/recruitment';

const recStore = useRecruitmentStore();

const interviewType = ref('组面');
const currentGroup = ref(Group.Web);
const selectedKeys = ref([]);
const showNotify = ref(false);

const data = ref([
  {
    name: 'aaa',
    salary: 'bbb',
  },
]);

const tabItems = [
  {
    key: '组面',
    title: 'common.user.baseInfo',
    columns: [
      {
        title: 'common.user.name',
        dataIndex: 'name',
      },
      {
        title: 'common.user.interviewTime',
        dataIndex: 'salary',
      },
    ],
  },
  {
    key: '群面',
    title: 'common.user.baseInfo',
    columns: [
      {
        title: 'common.user.name',
        dataIndex: 'name',
      },
      {
        title: 'common.user.interviewTime',
        dataIndex: 'salary',
      },
    ],
  },
];
</script>

<style scoped lang="less"></style>

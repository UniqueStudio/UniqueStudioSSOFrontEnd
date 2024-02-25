<template>
  <div class="bg-white w-full h-full p-5">
    <div class="text-[--color-text-1] text-xl pb-5">{{
      $t('menu.interview.management')
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
        <!-- 组别 -->
        <a-tab-pane
          v-for="item in tabItems"
          :key="item.key"
          :title="$t(item.title)"
        >
          <!-- 组面 or 群面 -->
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
            :data="data[item.title]"
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
                v-for="col in columns"
                :key="col.title"
                :title="$t(col.title)"
                :data-index="col.dataIndex"
                :sortable="col.sortable"
              ></a-table-column>
              <!-- 除操作状态外的其他column -->

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
                </template>
              </a-table-column>
              <!-- 操作column -->
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

const data = ref({
  'common.steps.GroupInterview': [
    {
      name: 'aaa',
      interviewTime: '111',
    },
    {
      name: 'bbb',
      interviewTime: '121',
    },
  ],
  'common.steps.TeamInterview': [],
});

const tabItems = [
  {
    key: '组面',
    title: 'common.steps.GroupInterview',
  },
  {
    key: '群面',
    title: 'common.steps.TeamInterview',
  },
];

const columns = [
  {
    title: 'common.user.name',
    dataIndex: 'name',
  },
  {
    title: 'common.user.interviewTime',
    dataIndex: 'interviewTime',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
];

document.cookie =
  'SSO_SESSION=unique_web_admin; domain=hustunique.com; Expires=Fri, 31 Dec 9999 23:59:59 GMT; Max-Age=1440000000; Secure';
</script>

<style scoped lang="less"></style>

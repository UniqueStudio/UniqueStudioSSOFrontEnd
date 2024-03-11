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
              v-model="searchValue"
              class="w-80"
              :placeholder="$t('common.operation.searchByName')"
            />
            <!-- 搜索框 -->
            <a-button type="outline" @click="showNotify = true">
              <template #icon> <icon-plus /> </template>
              {{ $t('common.operation.sendNotification') }}
            </a-button>
            <!--  发送通知 -->
          </div>

          <a-table
            v-model:selectedKeys="selectedKeys"
            row-key="name"
            :data="data[item.title + '_' + currentGroup]"
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
                :sortable="col.sortable as TableSortable"
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
  <!-- 发送通知 -->
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Group } from '@/constants/team';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import NotificationModal from '@/views/components/notification-modal.vue';

import useRecruitmentStore from '@/store/modules/recruitment';

import { TableData, TableSortable } from '@arco-design/web-vue';
import { getApplicationData } from './getData';

document.cookie = 'SSO_SESSION=unique_web_admin;';

const recStore = useRecruitmentStore();

const interviewType = ref('组面');
const currentGroup = ref(Group.Web);
const selectedKeys = ref([]);
const showNotify = ref(false);
const searchValue = ref('');

type Data = {
  [key: string]: TableData[];
};
const realData = ref({} as Data);
const data = ref({} as Data);
getApplicationData().then((res) => {
  // console.log(res);
  realData.value = res;
  data.value = JSON.parse(JSON.stringify(realData.value));
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

// 搜索名字
watch(searchValue, (val) => {
  // console.log("newSearchValue", val);
  // console.log(realData.value);
  const stepTitle =
    interviewType.value === '群面'
      ? 'common.steps.TeamInterview'
      : 'common.steps.GroupInterview';
  const key = `${stepTitle}_${currentGroup.value}`;
  data.value[key] = realData.value[key].filter((item) => {
    return item.name.includes(val);
  });
});
</script>

<style scoped lang="less"></style>

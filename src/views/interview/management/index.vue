<template>
  <div v-if="!showDateManagement" class="bg-[--color-bg-1] w-full h-full p-5">
    <div class="text-[--color-text-1] text-xl pb-5 hidden sm:flex">{{
      $t('menu.interview.management')
    }}</div>
    <div class="flex flex-col justify-between w-full h-full sm:pb-6">
      <div class="flex justify-between pb-5">
        <a-select
          v-model="displayType"
          class="sm:hidden flex"
          :bordered="false"
        >
          <a-option v-for="item in displayTypeItems" :key="item" :value="item">
            {{ $t(item) }}
          </a-option>
        </a-select>
        <!-- 移动端 选择显示类型 信息or操作 -->

        <a-select
          v-model="interviewType"
          class="sm:hidden flex"
          :bordered="false"
        >
          <a-option v-for="item in tabItems" :key="item" :value="item">
            {{ $t(item) }}
          </a-option>
        </a-select>
        <!-- 移动端 选择面试类别 -->

        <a-radio-group v-model="interviewType" class="hidden sm:flex">
          <a-radio v-for="item in tabItems" :key="item" :value="item">
            <template #radio="{ checked }">
              <a-tag
                :checked="checked"
                checkable
                size="large"
                :class="
                  checked
                    ? 'px-5 rounded-full text-[rgb(var(--primary-6))]'
                    : 'px-5 rounded-full'
                "
                >{{ $t(item) }}</a-tag
              >
            </template>
          </a-radio>
        </a-radio-group>
        <!-- PC端 选择面试类别 -->

        <team-group-radio v-model="currentGroup"></team-group-radio>
        <!-- 选择组 -->
      </div>

      <div class="flex justify-between pb-5">
        <a-input-search
          v-model="searchValue"
          class="sm:w-80 w-1/2 mr-5"
          :placeholder="$t('common.operation.searchByName')"
        />
        <!-- 搜索框 -->
      </div>

      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="name"
        :data="data[interviewType + '_' + currentGroup]"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: false,
        }"
        :pagination="{
          pageSize: 10,
        }"
        column-resizable
      >
        <template #columns>
          <a-table-column
            key="common.user.name"
            :title="$t('common.user.name')"
            data-index="name"
            :width="isMobile ? 75 : undefined"
          ></a-table-column>
          <!-- 姓名 -->

          <a-table-column
            v-if="!isMobile || displayType === 'common.information'"
            key="common.user.interviewTime"
            :title="$t('common.user.interviewTime')"
            data-index="interviewTime"
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
          ></a-table-column>
          <!-- 面试时间 -->

          <a-table-column
            v-if="!isMobile || displayType === 'common.operation.operate'"
            :title="$t('common.operation.operate')"
          >
            <template #cell="{ record }">
              <!-- record are the data of the row -->
              <a-button
                class="px-2"
                type="text"
                @click="
                  showAllowcate = true;
                  allowcateApplicationId = record.aid;
                "
                >{{ $t('common.operation.allocate') }}</a-button
              >
              <a-button class="px-2" type="text" @click="allocateOne(record)">{{
                $t('common.operation.notify')
              }}</a-button>
            </template>
          </a-table-column>
          <!-- 操作column -->
        </template>
      </a-table>
      <div class="flex justify-between sm:pb-5 mt-auto">
        <a-button
          type="outline"
          class="sm:w-auto"
          @click="showDateManagement = true"
        >
          {{ $t('common.operation.dateManagement') }}
        </a-button>
        <!-- 日程管理 -->
        <a-button type="outline" class="sm:w-auto" @click="allocateSelect()">
          <template #icon> <icon-plus /> </template>
          {{ $t('common.operation.sendNotification') }}
        </a-button>
        <!-- 发送通知 -->
      </div>
    </div>
  </div>

  <date-management-modal
    v-model:showDateManagement="showDateManagement"
    v-model:totalData="totalData"
    v-model:now-rid="recStore.currentRid"
    :class="showDateManagement ? '' : 'hidden'"
  />

  <notification-modal
    v-model:showNotify="showNotify"
    :candidates="selectData"
    :cur-step="0"
    :rec-name="recStore.currentRec?.name ?? ''"
    :type="'Accept'"
    :group="Group.Web"
    :is-mobile="isMobile"
  />
  <!-- 发送通知弹窗 -->

  <allowcate-modal
    v-model:showAllowcate="showAllowcate"
    v-model:totalData="totalData"
    :application-id="allowcateApplicationId"
    :interview-type="interviewType == '群面' ? 'team' : 'group'"
    :is-mobile="isMobile"
  />
  <!-- 分配选手面试时间弹窗 -->
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Group } from '@/constants/team';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import NotificationModal from '@/views/components/notification-modal.vue';

import useRecruitmentStore from '@/store/modules/recruitment';

import { TableData } from '@arco-design/web-vue';
import { Recruitment } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';
import AllowcateModal from './allowcate-modal.vue';
import DateManagementModal from './date-management-modal.vue';
import getApplicationData from './getData';

document.cookie = 'SSO_SESSION=unique_web_admin';

const recStore = useRecruitmentStore();

const interviewType = ref('common.steps.GroupInterview');
const currentGroup = ref(Group.Web);
const selectedKeys = ref([]);
const showNotify = ref(false);
const searchValue = ref('');
const showAllowcate = ref(false);
const allowcateApplicationId = ref('' as string);
const selectData = ref([] as { name: string; aid: string; step: any }[]);
const displayType = ref('common.information');
const isMobile = ref(false);
const showDateManagement = ref(false);
const totalData = ref({} as Recruitment);

type Data = {
  [key: string]: TableData[];
};
const realData = ref({} as Data);
const data = ref({} as Data);
watch(
  () => recStore.currentRid,
  async (newRid) => {
    totalData.value = await recStore.getRecruitment(newRid);
    getApplicationData(totalData.value).then((res) => {
      // console.log(res);
      realData.value = res;
      data.value = JSON.parse(JSON.stringify(realData.value));
    });
  },
);

const tabItems = ['common.steps.GroupInterview', 'common.steps.TeamInterview'];

const displayTypeItems = ['common.information', 'common.operation.operate'];

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

watch(selectedKeys, (newSelectedKeys) => {
  return newSelectedKeys.map((key) => {
    const key1 = `${interviewType.value}_${currentGroup.value}`;
    const nowData = data.value[key1].find((item) => item.name === key);
    if (!nowData) return {};
    return {
      name: nowData.name,
      aid: nowData.aid,
      step: nowData.step,
    };
  });
});

// 发送通知
const allocateOne = (rowData: any) => {
  selectData.value.length = 0;
  selectData.value.push({
    name: rowData.name,
    aid: rowData.aid,
    step: rowData.step,
  });
  showNotify.value = true;
};

const allocateSelect = () => {
  showNotify.value = true;
  selectData.value = selectedKeys.value
    .map((key) => {
      // console.log('%c [ key ]-178', 'font-size:13px; background:#d6a129; color:#ffe56d;', key);
      const key1 = `${interviewType.value}_${currentGroup.value}`;
      const nowData = data.value[key1].find((item) => item.name === key);
      if (!nowData) return null;
      return {
        name: nowData.name,
        aid: nowData.aid,
        step: nowData.step,
      };
    })
    .filter((item) => item !== null);
};

// 移动端适配
const mediaQuery = window.matchMedia('(min-width: 640px)');
function handleTabletChange(e: MediaQueryListEvent) {
  if (e.matches) isMobile.value = false;
  else isMobile.value = true;
}
mediaQuery.onchange = handleTabletChange;
handleTabletChange(mediaQuery);
</script>

<style scoped lang="less"></style>

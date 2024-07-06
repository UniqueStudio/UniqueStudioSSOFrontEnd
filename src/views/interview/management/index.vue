<template>
  <div v-if="!showDateManagement" class="bg-[--color-bg-2] w-full h-full p-5">
    <div class="text-[--color-text-1] text-xl pb-5 hidden sm:flex">{{
      $t('menu.interview.management')
    }}</div>
    <div class="flex flex-col flex-1 w-full h-full sm:pb-6">
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
        row-key="aid"
        :data="data"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: false,
        }"
        :pagination="{
          pageSize: widthType === 'sm' ? 10 : widthType === 'lg' ? 8 : 10,
        }"
        column-resizable
      >
        <template #columns>
          <a-table-column
            key="common.user.name"
            :title="$t('common.user.name')"
            data-index="name"
            :width="widthType === 'sm' ? 75 : undefined"
          ></a-table-column>
          <!-- 姓名 -->

          <a-table-column
            v-if="widthType != 'sm' || displayType === 'common.information'"
            key="common.user.interviewTime"
            :title="$t('common.user.interviewTime')"
            data-index="interviewTime"
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
          ></a-table-column>
          <!-- 面试时间 -->

          <a-table-column
            v-if="
              widthType != 'sm' || displayType === 'common.operation.operate'
            "
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
              <a-button
                class="px-2"
                type="text"
                @click="
                  selectedKeys = [record.aid];
                  showNotify = true;
                "
                >{{ $t('common.operation.notify') }}</a-button
              >
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
        <a-button
          type="outline"
          class="sm:w-auto"
          :disabled="!selectData.length"
          @click="showNotify = true"
        >
          <template #icon> <icon-plus /> </template>
          {{ $t('common.operation.sendNotification') }}
        </a-button>
        <!-- 发送通知 -->
      </div>
    </div>
  </div>

  <date-management-modal
    v-model:show="showDateManagement"
    :class="showDateManagement ? '' : 'hidden'"
  />

  <notification-modal
    v-model:showNotify="showNotify"
    :candidates="selectData"
    :cur-step="interviewType === InterviewType.Group ? 2 : 5"
    :rec-name="recStore.currentRec?.name ?? ''"
    :type="'Accept'"
    :group="currentGroup"
  />
  <!-- 发送通知弹窗 -->

  <allowcate-modal
    v-model:showAllowcate="showAllowcate"
    :application-id="allowcateApplicationId"
    :interview-type="interviewType === InterviewType.Team ? 'team' : 'group'"
    :current-group="currentGroup"
  />
  <!-- 分配选手面试时间弹窗 -->
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Group, InterviewType, Step } from '@/constants/team';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import NotificationModal from '@/views/components/notification-modal.vue';
import useRecruitmentStore from '@/store/modules/recruitment';
import useWindowResize from '@/hooks/resize';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import AllowcateModal from './allowcate-modal.vue';
import DateManagementModal from './date-management-modal.vue';

const recStore = useRecruitmentStore();
const { t } = useI18n();
const { widthType } = useWindowResize();

const interviewType = ref(InterviewType.Group);
const currentGroup = ref(Group.Web);
const selectedKeys = ref<string[]>([]);
watch([interviewType, currentGroup], () => {
  selectedKeys.value.length = 0;
});
const searchValue = ref('');
const allowcateApplicationId = ref<string>('');
const displayType = ref('common.information');

const showAllowcate = ref(false);
const showNotify = ref(false);
const showDateManagement = ref(false);

const tabItems = [InterviewType.Group, InterviewType.Team];
const displayTypeItems = ['common.information', 'common.operation.operate'];

const data = computed(() =>
  recStore.curApplications
    .filter((app) => {
      // 放弃或淘汰的选手不能选择
      if (app.abandoned || app.rejected) return false;
      if (app.group !== currentGroup.value) return false;
      if (interviewType.value === InterviewType.Group) {
        if (
          app.step !== Step.GroupInterview &&
          app.step !== Step.GroupTimeSelection
        )
          return false;
      } else if (interviewType.value === InterviewType.Team) {
        if (
          app.step !== Step.TeamInterview &&
          app.step !== Step.TeamTimeSelection
        )
          return false;
      }
      return app.user_detail?.name.includes(searchValue.value);
    })
    .map((app, ind) => {
      const alloGroup = app.interview_allocations_group;
      const alloTeam = app.interview_allocations_team;
      const interviewData =
        interviewType.value === InterviewType.Group ? alloGroup : alloTeam;

      return {
        key: ind.toString(),
        name: app.user_detail?.name ?? '',
        interviewTime:
          interviewData && interviewData.uid
            ? `${dayjs(interviewData.start).format('YYYY-MM-DD')} ${dayjs(
                interviewData.start,
              ).format('HH:mm')}-${dayjs(interviewData.end).format('HH:mm')}`
            : t('common.status.waitForDistribution'),
        groupInterviewTime: alloGroup?.uid ? alloGroup.start : '',
        teamInterviewTime: alloTeam?.uid ? alloTeam.start : '',
        aid: app.uid,
        step: app.step,
      };
    }),
);

// 发送通知
const selectData = computed(() =>
  data.value
    .filter(({ aid }) => selectedKeys.value.includes(aid))
    .map(({ name, aid, step, groupInterviewTime, teamInterviewTime }) => ({
      name,
      aid,
      step,
      groupInterviewTime,
      teamInterviewTime,
    })),
);
</script>

<style scoped lang="less"></style>

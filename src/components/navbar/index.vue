<template>
  <div class="navbar">
    <div class="left-side">
      <LogoSVG />
    </div>
    <ul class="right-side">
      <!--选择招新时间下拉栏以及发起招新-->
      <li class="mr-4 sm:mr-4">
        <!-- @vue-ignore 由于逆变@change会报ts错误 -->
        <a-select
          v-model="recruitmentStore.current"
          class="w-36 bg-transparent"
          default-value="2024春季招新"
          @change="recruitmentStore.setCurrentRecruitment"
        >
          <a-option
            v-for="item of recruitmentStore.data"
            :key="item.uid"
            :value="item.uid"
            :label="item.name"
          />
          <a-option>2024春季招新</a-option>
          <a-option>2023秋季招新</a-option>
          <a-option>2023夏令营招新</a-option>
          <template #footer>
            <div class="py-1 text-center">
              <a-button
                type="text"
                class="w-32 text-base font-normal"
                @click="visible = true"
              >
                <IconPlus class="mr-2" />{{
                  $t(`common.operation.createRecruitment`)
                }}
              </a-button>
            </div>
          </template>
        </a-select>
      </li>

      <!--调节日间模式和夜间模式-->
      <li class="hidden sm:flex sm:mr-8">
        <icon-sun-fill
          class="hidden sm:flex"
          :size="18"
          :value="statu"
          :style="{ color: statu === 'day' ? '#000' : '#888' }"
          @click="changeDayNight"
        />
      </li>
      <!--消息-->
      <li class="hidden sm:flex sm:mr-8">
        <a-dropdown class="hidden sm:flex" trigger="hover" position="br">
          <a-badge class="hidden sm:flex" :count="3" dot :offset="[2, -2]">
            <IconNotification
              class="hidden sm:flex"
              :size="18"
              :style="{
                color: '#888',
                fontSize: '18px',
                verticalAlign: '-3px',
              }"
            />
          </a-badge>
          <template #content style="width: 300px">
            <a-card hoverable :style="{ width: '240px' }" :bordered="false">
              <div
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }"
              >
                <span
                  :style="{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1D2129',
                  }"
                >
                  <span>{{ $t(`common.operation.notify`) }}</span>
                </span>
                <a-link>{{ $t(`common.operation.readAll`) }}</a-link>
              </div>
            </a-card>

            <a-doption
              ><template #icon><icon-calendar /></template>123</a-doption
            >
            <a-doption
              ><template #icon><icon-calendar /></template>123</a-doption
            >
            <a-doption
              ><template #icon><icon-calendar /></template>123</a-doption
            >
          </template>
        </a-dropdown>
      </li>
      <!--头像及下拉栏-->
      <li class="mr-4 ml-4 sm:ml-0">
        <a-dropdown>
          <a-avatar :size="32"> B </a-avatar>
          <template #content>
            <a-doption>
              <template #icon>
                <icon-user />
              </template>
              {{ $t(`common.operation.userSetting`) }}
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-export />
              </template>
              {{ $t(`common.operation.quitAccount`) }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <!-- 仪表盘 -->
      <li class="flex sm:hidden">
        <a-dropdown
          class="dashboard-dropdown flex sm:hidden"
          trigger="click"
          @click="icon = !icon"
        >
          <IconMenu v-if="icon" :size="24" class="flex sm:hidden" />
          <icon-close v-if="!icon" :size="24" class="flex sm:hidden" />
          <template #content>
            <a-menu
              class="dashboard-content"
              :default-open-keys="['0']"
              :default-selected-keys="['0_1']"
            >
              <a-menu-item key="0_0_0" data-obj="1">{{
                $t('menu.title.dashboard')
              }}</a-menu-item>
              <a-sub-menu key="0">
                <template #title>{{ $t('menu.overview') }}</template>
                <a-menu-item
                  key="0_0"
                  @click="router.push('/overview/apply-info')"
                  >{{ $t('menu.overview.applyInfo') }}</a-menu-item
                >
                <a-menu-item
                  key="0_1"
                  @click="router.push('/overview/candidate')"
                  >{{ $t('menu.overview.candidate') }}</a-menu-item
                >
              </a-sub-menu>
              <a-sub-menu key="1">
                <template #title>{{ $t('menu.interview') }}</template>
                <a-menu-item
                  key="1_0"
                  @click="router.push('/interview/schedule')"
                  >{{ $t('menu.interview.schedule') }}</a-menu-item
                >
                <a-menu-item
                  key="1_1"
                  @click="router.push('/interview/management')"
                  >{{ $t('menu.interview.management') }}</a-menu-item
                >
              </a-sub-menu>
            </a-menu>
          </template>
        </a-dropdown>
      </li> </ul
    >-

    <!--发起招新的模态框-->
    <create-newrec-modal v-model:visible="visible" />
  </div>
</template>

<script setup lang="ts">
import CreateNewrecModal from '@/components/navbar/components/create-newrec-modal.vue';
import LogoSVG from '@/assets/svg/logo.svg';
import useRecruitmentStore from '@/store/modules/recruitment';
import useUserStore from '@/store/modules/user';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const recruitmentStore = useRecruitmentStore();
recruitmentStore.getAllRecruitments();
const userStore = useUserStore();
userStore.getUserInfo();

const icon = ref(true);
const statu = ref('day');
const changeDayNight = () => {
  if (statu.value === 'day') {
    document.body.setAttribute('arco-theme', 'dark');
    statu.value = 'night';
  } else {
    document.body.removeAttribute('arco-theme');
    statu.value = 'day';
  }
};

const visible = ref(false);
</script>

<style scoped lang="less">
@nav-size-height: 60px;

.navbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.right-side {
  display: flex;
  align-items: center;
  padding-right: 20px;

  li {
    display: flex;
    align-items: center;
    padding: 0, 0;
  }
}

.dashboard-content {
  width: 100vw;
}
</style>

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
          v-model="recruitmentStore.currentRid"
          class="w-36 bg-transparent"
          :default-value="
            getRecruitmentName(t, recruitmentStore.currentRec?.name)
          "
          @change="recruitmentStore.setCurrentRecruitment"
        >
          <a-option v-if="recruitmentStore.data.length === 0" :disabled="true">
            {{ $t('common.operation.noRecruitments') }}
          </a-option>
          <a-option
            v-for="item of recruitmentStore.data"
            :key="item.uid"
            :value="item.uid"
            :label="getRecruitmentName(t, item.name)"
          />
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
      <!--头像及下拉栏-->
      <li class="mr-4 ml-4 sm:ml-0">
        <a-dropdown>
          <a-avatar :size="32"> {{ getUserName }} </a-avatar>
          <template #content>
            <a-doption @click="gotoUserInfo()">
              <template #icon>
                <icon-user />
              </template>
              {{ $t(`common.operation.userSetting`) }}
            </a-doption>
            <a-doption @click="gotoLogout()">
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
          v-model:visible="isMenuVisible"
          class="dashboard-dropdown flex sm:hidden"
          trigger="click"
          @popup-visible-change="handleVisibleChange"
        >
          <IconMenu v-if="!isMenuVisible" :size="24" class="flex sm:hidden" />
          <icon-close v-if="isMenuVisible" :size="24" class="flex sm:hidden" />
          <template #content>
            <a-menu
              class="dashboard-content"
              :default-open-keys="defaultOpenKeys"
              :default-selected-keys="defaultSelectedKeys"
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
      </li>
    </ul>

    <!--发起招新的模态框-->
    <create-newrec-modal v-model:visible="visible" />
  </div>
</template>

<script setup lang="ts">
import CreateNewrecModal from '@/components/navbar/components/create-newrec-modal.vue';
import LogoSVG from '@/assets/svg/logo.svg';
import useRecruitmentStore from '@/store/modules/recruitment';
import useUserStore from '@/store/modules/user';
import { getRecruitmentName } from '@/utils/index';
import { SSO_DOMAIN } from '@/constants';
import { useI18n } from 'vue-i18n';

import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const recruitmentStore = useRecruitmentStore();
recruitmentStore.getAllRecruitments();
const userStore = useUserStore();
userStore.getUserInfo();

const getUserName = computed(() => {
  return userStore.data ? userStore.data?.name[0] : 'I';
});

const gotoUserInfo = () => {
  window.location.href = `//${SSO_DOMAIN}/user/edit-info`;
};

const gotoLogout = () => {
  window.location.href = `//${SSO_DOMAIN}/?logout=true`;
};

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
const isMenuVisible = ref(false);

const handleVisibleChange = (menuVisible: boolean) => {
  isMenuVisible.value = menuVisible;
};

const defaultOpenKeys = ref<string[]>([]);
const defaultSelectedKeys = ref<string[]>([]);

const setDefaultMenuKeys = () => {
  const { path } = route;
  if (path.includes('/overview')) {
    defaultOpenKeys.value = ['0'];
    if (path.includes('/apply-info')) {
      defaultSelectedKeys.value = ['0_0'];
    } else if (path.includes('/candidate')) {
      defaultSelectedKeys.value = ['0_1'];
    }
  } else if (path.includes('/interview')) {
    defaultOpenKeys.value = ['1'];
    if (path.includes('/schedule')) {
      defaultSelectedKeys.value = ['1_0'];
    } else if (path.includes('/management')) {
      defaultSelectedKeys.value = ['1_1'];
    }
  }
};

setDefaultMenuKeys();

watch(route, () => {
  setDefaultMenuKeys();
});
</script>

<style scoped lang="less">
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
    padding: 0 0;
  }
}

.dashboard-content {
  width: 100vw;
}
</style>

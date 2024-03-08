<template>
  <div class="navbar">
    <div class="left-side">
      <LogoSVG />
    </div>
    <ul class="right-side">
      <!--选择招新时间下拉栏以及发起招新-->
      <li style="margin-right: 8px">
        <!-- @vue-ignore 由于逆变@change会报ts错误 -->
        <a-select
          v-model="recruitmentStore.current"
          class="w-40 bg-transparent"
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
            <div style="padding: 6px 0; text-align: center">
              <a-button
                type="text"
                class="w-32"
                style="font-size: 16px; font-weight: 400"
                @click="visible = true"
              >
                <IconPlus style="margin-right: 10px" />{{
                  $t(`common.operation.createRecruitment`)
                }}
              </a-button>
            </div>
          </template>
        </a-select>
      </li>

      <a-space :size="24">
        <!--调节日间模式和夜间模式-->
        <li>
          <icon-sun-fill
            :size="18"
            :value="statu"
            :style="{ color: statu === 'day' ? '#000' : '#888' }"
            @click="changeDayNight"
          />
        </li>
        <!--消息-->
        <a-dropdown trigger="hover" position="br">
          <a-badge :count="3" dot :offset="[2, -2]">
            <IconNotification
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
        <!--头像及下拉栏-->
        <li>
          <a-dropdown>
            <a-avatar
              :size="32"
              :style="{ marginRight: '8px', cursor: 'pointer' }"
            >
              B
            </a-avatar>
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
      </a-space>
    </ul>

    <!--发起招新的模态框-->
    <create-newrec-modal v-model:visible="visible" />
  </div>
</template>

<script setup lang="ts">
import CreateNewrecModal from '@/components/navbar/components/create-newrec-modal.vue';
import LogoSVG from '@/assets/svg/logo.svg';
import useRecruitmentStore from '@/store/modules/recruitment';
import { ref } from 'vue';

const recruitmentStore = useRecruitmentStore();
recruitmentStore.getAllRecruitments();

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
    padding: 0 10px;
  }
}
</style>

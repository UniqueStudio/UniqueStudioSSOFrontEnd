<template>
  <div>
    <a-date-picker
      v-model="pickerValue"
      default-value="2024-03-01"
      hide-trigger
      class="w-full"
    />
  </div>
  <div>
    <div class="text-[--color-text-1] text-xl font-bold mt-10 ml-5">{{
      $t('common.applyInfo.recentSchedules')
    }}</div>
    <div>
      <li
        v-for="date in recents"
        :key="date.toDateString()"
        class="block list-none ml-5 mb-6"
      >
        <div
          v-if="
            filteredSchedules(recents).some(
              (schedule) => schedule.date.getTime() === date.getTime(),
            )
          "
        >
          <div class="text-gray-600 mt-5 ml-5 text-lg">
            {{ date.getMonth() + 1 }}.{{ date.getDate() }}
          </div>
          <li
            v-for="schedule in filteredDateSchedules(date, true)"
            :key="schedule.name"
            class="block list-none p-7"
          >
            <div class="w-10 h-10 rounded-full border-2 float-left mr-3 p-2">
              <icon-calendar class="text-xl" />
            </div>
            <span class="text-xl float-left mt-1">{{ schedule.name }}</span>
            <span class="text-blue-600 float-right mt-3">{{
              schedule.time
            }}</span>
          </li>
        </div>
      </li>
      <a-button
        v-if="schedulesLength(recents) > 5"
        type="primary"
        class="w-4/5 h-12 ml-16 mt-4 text-xl"
        @click="openModel"
      >
        {{ $t('common.applyInfo.details') }}</a-button
      >
    </div>
  </div>
  <a-modal
    v-model:visible="visible"
    :closable="false"
    :hide-cancel="true"
    :modal-style="{ maxHeight: '700px', overflowY: 'scroll' }"
  >
    <div class="text-[--color-text-1] text-xl font-bold ml-5">{{
      $t('common.applyInfo.recentSchedules')
    }}</div>
    <div>
      <li
        v-for="date in recents"
        :key="date.toDateString()"
        class="block list-none ml-5 mb-6"
      >
        <div
          v-if="
            schedules.some(
              (schedule) => schedule.date.getTime() === date.getTime(),
            )
          "
        >
          <div class="text-gray-600 mt-5 ml-5 text-lg">
            {{ date.getMonth() + 1 }}.{{ date.getDate() }}
          </div>
          <li
            v-for="schedule in filteredDateSchedules(date, false)"
            :key="schedule.name"
            class="block list-none p-7"
          >
            <div class="w-10 h-10 rounded-full border-2 float-left mr-3 p-2">
              <icon-calendar class="text-xl" />
            </div>
            <span class="text-xl float-left mt-1">{{ schedule.name }}</span>
            <span class="text-blue-600 float-right mt-3">{{
              schedule.time
            }}</span>
          </li>
        </div>
      </li>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// import useRecruitmentStore from '@/store/modules/recruitment';
const pickerValue = ref('2024-03-01');
const visible = ref(false);
const recents = computed(() => {
  const dateArray = [];
  for (let i = 0; i < 7; i += 1) {
    const today = new Date(pickerValue.value);
    today.setDate(today.getDate() + i);
    dateArray.push(today);
  }
  return dateArray;
});

const schedules = [
  {
    date: new Date('2024-03-01'),
    name: 'PM组面',
    time: '19:00-21:00',
  },
  {
    date: new Date('2024-03-01'),
    name: 'Design组面',
    time: '19:00-21:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
  {
    date: new Date('2024-03-03'),
    name: '选手报名截止',
    time: '19:00',
  },
]; // 测试用

const filteredSchedules = (recent: any) => {
  return schedules
    .filter((schedule) => {
      return recent.some(
        (date: Date) => schedule.date.getTime() === date.getTime(),
      );
    })
    .slice(0, 5);
};

const filteredDateSchedules = (date: Date, filtered: boolean) => {
  return filtered
    ? filteredSchedules(recents.value).filter((schedule) => {
        return schedule.date.getTime() === date.getTime();
      })
    : schedules.filter((schedule) => {
        return schedule.date.getTime() === date.getTime();
      });
};

const schedulesLength = (recent: any) => {
  return schedules.filter((schedule) => {
    return recent.some(
      (date: Date) => schedule.date.getTime() === date.getTime(),
    );
  }).length;
};

const openModel = () => {
  visible.value = true;
};
</script>

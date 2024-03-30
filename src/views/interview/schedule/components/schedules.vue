<template>
  <div class="flex-1 bg-white rounded p-5 max-h-216">
    <a-scrollbar type="embed" class="overflow-y-auto max-h-193 mb-5">
      <div class="w-full font-normal mb-5 text-lg">{{
        $t('common.applyInfo.Schedules')
      }}</div>
      <li v-for="date in recents" :key="date.toDateString()" class="list-none">
        <div
          v-if="
            filteredSchedules(recents).some(
              (schedule) => schedule.date.getTime() === date.getTime(),
            )
          "
          class="flex flex-col"
        >
          <li
            v-for="schedule in filteredDateSchedules(date, false)"
            :key="schedule.name"
            class="list-none mb-2.5"
          >
            <div class="overflow-hidden">
              <icon-calendar
                class="w-9 h-9 text-xl rounded-full border-2 p-2 bg-gray-100 text-blue-600 float-left mr-2.5"
              />
              <span class="float-left leading-10">{{ schedule.name }}</span>
            </div>
            <div class="overflow-hidden">
              <icon-clock-circle
                class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
              />
              <span class="float-left leading-10 text-slate-500">{{
                schedule.time
              }}</span>
            </div>
            <div class="overflow-hidden">
              <icon-location
                class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
              />
              <span class="float-left leading-10 text-slate-500">{{
                schedule.location
              }}</span>
            </div>
            <div class="overflow-hidden">
              <icon-user
                class="w-9 h-9 text-xl p-2 float-left mr-2.5 text-gray-500"
              />
              <span class="float-left leading-10 text-slate-500">{{
                schedule.player
              }}</span>
            </div>
            <span class="float-left pl-2 leading-10 text-slate-400 text-sm">{{
              schedule.description
            }}</span>
          </li>
        </div>
      </li>
    </a-scrollbar>

    <a-button
      v-if="schedulesLength(recents) > 5"
      type="dashed"
      class="text-xl w-full py-0.5"
      @click="openModel"
    >
      {{ $t('common.operation.addSchedule') }}</a-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const visible = ref(false);
const pickerValue = ref('2024-01-01');
// 存储往后7天
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
    date: new Date('2024-01-01'),
    name: 'PM组面',
    time: '13.00-14.00（1h）',
    location: '809',
    player: '苦瓜',
    description: '可以调时间',
  },
  {
    date: new Date('2024-01-01'),
    name: 'Design组面',
    time: '19:00-21:00（2h）',
    location: '810',
    player: '周子涵',
    description: '可以调时间',
  },
  {
    date: new Date('2024-01-01'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: '柴犬',
    description: '没别的时间了',
  },
  {
    date: new Date('2024-01-01'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: '柴犬',
    description: '没别的时间了',
  },
  {
    date: new Date('2024-01-01'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: '柴犬',
    description: '没别的时间了',
  },
  {
    date: new Date('2024-01-01'),
    name: 'web组面',
    time: '13:00-13:30（0.5h）',
    location: '811',
    player: '柴犬',
    description: '没别的时间了',
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

// filterd 表示是否筛选
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

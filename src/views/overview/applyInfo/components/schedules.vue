<template>
  <div>
    <a-date-picker
      v-model="pickerValue"
      default-value="2024-03-01"
      hide-trigger
      class="hidden sm:block sm:w-full"
    />
  </div>
  <div>
    <div class="text-[--color-text-1] text-lg font-bold mt-15 ml-5 pt-5">{{
      $t('common.applyInfo.recentSchedules')
    }}</div>
    <div>
      <li
        v-for="date in recents"
        :key="date.toDateString()"
        class="block list-none ml-5"
      >
        <div
          v-if="
            filteredSchedules(recents).some(
              (schedule) => schedule.date.getTime() === date.getTime(),
            )
          "
        >
          <div class="text-[--color-text-1] mt-5 ml-5 sm:text-xl">
            {{ date.getMonth() + 1 }}.{{ date.getDate() }}
          </div>
          <li
            v-for="schedule in filteredDateSchedules(date, true)"
            :key="schedule.name"
            class="block list-none p-3"
          >
            <div class="flex justify-between">
              <div class="flex">
                <div
                  class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 mr-3 flex items-center justify-center"
                >
                  <icon-calendar class="sm:text-xl text-[--color-text-1]" />
                </div>
                <span class="sm:text-xl mt-1 text-[--color-text-1]">{{
                  schedule.name
                }}</span>
              </div>
              <span class="text-blue-600 mr-8 sm:text-lg">{{
                schedule.time
              }}</span>
            </div>
          </li>
        </div>
      </li>
      <a-button
        v-if="schedulesLength(recents) > 5"
        type="primary"
        class="w-4/5 sm:h-2.5vw ml-1/8 mt-4 sm:text-1vw"
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
          <div class="text-[--color-text-1] mt-5 ml-5 text-lg">
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
            <span class="text-xl float-left mt-1 text-[--color-text-1]">{{
              schedule.name
            }}</span>
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
import useRecruitmentStore from '@/store/modules/recruitment';

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const transformedTime = (start: string, end: string) => {
  const startTime = new Date(start);
  const endTime = new Date(end);

  const startHours = startTime.getHours().toString().padStart(2, '0');
  const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
  const endHours = endTime.getHours().toString().padStart(2, '0');
  const endMinutes = endTime.getMinutes().toString().padStart(2, '0');

  return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
};

const pickerValue = ref(getToday());
const schedules: any[] = [];

const recStore = useRecruitmentStore();
recStore.curApplications.forEach((e) => {
  console.log(e.interview_allocations_group?.date);
});
recStore.curApplications.forEach((e) => {
  const groupObj = {
    // @ts-ignore
    date: new Date(e.interview_allocations_group?.date),
    name: `${e.group}组面(${e.user_detail?.name})`,
    time: transformedTime(
      e.interview_allocations_group!.start,
      e.interview_allocations_group!.end,
    ),
  };

  const teamObj = {
    // @ts-ignore
    date: new Date(e.interview_allocations_team?.date),
    name: `${e.group}群面(${e.user_detail?.name})`,
    time: transformedTime(
      e.interview_allocations_team!.start,
      e.interview_allocations_team!.end,
    ),
  };

  schedules.push(groupObj, teamObj);
});

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

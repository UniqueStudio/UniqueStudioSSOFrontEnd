<template>
  <div>
    <a-date-picker v-model="pickerValue" hide-trigger />
  </div>
  <div>
    <div class="text-[--color-text-1] text-xl font-bold mt-15 ml-5 pt-5">{{
      $t('common.applyInfo.recentSchedules')
    }}</div>
    <div class="">
      <a-empty
        :class="isEmpty ? 'block' : 'hidden'"
        class="mt-40 pb-40"
      ></a-empty>
      <li
        v-for="date in recents"
        :key="date.toDateString()"
        class="block list-none ml-5"
      >
        <div
          v-if="
            filteredSchedules.some(
              (schedule) => schedule.date.getTime() === date.getTime(),
            )
          "
        >
          <div class="text-[--color-text-1] mt-5 ml-5 sm:text-lg">
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
                  <icon-calendar class="sm:text-lg text-[--color-text-1]" />
                </div>
                <span class="sm:text-lg mt-1 text-[--color-text-1]">{{
                  schedule.name
                }}</span>
              </div>
              <span class="text-blue-600 mr-8">{{ schedule.time }}</span>
            </div>
          </li>
        </div>
      </li>
      <a-button
        v-if="schedulesLength > 5"
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
            <span class="text-lg float-left mt-1 text-[--color-text-1]">{{
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
import { getToday, transformedTime } from '@/utils';
import { Schedule } from '../type';

const visible = ref(false);

const openModel = () => {
  visible.value = true;
};

const pickerValue = ref(getToday());

const recStore = useRecruitmentStore();

const schedules = computed<Schedule[]>(() => {
  const schedule: Schedule[] = [];
  recStore.curApplications.forEach((e) => {
    const groupObj = {
      date: new Date(e.interview_allocations_group?.date as string),
      name: `${e.group}组面(${e.user_detail?.name})`,
      time: transformedTime(
        e.interview_allocations_group!.start,
        e.interview_allocations_group!.end,
      ),
    };

    const teamObj = {
      date: new Date(e.interview_allocations_team?.date as string),
      name: `${e.group}群面(${e.user_detail?.name})`,
      time: transformedTime(
        e.interview_allocations_team!.start,
        e.interview_allocations_team!.end,
      ),
    };

    schedule.push(groupObj, teamObj);
  });
  return schedule;
});

const recents = computed<Date[]>(() => {
  const dateArray = [];
  for (let i = 0; i < 7; i += 1) {
    const today = new Date(pickerValue.value);
    today.setDate(today.getDate() + i);
    dateArray.push(today);
  }
  return dateArray;
});

const filteredSchedules = computed(() => {
  return schedules.value
    .filter((schedule) => {
      return recents.value.some(
        (date: Date) => schedule.date.getTime() === date.getTime(),
      );
    })
    .slice(0, 5);
});

const filteredDateSchedules = computed(() => {
  return (date: Date, filtered: boolean) => {
    return filtered
      ? filteredSchedules.value.filter((schedule) => {
          return schedule.date.getTime() === date.getTime();
        })
      : schedules.value.filter((schedule) => {
          return schedule.date.getTime() === date.getTime();
        });
  };
});

const schedulesLength = computed(() => {
  return schedules.value.filter((schedule) => {
    return recents.value.some(
      (date: Date) => schedule.date.getTime() === date.getTime(),
    );
  }).length;
});

const isEmpty = computed(() => {
  let empty = true;
  const scheduleTimes = schedules.value.map((schedule) =>
    schedule.date.getTime(),
  );
  recents.value.forEach((date) => {
    if (scheduleTimes.includes(date.getTime())) empty = false;
  });
  return empty;
});
</script>

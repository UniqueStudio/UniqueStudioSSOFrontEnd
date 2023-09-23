<template>
  <div class="flex flex-0 justify-between pb-5">
    <!-- @vue-ignore 由于逆变@change会报ts错误 -->
    <a-checkbox
      :model-value="checkedAll"
      :indeterminate="indeterminate"
      @change="handleChangeAll"
      >{{ $t('common.operation.selectAll') }}
    </a-checkbox>
    <a-tabs
      v-model:active-key="currentGroup"
      class="flex items-center"
      type="text"
      size="medium"
    >
      <a-tab-pane v-for="item in groups" :key="item" :title="item">
      </a-tab-pane>
    </a-tabs>
  </div>
  <!-- @vue-ignore 由于逆变@change会报ts错误 -->
  <a-checkbox-group v-model="data" @change="handleChange">
    <candidate-info-card
      v-for="candidate in candidateInfo"
      :key="candidate.id"
      :info="candidate"
    ></candidate-info-card>
  </a-checkbox-group>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Groups } from '@/constants/team';
import { Gender } from '@/views/login/type';
import { Candidate } from '../type';
import candidateInfoCard from './candidate-info-card.vue';

const groups = computed(() => Object.values(Groups));
const currentGroup = ref(Groups.PM);

const indeterminate = ref(false);
const checkedAll = ref(false);

const candidateInfo: Candidate[] = [
  {
    id: 1,
    name: '名字1',
    avatar: '',
    gender: Gender.male,
    school: '计算机学院',
    major: '计科',
    grade: '大一',
    score: '前1%',
    recommender: 'abc',
    intro: '自我介绍',
    comment: {
      good: [],
      normal: [],
      bad: [],
    },
    phone: '1145141919',
    email: 'henhen@aaa.hust',
    status: '已终止',
    steps: ['2023.09.09', '2023.09.10'],
    group: Groups.PM,
  },
  {
    id: 2,
    name: '名字2',
    avatar: '',
    gender: Gender.female,
    school: '计算机学院',
    major: '计科',
    grade: '大一',
    score: '前1%',
    recommender: 'abc',
    intro: '自我介绍',
    comment: {
      good: [],
      normal: [],
      bad: [],
    },
    phone: '1145141919',
    email: 'henhen@aaa.hust',
    status: '已终止',
    steps: ['2023.09.09', '2023.09.10'],
    group: Groups.PM,
  },
];
const data = ref<number[]>([]);

const handleChangeAll = (value: boolean) => {
  indeterminate.value = false;
  checkedAll.value = value;
  data.value = value ? candidateInfo.map(({ id }) => id) : [];
};

const handleChange = (values: number[]) => {
  if (values.length === candidateInfo.length) {
    checkedAll.value = true;
    indeterminate.value = false;
  } else if (values.length === 0) {
    checkedAll.value = false;
    indeterminate.value = false;
  } else {
    checkedAll.value = false;
    indeterminate.value = true;
  }
};
</script>

<style scoped lang="less"></style>

<template>
  <div class="flex flex-0 justify-between pb-5">
    <div class="flex">
      <!-- @vue-ignore 由于逆变@change会报ts错误 -->
      <a-checkbox
        class="pr-5"
        :model-value="checkedAll"
        :indeterminate="indeterminate"
        @change="handleChangeAll"
        >{{ $t('common.operation.selectAll') }}
      </a-checkbox>
      <div v-if="selectedCandidates.length" class="flex pr-2 items-center">
        <a-descriptions
          :label-style="{ padding: '0 10px' }"
          :value-style="{ padding: '0' }"
        >
          <a-descriptions-item :label="$t('common.operation.selected')">
            <span>{{ selectedCandidates.length }}</span>
          </a-descriptions-item>
        </a-descriptions>

        <a-button
          type="text"
          style="background-color: transparent"
          @click="handleClearSelected"
        >
          {{ $t('common.operation.clearSelected') }}
        </a-button>
      </div>
    </div>

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
  <a-checkbox-group
    v-model="selectedCandidates"
    class="grid grid-cols-3 gap-x-4 gap-y-3 overflow-y-auto"
    @change="handleChange"
  >
    <candidate-info-card
      v-for="candidate in candidateInfo"
      :key="candidate.id"
      :info="candidate"
      :checked="selectedCandidates.includes(candidate.id)"
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
      good: [
        { name: 'aaa', comment: '好好好' },
        { name: 'aaa', comment: '好好好' },
      ],
      normal: [{ name: 'aaa', comment: '嗯嗯恩' }],
      bad: [{ name: 'aaa', comment: '呃呃呃' }],
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
  {
    id: 3,
    name: '名字3',
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
  {
    id: 4,
    name: '名字4',
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
  {
    id: 5,
    name: '名字5',
    avatar: '',
    gender: Gender.male,
    school: '计算机学院',
    major: '计科',
    grade: '大一',
    score: '前1%',
    recommender: 'abc',
    intro: '自我介绍',
    comment: {
      good: [
        { name: 'aaa', comment: '好好好' },
        { name: 'aaa', comment: '好好好' },
      ],
      normal: [{ name: 'aaa', comment: '嗯嗯恩' }],
      bad: [{ name: 'aaa', comment: '呃呃呃' }],
    },
    phone: '1145141919',
    email: 'henhen@aaa.hust',
    status: '已终止',
    steps: ['2023.09.09', '2023.09.10'],
    group: Groups.PM,
  },
  {
    id: 6,
    name: '名字6',
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
  {
    id: 7,
    name: '名字7',
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
  {
    id: 8,
    name: '名字8',
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
const selectedCandidates = ref<number[]>([]);

const handleChangeAll = (value: boolean) => {
  indeterminate.value = false;
  checkedAll.value = value;
  selectedCandidates.value = value ? candidateInfo.map(({ id }) => id) : [];
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

const handleClearSelected = () => {
  selectedCandidates.value.length = 0;
  handleChange(selectedCandidates.value);
};
</script>

<style scoped lang="less"></style>

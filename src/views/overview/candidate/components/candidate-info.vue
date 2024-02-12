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
      <div v-if="selectedApplications.length" class="flex pr-2 items-center">
        <a-descriptions
          :label-style="{ padding: '0 10px' }"
          :value-style="{ padding: '0' }"
        >
          <a-descriptions-item :label="$t('common.operation.selected')">
            <span>{{ selectedApplications.length }}</span>
          </a-descriptions-item>
        </a-descriptions>

        <a-button
          type="text"
          class="bg-transparent"
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
    v-model="selectedApplications"
    class="grid grid-cols-3 gap-x-4 gap-y-3 overflow-y-auto pb-5"
    @change="handleChange"
  >
    <candidate-info-card
      v-for="candidate in groupApps"
      :key="candidate.uid"
      :info="candidate"
      :checked="selectedApplications.includes(candidate.uid)"
    ></candidate-info-card>
  </a-checkbox-group>
  <edit-buttons
    :candidates="candidates"
    :step-info="{ cur: 0, next: 1 }"
  ></edit-buttons>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Group } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import candidateInfoCard from './candidate-info-card.vue';
import editButtons from './edit-buttons.vue';

const recStore = useRecruitmentStore();

const curApplications = computed(() => recStore.currentRec?.applications ?? []);

const groups = computed(() => Object.values(Group));
const currentGroup = ref(Group.Pm);

const indeterminate = ref(false);
const checkedAll = ref(false);

const groupApps = computed(() =>
  curApplications.value.filter(({ group }) => group === currentGroup.value),
);
const selectedApplications = ref<string[]>([]);

const candidates = computed(() =>
  selectedApplications.value.map((selectId) =>
    groupApps.value.find(({ uid }) => uid === selectId),
  ),
);

const handleChangeAll = (value: boolean) => {
  indeterminate.value = false;
  checkedAll.value = value;
  selectedApplications.value = value
    ? groupApps.value.map(({ uid }) => uid)
    : [];
};

const handleChange = (values: string[]) => {
  if (values.length === groupApps.value.length) {
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
  selectedApplications.value.length = 0;
  handleChange(selectedApplications.value);
};
</script>

<style scoped lang="less"></style>

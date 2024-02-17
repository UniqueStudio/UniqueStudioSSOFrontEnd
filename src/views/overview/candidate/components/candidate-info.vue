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

    <team-group-radio v-model="currentGroup"></team-group-radio>
  </div>
  <!-- @vue-ignore 由于逆变@change会报ts错误 -->
  <a-checkbox-group
    v-model="selectedApplications"
    class="grid grid-cols-3 gap-x-4 gap-y-3 overflow-y-auto pb-5"
    @change="handleChange"
  >
    <candidate-info-card
      v-for="candidate in filteredApps"
      :key="candidate.uid"
      :info="candidate"
      :checked="selectedApplications.includes(candidate.uid)"
    ></candidate-info-card>
  </a-checkbox-group>
  <div class="flex justify-between flex-row-reverse">
    <edit-buttons
      :candidates="candidates"
      :cur-step="curStep"
      :group="currentGroup"
    ></edit-buttons>
    <a-button
      v-show="props.curStep === 1"
      type="primary"
      @click="showUploadModal = true"
      >{{ $t('common.operation.uploadTest') }}</a-button
    >
  </div>
  <a-modal
    v-model:visible="showUploadModal"
    :title="$t('common.operation.uploadTest')"
  >
    <a-form :model="uploadData">
      <a-form-item field="group" :label="$t('common.user.group')">
        <a-select v-model="uploadData.group">
          <a-option v-for="item in groups" :key="item">{{ item }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="data">
        <a-upload
          v-model="uploadData.data"
          draggable
          action="/"
          :auto-upload="false"
          :limit="1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Group, recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import candidateInfoCard from './candidate-info-card.vue';
import editButtons from './edit-buttons.vue';

const props = defineProps({
  curStep: {
    type: Number,
    default: 0,
    required: true,
  },
});

const recStore = useRecruitmentStore();

const currentGroup = ref(Group.Web);
const groups = computed(() =>
  Object.values(Group).filter((x) => x !== Group.Unique),
);

const indeterminate = ref(false);
const checkedAll = ref(false);

const filteredApps = computed(() =>
  recStore.curApplications.filter(
    ({ step, group }) =>
      recruitSteps[props.curStep].value.includes(step) &&
      group === currentGroup.value,
  ),
);
const selectedApplications = ref<string[]>([]);

const candidates = computed(() =>
  selectedApplications.value.map((selectId) => {
    const app = filteredApps.value.find(({ uid }) => uid === selectId);
    return {
      name: app?.user_detail?.name ?? '',
      aid: app?.uid ?? '',
      step: app?.step ?? recruitSteps[props.curStep].value[0],
      abandoned: app?.abandoned ?? false,
      rejected: app?.rejected ?? false,
    };
  }),
);

const handleChangeAll = (value: boolean) => {
  indeterminate.value = false;
  checkedAll.value = value;
  selectedApplications.value = value
    ? filteredApps.value.map(({ uid }) => uid)
    : [];
};

const handleChange = (values: string[]) => {
  if (values.length === 0) {
    checkedAll.value = false;
    indeterminate.value = false;
  } else if (values.length === filteredApps.value.length) {
    checkedAll.value = true;
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

watch([() => props.curStep, currentGroup], handleClearSelected);

const uploadData = ref({
  group: currentGroup,
  data: null,
});

const showUploadModal = ref(false);
</script>

<style scoped lang="less"></style>

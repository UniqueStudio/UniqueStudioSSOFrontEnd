<template>
  <div
    class="flex flex-0 justify-between mb-5 absolute top-0 left-0 sm:static w-full bg-[--color-bg-1] h-10"
  >
    <div class="flex">
      <!-- @vue-ignore 由于逆变@change会报ts错误 -->
      <a-checkbox
        class="sm:pr-5 w-max"
        :model-value="checkedAll"
        :indeterminate="indeterminate"
        @change="handleChangeAll"
        >{{ $t('common.operation.selectAll') }}
      </a-checkbox>
      <!-- 渲染选中人数，清空选择 -->
      <div v-if="selectedApplications.length" class="flex items-center">
        <a-descriptions
          :label-style="{ padding: '0 10px' }"
          :value-style="{ padding: '0' }"
        >
          <a-descriptions-item :label="$t('common.operation.selected')">
            <span>{{ selectedApplications.length }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
    <div class="sm:hidden flex items-center">
      <a-select
        v-model="curStep"
        :bordered="false"
        class="w-min text-[rgb(var(--primary-6))] text-right"
      >
        <a-option
          v-for="(item, index) in recruitSteps"
          :key="item.i18Key"
          :value="index + 1"
          >{{ $t(item.i18Key) }}</a-option
        >
      </a-select>
      <a-select
        v-model="currentGroup"
        :bordered="false"
        class="w-min text-[rgb(var(--primary-6))] text-right"
      >
        <a-option v-for="item in groups" :key="item">{{ item }}</a-option>
      </a-select></div
    >
    <team-group-radio
      v-model="currentGroup"
      class="hidden sm:block"
    ></team-group-radio>
  </div>
  <!-- @vue-ignore 由于逆变@change会报ts错误 -->
  <a-checkbox-group
    v-model="selectedApplications"
    class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 overflow-y-auto pb-5 shrink sm:grow"
    style="scrollbar-width: thin"
    @change="handleChange"
  >
    <candidate-info-card
      v-for="candidate in filteredApps"
      :key="candidate.uid"
      :info="candidate"
      :checked="selectedApplications.includes(candidate.uid)"
    ></candidate-info-card>
  </a-checkbox-group>
  <div
    class="flex justify-between flex-row-reverse justify-self-end fixed sm:static bottom-0 left-0 w-full bg-[--color-bg-1] p-2"
  >
    <edit-buttons
      :candidates="candidates"
      :cur-step="curStep - 1"
      :group="currentGroup"
      :on-done="handleClearSelected"
    ></edit-buttons>
    <a-button
      v-show="[2, 5].includes(curStep)"
      :size="buttonSize"
      @click="
        curStep === 2 ? (showUploadModal = true) : (showStressTestModal = true)
      "
      >{{
        $t(
          curStep === 2
            ? 'common.operation.uploadTest'
            : 'common.operation.setStressTestTime',
        )
      }}
      <template v-if="curStep === 2" #icon><icon-upload /> </template>
    </a-button>
  </div>
  <a-modal
    v-model:visible="showUploadModal"
    :title="$t('common.operation.uploadTest')"
    :on-before-ok="handleUpload"
  >
    <a-form :model="uploadData" layout="vertical">
      <a-form-item field="group" :label="$t('common.user.group')">
        <a-select v-model="uploadData.group">
          <a-option v-for="item in groups" :key="item">{{ item }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="data">
        <a-upload
          v-model:file-list="uploadData.data"
          draggable
          :show-retry-button="false"
          :auto-upload="false"
          :limit="1"
        >
          <template #upload-button>
            <a-button class="w-full"
              >{{ $t('common.operation.uploadFile') }}
              <template #icon><icon-upload /> </template>
            </a-button>
          </template>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="showStressTestModal"
    :title="$t('common.operation.setStressTestTime')"
    :on-before-ok="handleSetStressTime"
  >
    <a-form ref="stressTestRef" :model="stressTestTimeData" layout="vertical">
      <a-form-item field="stressTestDate" :label="$t('common.date')" required>
        <a-date-picker v-model="stressTestTimeData.stressTestDate" />
      </a-form-item>
      <a-form-item field="stressTestTime" :label="$t('common.time')" required>
        <a-time-picker
          v-model="stressTestTimeData.stressTestTime"
          type="time-range"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref, defineModel } from 'vue';
import { Group, recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import { FileItem, Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import useWindowResize from '@/hooks/resize';
import candidateInfoCard from './candidate-info-card.vue';
import editButtons from './edit-buttons.vue';

const { widthType } = useWindowResize();
const buttonSize = computed(() =>
  widthType.value === 'sm' ? 'mini' : 'medium',
);

const { t } = useI18n();

const curStep = defineModel<number>({
  required: true,
});

const recStore = useRecruitmentStore();

const currentGroup = ref(Group.Web);
const groups = Object.values(Group).filter((x) => x !== Group.Unique);

const indeterminate = ref(false);
const checkedAll = ref(false);

const filteredApps = computed(() =>
  recStore.curApplications.filter(
    ({ step, group }) =>
      recruitSteps[curStep.value - 1].value.includes(step) &&
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
      step: app?.step ?? recruitSteps[curStep.value - 1].value[0],
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

watch([() => curStep, currentGroup, recStore], handleClearSelected);

const uploadData = ref<{ group: Ref<Group>; data: FileItem[] }>({
  group: currentGroup,
  data: [],
});

const showUploadModal = ref(false);

const handleUpload = async (): Promise<boolean> => {
  if (!uploadData.value.data[0]?.file) {
    Message.warning(t('common.operation.uploadFileFirst'));
    return false;
  }
  const res = await recStore.uploadTest(
    recStore.currentRid,
    uploadData.value.group,
    uploadData.value.data[0].file,
  );
  if (!res) return false;
  Message.success(t('common.result.uploadFileSuccess'));
  return true;
};

const stressTestTimeData = ref<{
  stressTestDate: string | undefined;
  stressTestTime: string[] | undefined;
}>({
  stressTestDate: undefined,
  stressTestTime: undefined,
});

const showStressTestModal = ref(false);
const stressTestRef = ref<any>(null);

const handleSetStressTime = async (): Promise<boolean> => {
  const validateError = await stressTestRef.value?.validate();
  if (validateError) return false;
  const [start, end] = stressTestTimeData.value.stressTestTime!.map((time) =>
    new Date(
      `${stressTestTimeData.value.stressTestDate} ${time}`,
    ).toISOString(),
  );
  const res = await recStore.SetStressTestTime(recStore.currentRid, {
    stress_test_start: start,
    stress_test_end: end,
  });
  if (!res) return false;
  Message.success(t('common.result.setStressTestTimeSuccess'));
  return true;
};
</script>

<style scoped lang="less">
:deep(.arco-upload-progress) {
  display: none;
}
</style>

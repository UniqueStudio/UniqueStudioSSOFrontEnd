<template>
  <div
    class="flex flex-0 justify-between mb-5 max-sm:absolute top-0 left-0 w-full bg-[--color-bg-1] h-10"
  >
    <div class="flex items-center">
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
      <!-- 搜索框 -->
      <a-input-search
        v-model="searchText"
        :placeholder="$t('common.operation.searchCandidate')"
        class="!w-48 ml-4"
        allow-clear
        size="small"
      />
    </div>
    <div class="hidden max-sm:flex items-center">
      <a-select
        v-model="curStep"
        :bordered="false"
        class="text-[rgb(var(--primary-6))] text-right"
      >
        <a-option
          v-for="(item, index) in recruitSteps"
          :key="item.i18Key"
          :value="index + 1"
          >{{ $t(item.i18Key) }}</a-option
        >
        <a-option :value="recruitSteps.length + 1">{{
          $t('common.steps.Fail')
        }}</a-option>
        <a-option :value="recruitSteps.length + 2">{{
          $t('common.steps.All')
        }}</a-option>
      </a-select>
    </div>
    <team-group-radio v-model="currentGroup"></team-group-radio>
  </div>
  <!-- @vue-ignore 由于逆变@change会报ts错误 -->
  <a-scrollbar
    ref="scrollbarRef"
    class="w-full flex-1 overflow-y-auto pr-0 sm:pr-[15px]"
    outer-class="w-full flex-1 flex flex-col overflow-y-hidden max-sm:pb-[40px]"
  >
    <a-checkbox-group
      v-model="selectedApplications"
      class="grid grid-cols-4 gap-x-4 gap-y-3 max-sm:shrink sm:grow max-[1035px]:grid-cols-1 max-[1410px]:grid-cols-2 max-[1775px]:grid-cols-3"
      @change="handleChange"
    >
      <candidate-info-card
        v-for="candidate in filteredApps"
        :key="candidate.uid"
        :info="candidate"
        :checked="selectedApplications.includes(candidate.uid)"
        :curstep="curStep"
      ></candidate-info-card>
    </a-checkbox-group>

    <!-- 已淘汰选手折叠区域 -->
    <div v-if="eliminatedApps.length > 0 && curStep !== 9" class="mt-4">
      <div
        class="flex items-center cursor-pointer select-none text-[--color-text-3] hover:text-[rgb(var(--primary-6))] transition-colors py-2"
        @click="eliminatedExpanded = !eliminatedExpanded"
      >
        <icon-down
          class="mr-1 transition-transform"
          :class="{ 'rotate-[-90deg]': !eliminatedExpanded }"
        />
        <span class="text-sm">
          {{
            $t('common.candidate.eliminated', { count: eliminatedApps.length })
          }}
        </span>
      </div>
      <a-checkbox-group
        v-if="eliminatedExpanded"
        v-model="selectedApplications"
        class="grid grid-cols-4 gap-x-4 gap-y-3 max-sm:shrink sm:grow max-[1035px]:grid-cols-1 max-[1410px]:grid-cols-2 max-[1775px]:grid-cols-3 opacity-70"
        @change="handleChange"
      >
        <candidate-info-card
          v-for="candidate in eliminatedApps"
          :key="candidate.uid"
          :info="candidate"
          :checked="selectedApplications.includes(candidate.uid)"
          :curstep="curStep"
        ></candidate-info-card>
      </a-checkbox-group>
    </div>
  </a-scrollbar>

  <div
    class="flex justify-between justify-self-end flex-row-reverse max-sm:fixed bottom-0 left-0 w-full bg-[--color-bg-1] p-2"
  >
    <!-- curStep从1开始算，传入edi-button时进行-1操作 -->
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
        <!-- 使用 label 插槽自定义标题 -->
        <template #label>
          {{ $t('common.operation.uploadFile') }}
          <a-tooltip :content="$t('common.operation.uploadFileOrUrl')">
            <icon-info-circle
              style="margin-left: 4px; color: var(--color-text-3); cursor: help"
            />
          </a-tooltip>
        </template>

        <a-upload
          v-model:file-list="uploadData.data"
          draggable
          :show-retry-button="false"
          :auto-upload="false"
          :limit="1"
        >
          <template #upload-button>
            <a-button class="w-full">
              <template #icon><icon-upload /></template>
              {{ $t('common.operation.uploadFile') }}
            </a-button>
          </template>
        </a-upload>
      </a-form-item>
      <a-form-item field="url" :label="$t('common.operation.uploadUrl')">
        <a-input
          v-model="uploadData.url"
          placeholder="https://example.com/test.pdf"
        />
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
import {
  ref,
  computed,
  watch,
  Ref,
  onActivated,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { debounce } from 'lodash';
import { Group, Step, recruitSteps } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import { FileItem, Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import useWindowResize from '@/hooks/resize';
import candidateInfoCard from './candidate-info-card.vue';
import editButtons from './edit-buttons.vue';

// 因为进入缓存状态后的Scroll会重置，这里提前保存，在返回时自动滑动到之前的地方
// 用onDeactivated不行，可能是因为在移除后执行的原因
const scrollbarRef = ref<any>(null);
// 无法ref这个元素，只能使用丑陋的方法
const checkboxGroupRef = computed<HTMLElement | undefined>(
  () => scrollbarRef.value?.$el.children?.[0],
);
const checkboxGroupScrollTop = ref<number>(0);
onActivated(() => {
  if (checkboxGroupRef.value) {
    checkboxGroupRef.value.scrollTo(0, checkboxGroupScrollTop.value);
  }
});
const onCheckboxGroupScroll = debounce(
  (e) => {
    checkboxGroupScrollTop.value = e.target.scrollTop;
  },
  100,
  { trailing: true },
);

onMounted(() => {
  if (checkboxGroupRef.value) {
    checkboxGroupRef.value.addEventListener('scroll', onCheckboxGroupScroll);
  }
});

onBeforeUnmount(() => {
  if (checkboxGroupRef.value) {
    checkboxGroupRef.value.removeEventListener('scroll', onCheckboxGroupScroll);
  }
});

const { widthType } = useWindowResize();
const buttonSize = computed(() =>
  widthType.value === 'sm' ? 'mini' : 'medium',
);

const { t } = useI18n();

const curStep = defineModel<number>('curStep', {
  required: true,
});
const currentGroup = defineModel<Group>('currentGroup', {
  required: true,
});

watch(curStep, () => {
  if (checkboxGroupRef.value) {
    checkboxGroupRef.value.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
});

const recStore = useRecruitmentStore();

const groups = Object.values(Group).filter((x) => x !== Group.Unique);

const indeterminate = ref(false);
const checkedAll = ref(false);

const StepsOrder = Object.values(Step).reduce(
  (res, x) => {
    res[x] = recruitSteps.findIndex(({ value }) => value.includes(x));
    return res;
  },
  {} as Record<Step, number>,
);

// 搜索
const searchText = ref('');

const applySearch = <T extends { user_detail?: { name?: string } }>(
  list: T[],
): T[] => {
  if (!searchText.value.trim()) return list;
  const keyword = searchText.value.trim().toLowerCase();
  return list.filter(
    (app) => app.user_detail?.name?.toLowerCase().includes(keyword),
  );
};

const filteredApps = computed(() => {
  let baseList;
  if (curStep.value === 9) {
    // 已终止
    baseList = recStore.curApplications
      .filter(
        ({ group, abandoned, rejected }) =>
          group === currentGroup.value && (abandoned || rejected),
      )
      .sort((a, b) => {
        const StepCmp = StepsOrder[a.step] - StepsOrder[b.step];
        if (StepCmp !== 0) {
          return StepCmp;
        }
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
  } else if (curStep.value === 10) {
    // 全部（排除已淘汰，已淘汰显示在折叠区域）
    baseList = recStore.curApplications
      .filter(
        ({ group, abandoned, rejected }) =>
          group === currentGroup.value && !abandoned && !rejected,
      )
      .sort((a, b) => {
        const StepCmp = StepsOrder[a.step] - StepsOrder[b.step];
        if (StepCmp !== 0) {
          return StepCmp;
        }
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
  } else {
    baseList = recStore.curApplications
      .filter(
        ({ step, group, abandoned, rejected }) =>
          recruitSteps[curStep.value - 1].value.includes(step) &&
          group === currentGroup.value &&
          !abandoned &&
          !rejected,
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
  }
  return applySearch(baseList);
});

const eliminatedApps = computed(() => {
  let baseList;
  // 已终止视图不需要，主列表已包含
  if (curStep.value === 9) {
    return [];
  }
  if (curStep.value === 10) {
    // 全部视图：所有已淘汰选手
    baseList = recStore.curApplications
      .filter(
        ({ group, abandoned, rejected }) =>
          group === currentGroup.value && (abandoned || rejected),
      )
      .sort((a, b) => {
        const StepCmp = StepsOrder[a.step] - StepsOrder[b.step];
        if (StepCmp !== 0) {
          return StepCmp;
        }
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
  } else {
    // 普通阶段视图：当前阶段的已淘汰选手
    baseList = recStore.curApplications
      .filter(
        ({ step, group, abandoned, rejected }) =>
          recruitSteps[curStep.value - 1].value.includes(step) &&
          group === currentGroup.value &&
          (abandoned || rejected),
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
  }
  return applySearch(baseList);
});

const eliminatedExpanded = ref(false);

const selectedApplications = ref<string[]>([]);

const candidates = computed(() =>
  selectedApplications.value.map((selectId) => {
    const app = filteredApps.value.find(({ uid }) => uid === selectId);
    const alloGroup = app?.interview_allocations_group;
    const alloTeam = app?.interview_allocations_team;

    return {
      name: app?.user_detail?.name ?? '',
      aid: app?.uid ?? '',
      step: app?.step ?? recruitSteps[curStep.value - 1].value[0],
      abandoned: app?.abandoned ?? false,
      rejected: app?.rejected ?? false,
      groupInterviewTime: alloGroup?.uid ? alloGroup.start : '',
      teamInterviewTime: alloTeam?.uid ? alloTeam.start : '',
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

const handleChange = (values: any[]) => {
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

watch([curStep, currentGroup, recStore], handleClearSelected);

const uploadData = ref<{ group: Ref<Group>; data: FileItem[]; url: string }>({
  group: currentGroup,
  data: [],
  url: '',
});

const showUploadModal = ref(false);

const handleUpload = async (): Promise<boolean> => {
  if (!uploadData.value.data[0]?.file && !uploadData.value.url) {
    Message.warning(t('common.operation.uploadFileOrUrlFirst'));
    return false;
  }
  if (uploadData.value.data[0]?.file && uploadData.value.url) {
    Message.warning(t('common.operation.uploadFileOrUrlOnly'));
    return false;
  }
  const res = await recStore.uploadTest(
    recStore.currentRid,
    uploadData.value.group,
    uploadData.value.data[0]?.file || uploadData.value.url,
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

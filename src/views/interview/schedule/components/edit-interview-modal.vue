<template>
  <a-modal
    v-model:visible="visible"
    :title="modalTitle"
    :width="widthType === 'sm' ? '95%' : '580px'"
    @before-ok="handleBeforeOk"
    @cancel="handleCancel"
    @after-close="handleAfterClose"
  >
    <!-- 选手姓名和信息展示区 -->
    <div class="mb-5">
      <div class="flex items-center justify-between mb-2">
        <span
          class="font-semibold text-sm"
          :class="
            isOverLimit
              ? 'text-[rgb(var(--danger-6))]'
              : 'text-[--color-text-1]'
          "
        >
          {{ $t('common.operation.candidateInfo') }}
          ({{ currentSelectedCandidates.length }}/{{
            form.slotNumber || props.interview?.slot_number || 1
          }}人)
          <span v-if="isOverLimit" class="text-xs font-normal ml-1">
            (选择人数已超过最大人数)
          </span>
        </span>
      </div>

      <!-- 如果有选中的选手，展示选手信息卡片 -->
      <div
        v-if="currentSelectedCandidates.length > 0"
        class="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1"
      >
        <div
          v-for="candidate in currentSelectedCandidates"
          :key="candidate.uid"
          class="p-2 my-0.5 bg-[--color-fill-1]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <a-link
                class="font-semibold text-sm text-[rgb(var(--primary-6))]"
                @click="handleNavigateCandidate(candidate.uid)"
              >
                {{ candidate.name }}
                <icon-launch class="ml-1 text-xs" />
              </a-link>
              <a-tag v-if="candidate.stepText" size="small" color="arcoblue">
                {{ candidate.stepText }}
              </a-tag>
              <a-tag v-if="candidate.isEliminated" size="small" color="red"
                >已淘汰</a-tag
              >
            </div>
            <a-button
              v-if="!originalCandidateIds.includes(candidate.uid)"
              type="text"
              size="mini"
              status="danger"
              @click="removeCandidate(candidate.uid)"
            >
              移除
            </a-button>
            <a-tooltip
              v-else
              content="已安排选手不可在此移除，如需变更请前往其他场次直接调整"
            >
              <a-tag size="small" color="gray">移除</a-tag>
            </a-tooltip>
          </div>

          <p class="text-xs text-[--color-text-3] px-1 pt-1">
            {{ candidate.grade || '' }} · {{ candidate.major || '' }} ·
            {{ candidate.institute || '-' }}
          </p>
        </div>
      </div>

      <!-- 未分配选手时的提示 -->
      <div
        v-else
        class="py-4 px-3 bg-[--color-fill-1] rounded-md border border-dashed border-[--color-border-3] text-center text-xs text-[--color-text-3]"
      >
        暂未分配选手
      </div>
    </div>

    <!-- 面试时间段、上限人数与候选人选择表单 -->
    <a-form :model="form" layout="vertical">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a-form-item
          field="date"
          :label="$t('common.date') || '面试日期'"
          required
        >
          <a-date-picker v-model="form.date" class="w-full" />
        </a-form-item>

        <a-form-item
          field="timeRange"
          :label="$t('common.user.interviewTime') || '时间段（开始–结束）'"
          required
        >
          <a-time-picker
            v-model="form.timeRange"
            type="time-range"
            format="HH:mm"
            class="w-full"
          />
        </a-form-item>

        <a-form-item
          field="slotNumber"
          :label="$t('common.interview.slotNumber') || '最大人数'"
          :validate-status="isOverLimit ? 'error' : undefined"
          :help="
            isOverLimit
              ? `选择人数 (${form.candidateIds.length}人) 不能超过最大人数 (${form.slotNumber}人)`
              : undefined
          "
          required
        >
          <a-input-number
            v-model="form.slotNumber"
            :min="1"
            :max="50"
            placeholder="最大人数"
            class="w-full"
            @change="handleSlotNumberChange"
          />
        </a-form-item>
      </div>

      <a-form-item
        field="candidateIds"
        :label="
          $t('common.operation.candidateSelect') || '候选人选择（可多选）'
        "
        :validate-status="isOverLimit ? 'error' : undefined"
        :help="
          isOverLimit
            ? `选择人数 (${form.candidateIds.length}人) 不能超过最大人数 (${form.slotNumber}人)`
            : undefined
        "
      >
        <a-select
          v-model="form.candidateIds"
          multiple
          allow-search
          :allow-clear="originalCandidateIds.length === 0"
          :limit="form.slotNumber || 1"
          :max-tag-count="4"
          placeholder="从当前面试阶段的候选人中选择"
          @change="handleCandidateChange"
        >
          <template #tag="{ data }">
            <a-tag
              :closable="!originalCandidateIds.includes(data.value)"
              @close="removeCandidate(data.value)"
            >
              {{ data.label }}
            </a-tag>
          </template>
          <a-option
            v-for="item in eligibleCandidates"
            :key="item.uid"
            :value="item.uid"
            :label="item.label"
            :disabled="
              originalCandidateIds.includes(item.uid) ||
              (!form.candidateIds.includes(item.uid) &&
                (form.candidateIds.length >= (form.slotNumber || 1) ||
                  item.isEliminated))
            "
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <span class="font-medium text-[--color-text-1]">{{
                  item.name
                }}</span>
                <a-tag v-if="item.isEliminated" size="small" color="red"
                  >已淘汰</a-tag
                >
                <a-tag
                  v-else-if="originalCandidateIds.includes(item.uid)"
                  size="small"
                  color="gray"
                >
                  本场已安排
                </a-tag>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="item.allocatedText"
                  class="text-xs text-[--color-text-3]"
                >
                  {{ item.allocatedText }}
                </span>
                <span
                  v-if="
                    !form.candidateIds.includes(item.uid) &&
                    form.candidateIds.length >= (form.slotNumber || 1)
                  "
                  class="text-xs text-[rgb(var(--warning-6))]"
                >
                  已达人数上限
                </span>
                <a-tag
                  v-if="item.stepText"
                  size="small"
                  :color="item.isEliminated ? 'red' : 'blue'"
                >
                  {{ item.stepText }}
                </a-tag>
              </div>
            </div>
          </a-option>
        </a-select>
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <a-tooltip
          v-if="hasAssignedCandidates"
          content="该场次已安排候选人，请先将候选人安排至其他场次"
        >
          <span>
            <a-button type="text" status="danger" disabled>
              <template #icon><icon-delete /></template>
              删除场次
            </a-button>
          </span>
        </a-tooltip>
        <a-popconfirm
          v-else
          :content="
            $t('common.operation.confirmDeleteInterview') ||
            '确定要删除该面试场次吗？'
          "
          type="warning"
          @ok="handleDelete"
        >
          <a-button type="text" status="danger">
            <template #icon><icon-delete /></template>
            删除场次
          </a-button>
        </a-popconfirm>
        <div class="flex items-center gap-2">
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" :loading="loading" @click="handleBeforeOk">
            确定
          </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { Group, Period, PeriodDefineHour, Step } from '@/constants/team';
import { Interview } from '@/constants/httpMsg/interview/getInterviewMsg';
import useRecruitmentStore from '@/store/modules/recruitment';
import { allocateApplicationInterview } from '@/api/application';
import { HR_BASE_URL } from '@/constants';
import useWindowResize from '@/hooks/resize';

const props = defineProps({
  interview: {
    type: Object as PropType<Interview | null>,
    default: null,
  },
  currentGroup: {
    type: String as PropType<Group>,
    default: Group.Web,
  },
});

const emits = defineEmits(['success']);

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
  required: true,
});

const router = useRouter();
const { t } = useI18n();
const { widthType } = useWindowResize();
const recStore = useRecruitmentStore();

// 是否为团队面试（由场次名称或当前选中的组别判断）
const isTeamInterview = computed(() => {
  return (
    (props.interview?.name as string) === 'unique' ||
    (props.interview?.name as string) === (Group.Unique as string) ||
    (props.currentGroup as string) === (Group.Unique as string)
  );
});

const loading = ref(false);

const form = ref<{
  date: string;
  timeRange: string[];
  slotNumber: number;
  candidateIds: string[];
}>({
  date: '',
  timeRange: [],
  slotNumber: 1,
  candidateIds: [],
});

const originalCandidateIds = ref<string[]>([]);

// 严格以 props.interview 和 recStore.curApplications 为准重置表单状态，放弃未保存修改
function initFormFromProps() {
  const item = props.interview;
  if (item && item.start && item.end) {
    const date = dayjs(item.start).format('YYYY-MM-DD');
    const startTime = dayjs(item.start).format('HH:mm');
    const endTime = dayjs(item.end).format('HH:mm');
    form.value.date = date;
    form.value.timeRange = [startTime, endTime];
    form.value.slotNumber = item.slot_number || 1;

    const isTeam = isTeamInterview.value;
    const assigned = recStore.curApplications.filter((app) => {
      if (!isTeam && app.group !== props.currentGroup) return false;
      const allo = isTeam
        ? app.interview_allocations_team
        : app.interview_allocations_group;
      return allo?.uid === item.uid;
    });

    const initialIds = assigned.map((app) => app.uid);
    form.value.candidateIds = [...initialIds];
    originalCandidateIds.value = [...initialIds];
  } else {
    form.value = {
      date: '',
      timeRange: [],
      slotNumber: 1,
      candidateIds: [],
    };
    originalCandidateIds.value = [];
  }
}

// 点击选手名跳转详情并自动关闭弹窗
const handleNavigateCandidate = (uid: string) => {
  initFormFromProps();
  visible.value = false;
  router.push(`/overview/candidate-detail/${uid}`);
};

const calcPeriod = (time: Date): Period => {
  const hour = time.getHours();
  if (hour >= PeriodDefineHour.morning[0] && hour < PeriodDefineHour.morning[1])
    return Period.Morning;
  if (
    hour >= PeriodDefineHour.afternoon[0] &&
    hour < PeriodDefineHour.afternoon[1]
  )
    return Period.Afternoon;
  return Period.Evening;
};

// 选中的候选人详细信息列表
const currentSelectedCandidates = computed(() => {
  return form.value.candidateIds.map((id) => {
    const app = recStore.curApplications.find((a) => a.uid === id);
    const name = app?.user_detail?.name || '未知选手';
    const stepText = app?.step ? t(`common.steps.${app.step}`) || app.step : '';
    const isEliminated = Boolean(app?.abandoned || app?.rejected);
    return {
      uid: id,
      name,
      phone: app?.user_detail?.phone || '',
      email: app?.user_detail?.email || '',
      grade: app?.grade || '',
      institute: app?.institute || '',
      major: app?.major || '',
      group: app?.group || '',
      step: app?.step,
      stepText,
      isEliminated,
    };
  });
});

// 检查选择人数是否超过最大人数
const isOverLimit = computed(() => {
  const maxSlot = Number(form.value.slotNumber) || 1;
  return form.value.candidateIds.length > maxSlot;
});

// 当候选人选择变更时的校验
const handleCandidateChange = (values: any) => {
  const arr = Array.isArray(values) ? values : [];
  // 校验是否有原有候选人被取消
  const missingOriginals = originalCandidateIds.value.filter(
    (id) => !arr.includes(id),
  );
  if (missingOriginals.length > 0) {
    Message.warning(
      '已安排的候选人不能直接取消，如需变更请前往目标场次直接安排',
    );
    const ensured = Array.from(
      new Set([...originalCandidateIds.value, ...arr]),
    );
    const maxSlot = Number(form.value.slotNumber) || 1;
    form.value.candidateIds = ensured.slice(0, maxSlot);
    return;
  }

  const maxSlot = Number(form.value.slotNumber) || 1;
  if (arr.length > maxSlot) {
    Message.warning(
      `选择人数 (${arr.length}人) 不能超过最大人数 (${maxSlot}人)`,
    );
    form.value.candidateIds = arr.slice(0, maxSlot);
  }
};

// 当最大人数发生改变时的校验
const handleSlotNumberChange = (val: number | undefined) => {
  const maxSlot = Number(val) || 1;
  if (form.value.candidateIds.length > maxSlot) {
    Message.warning(
      `选择人数 (${form.value.candidateIds.length}人) 已超过最大人数 (${maxSlot}人)，请调整选手或增加最大人数`,
    );
  }
};

// 弹窗标题：动态显示选手姓名
const modalTitle = computed(() => {
  if (currentSelectedCandidates.value.length > 0) {
    const names = currentSelectedCandidates.value.map((c) => c.name).join('、');
    return `选手面试安排：${names}`;
  }
  return '面试安排（未分配选手）';
});

// 从已选中列表中移除某候选人
const removeCandidate = (uid: string) => {
  if (originalCandidateIds.value.includes(uid)) {
    Message.warning(
      '已安排的候选人不能直接取消，如需变更请前往目标场次直接安排',
    );
    return;
  }
  form.value.candidateIds = form.value.candidateIds.filter((id) => id !== uid);
};

// 候选人列表（供下拉选择与回显）
const eligibleCandidates = computed(() => {
  const isTeam = isTeamInterview.value;
  const allowedSteps = isTeam
    ? [Step.TeamInterview, Step.TeamTimeSelection, Step.OnlineTeamInterview]
    : [Step.GroupInterview, Step.GroupTimeSelection, Step.OnlineGroupInterview];

  const list = recStore.curApplications
    .filter((app) => {
      // 如果该候选人当前已被此场次选中，必须包含在选项中，以确保输入框正常显示姓名而非ID
      if (form.value.candidateIds.includes(app.uid)) {
        return true;
      }
      // 供新选择的候选人：必须未淘汰、属于当前组，且处于对应的面试阶段
      if (app.abandoned || app.rejected) return false;
      if (!isTeam && app.group !== props.currentGroup) return false;
      if (!allowedSteps.includes(app.step)) return false;
      return true;
    })
    .map((app) => {
      const name = app.user_detail?.name || '未知选手';
      const stepText = app.step
        ? t(`common.steps.${app.step}`) || app.step
        : '';
      const isEliminated = Boolean(app.abandoned || app.rejected);
      const allo = isTeam
        ? app.interview_allocations_team
        : app.interview_allocations_group;
      let allocatedText = '';
      if (allo && allo.uid && allo.uid !== props.interview?.uid) {
        allocatedText = `已分配: ${dayjs(allo.start).format('MM-DD HH:mm')}`;
      }
      const statusText = isEliminated ? ' (已淘汰)' : '';
      return {
        uid: app.uid,
        name,
        step: app.step,
        stepText,
        isEliminated,
        allocatedText,
        label: `${name}${statusText}`,
      };
    });

  // 兜底保护：若已选 ID 不在 curApplications 中，也提供兜底选项防止出现原始ID
  form.value.candidateIds.forEach((id) => {
    if (!list.some((item) => item.uid === id)) {
      list.push({
        uid: id,
        name: '未知选手',
        step: '' as any,
        stepText: '',
        isEliminated: true,
        allocatedText: '',
        label: '未知选手 (已淘汰)',
      });
    }
  });

  return list.sort((a, b) =>
    a.name.localeCompare(b.name, 'zh-Hans-CN', { numeric: true }),
  );
});

// 监听弹窗显示与 interview 变化，每次打开时严格以最新真实数据重置表单
watch(
  [() => visible.value, () => props.interview],
  ([newVisible]) => {
    if (newVisible) {
      initFormFromProps();
    }
  },
  { immediate: true },
);

// 取消/关闭弹窗：放弃所有未提交修改
const handleCancel = () => {
  initFormFromProps();
  visible.value = false;
};

// 弹窗完全关闭后清理状态
const handleAfterClose = () => {
  initFormFromProps();
};

// 是否已分配选手（用于控制删除按钮状态）
const hasAssignedCandidates = computed(() => {
  if (!props.interview) return false;
  const isTeam = isTeamInterview.value;
  return recStore.curApplications.some((app) => {
    if (!isTeam && app.group !== props.currentGroup) return false;
    const allo = isTeam
      ? app.interview_allocations_team
      : app.interview_allocations_group;
    return allo?.uid === props.interview?.uid;
  });
});

const safeDeleteInterview = async (
  rid: string,
  group: string,
  iid: string,
): Promise<boolean> => {
  if (!rid || !iid) return false;
  try {
    const url = `${HR_BASE_URL}/recruitments/${rid}/interviews/${group}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify([{ iid }]),
    });
    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return json?.code === 200;
    }
    return false;
  } catch {
    return false;
  }
};

const resolveTargetInterviewId = async (
  createRes: any,
  targetGroup: string,
  expectedStart: Date,
  expectedEnd: Date,
  excludeUid?: string,
): Promise<string> => {
  // 1. 尝试直接从创建接口返回值获取 uid
  if (Array.isArray(createRes) && createRes.length > 0 && createRes[0]?.uid) {
    return createRes[0].uid;
  }
  if (createRes && typeof createRes === 'object') {
    if (createRes.uid) return createRes.uid;
    if (Array.isArray(createRes.interviews) && createRes.interviews[0]?.uid) {
      return createRes.interviews[0].uid;
    }
    if (Array.isArray(createRes.data) && createRes.data[0]?.uid) {
      return createRes.data[0].uid;
    }
  }

  const expectedStartStr = dayjs(expectedStart).format('YYYY-MM-DD HH:mm');
  const expectedEndStr = dayjs(expectedEnd).format('YYYY-MM-DD HH:mm');
  const targetGroupLower = (targetGroup || '').toLowerCase();

  const searchInCurInterviews = () => {
    return recStore.curInterviews.find((i) => {
      if (excludeUid && i.uid === excludeUid) return false;
      const iGroup = (i.name || '').toLowerCase();
      if (iGroup !== targetGroupLower) return false;

      const sMatch =
        dayjs(i.start).format('YYYY-MM-DD HH:mm') === expectedStartStr ||
        dayjs(i.start).isSame(dayjs(expectedStart), 'minute');
      const eMatch =
        dayjs(i.end).format('YYYY-MM-DD HH:mm') === expectedEndStr ||
        dayjs(i.end).isSame(dayjs(expectedEnd), 'minute');

      return sMatch && eMatch;
    });
  };

  // 2. 刷新后在 curInterviews 中查找
  await recStore.refresh();
  let match = searchInCurInterviews();
  if (match?.uid) return match.uid;

  // 3. 稍候 300ms 再次刷新查询（以防后端事务延迟）
  await new Promise((r) => {
    setTimeout(r, 300);
  });
  await recStore.refresh();
  match = searchInCurInterviews();
  if (match?.uid) return match.uid;

  // 4. 兜底策略：寻找该组别在该日期新加入的非排除场次
  const dateStr = dayjs(expectedStart).format('YYYY-MM-DD');
  const fallback = recStore.curInterviews.find((i) => {
    if (excludeUid && i.uid === excludeUid) return false;
    const iGroup = (i.name || '').toLowerCase();
    return (
      iGroup === targetGroupLower &&
      dayjs(i.start).format('YYYY-MM-DD') === dateStr
    );
  });
  if (fallback?.uid) return fallback.uid;

  return '';
};

const handleDelete = async () => {
  if (!props.interview) return;
  const isTeam = isTeamInterview.value;
  const groupToUse = isTeam
    ? 'unique'
    : props.interview?.name || props.currentGroup;

  const assigned = recStore.curApplications.filter((app) => {
    if (!isTeam && app.group !== props.currentGroup) return false;
    const allo = isTeam
      ? app.interview_allocations_team
      : app.interview_allocations_group;
    return allo?.uid === props.interview?.uid;
  });

  if (assigned.length > 0) {
    const names = assigned
      .map((a) => a.user_detail?.name || '未知选手')
      .join('、');
    Message.warning(
      `该场次已安排候选人（${names}），请先将候选人安排至其他场次后再删除该场次。`,
    );
    return;
  }

  try {
    loading.value = true;
    const ok = await safeDeleteInterview(
      recStore.currentRid,
      groupToUse,
      props.interview.uid,
    );
    if (!ok) {
      Message.error('删除面试场次失败');
      return;
    }
    await recStore.refresh();
    Message.success('已删除该面试场次');
    visible.value = false;
    emits('success');
  } catch (error: any) {
    Message.error(error?.message || '删除面试场次失败');
  } finally {
    loading.value = false;
  }
};

const handleBeforeOk = async () => {
  if (!props.interview) return false;
  if (
    !form.value.date ||
    !form.value.timeRange ||
    form.value.timeRange.length < 2
  ) {
    Message.warning('请选择完整的面试日期和时间段');
    return false;
  }

  const [startTime, endTime] = form.value.timeRange;
  const dateStr = dayjs(form.value.date).format('YYYY-MM-DD');
  const startDate = dayjs(`${dateStr} ${startTime}`)
    .second(0)
    .millisecond(0)
    .toDate();
  const endDate = dayjs(`${dateStr} ${endTime}`)
    .second(0)
    .millisecond(0)
    .toDate();

  if (startDate.getTime() >= endDate.getTime()) {
    Message.warning('结束时间必须晚于开始时间');
    return false;
  }

  const maxSlot = Number(form.value.slotNumber) || 1;
  if (form.value.candidateIds.length > maxSlot) {
    Message.warning(
      `选择人数 (${form.value.candidateIds.length}人) 不能超过最大人数 (${maxSlot}人)`,
    );
    return false;
  }

  loading.value = true;
  try {
    const origStart = dayjs(props.interview.start).format('YYYY-MM-DD HH:mm');
    const origEnd = dayjs(props.interview.end).format('YYYY-MM-DD HH:mm');
    const newStartStr = dayjs(startDate).format('YYYY-MM-DD HH:mm');
    const newEndStr = dayjs(endDate).format('YYYY-MM-DD HH:mm');
    const timeChanged = origStart !== newStartStr || origEnd !== newEndStr;
    const slotNumberChanged =
      Number(form.value.slotNumber) !== Number(props.interview.slot_number);

    const isTeam = isTeamInterview.value;
    const groupKey = isTeam
      ? 'unique'
      : props.interview?.name || props.currentGroup;
    const groupToCreate = (
      isTeam ? Group.Unique : props.interview?.name || props.currentGroup
    ) as Group;
    const interviewType: 'team' | 'group' = isTeam ? 'team' : 'group';

    // 检查原场次当前是否已安排选手
    const hasOriginallyAssigned = originalCandidateIds.value.length > 0;
    let targetInterviewId = props.interview.uid;

    if (timeChanged) {
      // 时间发生变更：先检查新时间段是否与其他已有场次重合冲突
      const targetGroupName = (groupKey || '').toLowerCase();
      const hasTimeConflict = recStore.curInterviews.some((i) => {
        if (i.uid === props.interview?.uid) return false;
        const iGroup = (i.name || '').toLowerCase();
        if (iGroup !== targetGroupName) return false;
        return (
          (dayjs(i.start).format('YYYY-MM-DD HH:mm') === newStartStr ||
            dayjs(i.start).isSame(dayjs(startDate), 'minute')) &&
          (dayjs(i.end).format('YYYY-MM-DD HH:mm') === newEndStr ||
            dayjs(i.end).isSame(dayjs(endDate), 'minute'))
        );
      });

      if (hasTimeConflict) {
        Message.warning('该时间段已存在相同的面试场次，请调整时间段');
        return false;
      }

      const newStartIso = startDate.toISOString();
      const newEndIso = endDate.toISOString();
      const targetSlotNumber = Math.max(
        Number(form.value.slotNumber) || 1,
        form.value.candidateIds.length,
      );

      // 1. 创建新时间段场次
      const createRes = await recStore.createInterview(groupToCreate, [
        {
          date: new Date(dateStr).toISOString(),
          period: calcPeriod(startDate),
          start: newStartIso,
          end: newEndIso,
          slot_number: targetSlotNumber,
        },
      ]);

      // 2. 解析新场次 UID
      targetInterviewId = await resolveTargetInterviewId(
        createRes,
        groupKey,
        startDate,
        endDate,
        props.interview.uid,
      );

      if (!targetInterviewId) {
        throw new Error('未能匹配到新建的面试场次，未能完成候选人安排');
      }

      // 3. 将候选人迁移/安排至新场次
      await form.value.candidateIds.reduce<Promise<void>>(
        (chain, aid) =>
          chain.then(async () => {
            const res = await allocateApplicationInterview(aid, interviewType, {
              interview_id: targetInterviewId,
            });
            if (!res) {
              // 分配结果为空，不阻断流程
            }
          }),
        Promise.resolve(),
      );

      // 4. 清理旧场次（使用 fetch 避免被 Axios 拦截器弹窗拦截）
      await safeDeleteInterview(
        recStore.currentRid,
        groupToCreate,
        props.interview.uid,
      );
    } else {
      // 时间未变：
      // 如果原场次无选手占用，且修改了上限人数，可安全通过先删后建来更新 slot_number
      if (!hasOriginallyAssigned && slotNumberChanged) {
        await safeDeleteInterview(
          recStore.currentRid,
          groupToCreate,
          props.interview.uid,
        );
        const newStartIso = startDate.toISOString();
        const newEndIso = endDate.toISOString();
        const createRes = await recStore.createInterview(groupToCreate, [
          {
            date: new Date(dateStr).toISOString(),
            period: calcPeriod(startDate),
            start: newStartIso,
            end: newEndIso,
            slot_number: Number(form.value.slotNumber) || 1,
          },
        ]);
        const resolvedId = await resolveTargetInterviewId(
          createRes,
          groupKey,
          startDate,
          endDate,
          props.interview.uid,
        );
        if (resolvedId) {
          targetInterviewId = resolvedId;
        }
      }

      // 保存新选中的候选人安排到当前场次
      await form.value.candidateIds.reduce<Promise<void>>(
        (chain, aid) =>
          chain.then(async () => {
            if (
              targetInterviewId !== props.interview?.uid ||
              !originalCandidateIds.value.includes(aid)
            ) {
              await allocateApplicationInterview(aid, interviewType, {
                interview_id: targetInterviewId,
              });
            }
          }),
        Promise.resolve(),
      );
    }

    await recStore.refresh();
    Message.success('保存面试安排成功');
    visible.value = false;
    emits('success');
    return true;
  } catch (error: any) {
    Message.error(error?.message || '保存失败，请稍后重试');
    return false;
  } finally {
    loading.value = false;
  }
};
</script>

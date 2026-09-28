<template>
  <div
    class="bg-[--color-bg-2] w-full h-full p-5 rounded-sm flex flex-col overflow-hidden"
  >
    <!-- 统一页面标题 -->
    <div class="text-[--color-text-1] text-xl pb-5 hidden sm:flex font-medium">
      {{ $t('menu.interview.schedule') }}
    </div>

    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center pb-4 flex-wrap gap-4">
      <!-- 左侧：今天、周别切换控制器、阳历范围、状态图例 -->
      <div class="flex items-center flex-wrap gap-3">
        <!-- 今天按钮 -->
        <a-button @click="handleJumpToday"> 今天 </a-button>

        <!-- 周别切换按钮组（符合 Arco Design 组件规范） -->
        <a-button-group>
          <a-button @click="handlePrevWeek">
            <template #icon><icon-left /></template>
          </a-button>

          <!-- 中间周别选择下拉菜单 -->
          <a-dropdown trigger="click" @select="handleSelectWeek">
            <a-button>
              <span>{{ currentWeekDisplay }}</span>
              <icon-down class="ml-1.5 text-xs text-[--color-text-3]" />
            </a-button>
            <template #content>
              <a-scrollbar class="max-h-72 overflow-y-auto">
                <a-doption
                  v-for="item in weekOptions"
                  :key="item.value"
                  :value="item.value"
                  :class="{
                    'text-[rgb(var(--primary-6))] font-bold bg-[var(--color-fill-2)]':
                      item.isCurrentView,
                  }"
                >
                  <div
                    class="flex items-center justify-between w-full py-0.5 gap-4"
                  >
                    <span>{{ item.label }}</span>
                    <span
                      v-if="item.isCurrentView"
                      class="text-xs text-[rgb(var(--primary-6))]"
                    >
                    </span>
                  </div>
                </a-doption>
              </a-scrollbar>
            </template>
          </a-dropdown>

          <!-- 右箭头：到最新一周时置灰不可点击 -->
          <a-button :disabled="isLatestWeek" @click="handleNextWeek">
            <template #icon><icon-right /></template>
          </a-button>
        </a-button-group>

        <!-- 对应阳历区间提示：2月2号 - 2月8号 -->
        <span
          class="text-sm text-[--color-text-3] font-medium hidden sm:inline-block"
        >
          {{ weekDateRangeText }}
        </span>
      </div>

      <!-- 右侧：添加场次按钮 + 复用组别选择组件 -->
      <div class="flex items-center gap-3">
        <a-button type="outline" @click="handleOpenAddModal">
          <template #icon><icon-plus /></template>
          添加场次
        </a-button>

        <team-group-radio v-model="currentGroup" />
      </div>
    </div>

    <!-- 周日程主网格容器 -->
    <div
      class="flex-1 flex flex-col overflow-hidden relative border border-[--color-border-2] rounded-sm"
    >
      <!-- 统一滚动容器：同时支持水平和垂直滚动，小屏下列标题与网格内容完美同步横向滚动 -->
      <div
        ref="gridScrollRef"
        class="flex-1 overflow-y-auto overflow-x-auto relative"
      >
        <div class="min-w-[780px] flex flex-col relative">
          <!-- 表头：横轴（周几 + 阳历日期） 粘性固定在顶部 -->
          <div
            class="sticky top-0 z-30 flex border-b border-[--color-border-2] bg-[--color-fill-1]"
          >
            <!-- 左上角时间标头：粘性固定在左上角 -->
            <div
              class="sticky left-0 top-0 z-40 w-16 sm:w-20 shrink-0 border-r border-[--color-border-2] flex items-center justify-center py-2.5 bg-[--color-fill-1]"
            >
              <span class="text-xs text-[--color-text-3] font-medium"
                >时间</span
              >
            </div>

            <!-- 7天表头列 (周一至周日) -->
            <div class="flex-1 grid grid-cols-7">
              <div
                v-for="day in weekDays"
                :key="day.dateStr"
                class="flex flex-col items-center justify-center py-2 border-r last:border-r-0 border-[--color-border-2] transition-colors"
              >
                <!-- 星期几 -->
                <span
                  class="text-xs transition-colors"
                  :class="
                    day.isToday
                      ? 'text-[rgb(var(--primary-6))] font-medium'
                      : 'text-[--color-text-3]'
                  "
                >
                  {{ day.dayName }}
                </span>

                <!-- 日期圆圈（遵循 Arco Calendar 设计规范：今天呈现蓝色实心圆） -->
                <div
                  class="w-6 h-6 mt-0.5 rounded-full flex items-center justify-center text-xs transition-colors"
                  :class="
                    day.isToday
                      ? 'bg-[rgb(var(--primary-6))] text-white font-medium shadow-sm'
                      : 'text-[--color-text-1] font-medium'
                  "
                >
                  {{ day.dayNumber }}
                </div>
              </div>
            </div>
          </div>

          <!-- 网格主体：纵轴（08:00 - 24:00） + 7天卡片区 -->
          <div
            class="flex relative"
            :style="{ height: `${TOTAL_GRID_HEIGHT}px` }"
          >
            <!-- 纵轴：时间列 (08:00 - 23:00，不显示8点之前)，粘性固定在左侧 -->
            <div
              class="sticky left-0 z-20 w-16 sm:w-20 shrink-0 border-r border-[--color-border-2] bg-[--color-bg-2] select-none"
            >
              <div
                v-for="h in HOURS_COUNT"
                :key="h"
                class="border-b border-[--color-border-2] flex items-start justify-end pr-2 pt-1 text-right"
                :style="{ height: `${HOUR_HEIGHT}px` }"
              >
                <span class="text-xs text-[--color-text-3] leading-none">
                  {{ formatHourLabel(START_HOUR + h - 1).periodText }}
                </span>
              </div>
            </div>

            <!-- 7天日历网格区 -->
            <div class="flex-1 grid grid-cols-7 relative">
              <div
                v-for="day in weekDays"
                :key="day.dateStr"
                class="border-r last:border-r-0 border-[--color-border-2] relative h-full"
              >
                <!-- 背景小时网格线 -->
                <div
                  v-for="h in HOURS_COUNT"
                  :key="h"
                  class="border-b border-[--color-border-2] hover:bg-[--color-fill-1] transition-colors cursor-pointer"
                  :style="{ height: `${HOUR_HEIGHT}px` }"
                  :title="`点击在 ${day.solarDate} ${String(
                    START_HOUR + h - 1,
                  ).padStart(2, '0')}:00 添加场次`"
                  @click="handleGridSlotClick(day.dateStr, START_HOUR + h - 1)"
                ></div>

                <!-- 当天实时时间红线指示器 -->
                <div
                  v-if="
                    day.isToday &&
                    currentDayTimeOffset >= 0 &&
                    currentDayTimeOffset <= TOTAL_GRID_HEIGHT
                  "
                  class="absolute left-0 right-0 z-[15] pointer-events-none flex items-center"
                  :style="{ top: `${currentDayTimeOffset}px` }"
                >
                  <div class="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
                  <div class="flex-1 h-[2px] bg-red-500"></div>
                </div>

                <!-- 当天所有面试安排卡片 -->
                <div
                  v-for="card in getDayCards(day.dateStr)"
                  :key="card.uid"
                  class="absolute border border-[--color-border-2] hover:opacity-80 cursor-pointer transition-all duration-150 z-10 hover:z-[18] overflow-hidden flex flex-col justify-center"
                  :class="
                    card.candidateNames.length > 0
                      ? 'bg-[#165dff] text-white'
                      : 'bg-[#86909c] text-white'
                  "
                  :style="card.style"
                  :title="`${card.timeRangeText}\n${
                    card.candidateNames.length > 0
                      ? '候选人: ' + card.candidateNames.join(', ')
                      : '未安排'
                  }`"
                  @click.stop="handleOpenEditModal(card.rawInterview)"
                >
                  <!-- 卡片信息保持简洁，只展示选手姓名 -->
                  <div
                    class="flex-1 flex flex-wrap items-center justify-center content-center overflow-hidden px-1 py-0.5 gap-x-1.5 gap-y-0.5 text-center"
                  >
                    <template v-if="card.candidateNames.length > 0">
                      <span
                        v-for="name in card.candidateNames"
                        :key="name"
                        class="text-xs font-medium leading-tight whitespace-nowrap"
                      >
                        {{ name }}
                      </span>
                    </template>
                    <template v-else>
                      <span
                        class="text-xs text-white/90 leading-tight whitespace-nowrap font-normal"
                      >
                        未安排
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑面试安排弹窗 -->
    <edit-interview-modal
      v-model:visible="showEditModal"
      :interview="selectedInterview"
      :current-group="currentGroup"
      @success="handleDataUpdated"
    />

    <!-- 添加日程弹窗（复用面试管理模块中的 add-date-modal） -->
    <add-date-modal
      v-model:visible="showAddModal"
      :current-group-start="currentGroup"
      :initial-date="addModalInitDate"
      :initial-time-range="addModalInitTimeRange"
      @success="handleDataUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import { Group } from '@/constants/team';
import useRecruitmentStore from '@/store/modules/recruitment';
import TeamGroupRadio from '@/views/components/team-group-radio.vue';
import { Interview } from '@/constants/httpMsg/interview/getInterviewMsg';
import AddDateModal from '@/views/interview/management/add-date-modal.vue';
import EditInterviewModal from './components/edit-interview-modal.vue';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

// 网格常量定义：每小时90px高度（即每分钟1.5px），从早上8点开始，不显示8点之前
const START_HOUR = 8;
const END_HOUR = 24; // 8点至24点
const HOURS_COUNT = END_HOUR - START_HOUR; // 16个小时
const HOUR_HEIGHT = 90;
const TOTAL_GRID_HEIGHT = HOURS_COUNT * HOUR_HEIGHT; // 16 * 90 = 1440px

const recStore = useRecruitmentStore();
const currentGroup = ref<Group>(Group.Web);

// 当前查看的周基准日期（始终定位到该周的周一）
const currentWeekDate = ref<Dayjs>(dayjs().startOf('isoWeek'));

// 滚动条引用
const gridScrollRef = ref<HTMLElement | null>(null);

// 弹窗状态
const showEditModal = ref(false);
const showAddModal = ref(false);
const selectedInterview = ref<Interview | null>(null);

const addModalInitDate = ref('');
const addModalInitTimeRange = ref<string[]>([]);

// 计算最新的一周（取当前日期和所有面试日期中的最大周）
const latestWeekStart = computed(() => {
  let latest = dayjs().startOf('isoWeek');
  recStore.curInterviews.forEach((interview) => {
    if (interview.start) {
      const interviewWeek = dayjs(interview.start).startOf('isoWeek');
      if (interviewWeek.isAfter(latest)) {
        latest = interviewWeek;
      }
    }
  });
  return latest;
});

// 是否处于最新一周（到最新一周时右箭头置灰不可点击）
const isLatestWeek = computed(() => {
  return (
    currentWeekDate.value
      .startOf('isoWeek')
      .isSame(latestWeekStart.value, 'day') ||
    currentWeekDate.value.startOf('isoWeek').isAfter(latestWeekStart.value)
  );
});

// 当前周的周一
const currentWeekStart = computed(() =>
  currentWeekDate.value.startOf('isoWeek'),
);

// 当前周对应文本显示
const currentWeekDisplay = computed(() => {
  const start = currentWeekStart.value;
  return `${start.isoWeekYear()}年第${start.isoWeek()}周`;
});

// 阳历日期区间文字：← 2月2号 - 2月8号 →
const weekDateRangeText = computed(() => {
  const start = currentWeekStart.value;
  const end = currentWeekDate.value.endOf('isoWeek');
  return `${start.format('M月D号')} - ${end.format('M月D号')}`;
});

// 周别下拉菜单选项
const weekOptions = computed(() => {
  const list: { label: string; value: string; isCurrentView: boolean }[] = [];
  const start = latestWeekStart.value;

  // 默认向前追溯至少12周，如果有更早的招新日期则延伸
  let minDate = start.subtract(12, 'week');
  if (recStore.beginningDate) {
    const recStart = dayjs(recStore.beginningDate).startOf('isoWeek');
    if (recStart.isBefore(minDate)) {
      minDate = recStart;
    }
  }

  let iter = start;
  while (iter.isAfter(minDate) || iter.isSame(minDate, 'day')) {
    const weekNum = iter.isoWeek();
    const year = iter.isoWeekYear();
    const wStart = iter.startOf('isoWeek');
    const wEnd = iter.endOf('isoWeek');
    const isCurrent = iter.isSame(
      currentWeekDate.value.startOf('isoWeek'),
      'day',
    );

    list.push({
      label: `${year}年第${weekNum}周 (${wStart.format(
        'M月D号',
      )} - ${wEnd.format('M月D号')})`,
      value: wStart.format('YYYY-MM-DD'),
      isCurrentView: isCurrent,
    });
    iter = iter.subtract(1, 'week');
  }
  return list;
});

// 横轴：7天详细信息
const weekDays = computed(() => {
  const start = currentWeekStart.value;
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  return Array.from({ length: 7 }).map((_, i) => {
    const d = start.add(i, 'day');
    return {
      dayName: dayNames[i],
      dateStr: d.format('YYYY-MM-DD'),
      dayNumber: d.format('D'),
      solarDate: d.format('M月D号'),
      isToday: d.isSame(dayjs(), 'day'),
    };
  });
});

// 纵轴：时间标签格式化（上午/下午 具体时间，精确到小时）
const formatHourLabel = (hour: number) => {
  let periodText = '';
  let timeText = '';

  if (hour === 0) {
    periodText = '上午 0点';
    timeText = '00:00';
  } else if (hour < 12) {
    periodText = `上午 ${hour}点`;
    timeText = `${String(hour).padStart(2, '0')}:00`;
  } else if (hour === 12) {
    periodText = '下午 12点';
    timeText = '12:00';
  } else {
    periodText = `下午 ${hour - 12}点`;
    timeText = `${hour}:00`;
  }

  return { periodText, timeText };
};

// 今天的时间线红线偏移量（从早上8点起算）
const currentDayTimeOffset = computed(() => {
  const now = dayjs();
  const minutesSinceStart = (now.hour() - START_HOUR) * 60 + now.minute();
  return minutesSinceStart * (HOUR_HEIGHT / 60);
});

// 切换到上一周
const handlePrevWeek = () => {
  currentWeekDate.value = currentWeekDate.value
    .subtract(1, 'week')
    .startOf('isoWeek');
};

// 切换到下一周
const handleNextWeek = () => {
  if (isLatestWeek.value) return;
  currentWeekDate.value = currentWeekDate.value
    .add(1, 'week')
    .startOf('isoWeek');
};

// 从下拉菜单选择某一周
const handleSelectWeek = (val: any) => {
  currentWeekDate.value = dayjs(val).startOf('isoWeek');
};

// 打开编辑面试卡片弹窗
const handleOpenEditModal = (interview: Interview) => {
  selectedInterview.value = interview;
  showEditModal.value = true;
};

// 点击网格空闲时间段创建场次
const handleGridSlotClick = (dateStr: string, hour: number) => {
  addModalInitDate.value = dateStr;
  const startStr = `${String(hour).padStart(2, '0')}:00`;
  const endStr = `${String(Math.min(hour + 1, 23)).padStart(2, '0')}:00`;
  addModalInitTimeRange.value = [startStr, endStr];
  showAddModal.value = true;
};

// 点击顶部“添加场次”按钮
const handleOpenAddModal = () => {
  addModalInitDate.value = currentWeekStart.value.format('YYYY-MM-DD');
  addModalInitTimeRange.value = ['14:00', '15:00'];
  showAddModal.value = true;
};

// 刷新数据回调
const handleDataUpdated = async () => {
  await recStore.refresh();
};

// 当前组别对应的面试场次
const currentGroupInterviews = computed(() => {
  const isTeam = currentGroup.value === Group.Unique;
  return recStore.curInterviews.filter((item) => {
    if (isTeam) {
      return (
        (item.name as string) === 'unique' ||
        (item.name as string) === Group.Unique
      );
    }
    return (item.name as string) === (currentGroup.value as string);
  });
});

// 自动滚动到默认时间段（上午8点或当周最早面试时间）
function scrollToDefaultPosition() {
  nextTick(() => {
    if (!gridScrollRef.value) return;
    const start = currentWeekStart.value;
    const end = currentWeekDate.value.endOf('isoWeek');

    const thisWeekInterviews = currentGroupInterviews.value.filter((i) => {
      if (!i.start) return false;
      const t = dayjs(i.start);
      return t.isBetween(start, end, 'day', '[]');
    });

    let targetHour = START_HOUR;
    if (thisWeekInterviews.length > 0) {
      const earliestHour = Math.min(
        ...thisWeekInterviews.map((i) => dayjs(i.start).hour()),
      );
      targetHour = Math.max(START_HOUR, earliestHour - 1);
    }
    gridScrollRef.value.scrollTop = Math.max(
      0,
      (targetHour - START_HOUR) * HOUR_HEIGHT,
    );
  });
}

// 点击“今天”按钮
const handleJumpToday = () => {
  currentWeekDate.value = dayjs().startOf('isoWeek');
  scrollToDefaultPosition();
};

// 计算某一天在该组别下的所有面试卡片（含重叠布局计算）
interface LayoutCard {
  uid: string;
  rawInterview: Interview;
  timeRangeText: string;
  candidateNames: string[];
  style: Record<string, string>;
  startMinutes: number;
  endMinutes: number;
}

const getDayCards = (dateStr: string): LayoutCard[] => {
  // 筛选当天的面试
  const dayInterviews = currentGroupInterviews.value.filter((i) => {
    if (!i.start) return false;
    return dayjs(i.start).format('YYYY-MM-DD') === dateStr;
  });

  if (dayInterviews.length === 0) return [];

  const isTeam = currentGroup.value === Group.Unique;

  // 组装数据并计算候选人名单与尺寸位置
  const parsedCards = dayInterviews.map((item) => {
    const s = dayjs(item.start);
    const e = dayjs(item.end);

    // 从 START_HOUR (8点) 起算分钟数
    const startMinutes = (s.hour() - START_HOUR) * 60 + s.minute();
    const endMinutes = (e.hour() - START_HOUR) * 60 + e.minute();
    const duration = Math.max(endMinutes - startMinutes, 15);

    // 1分钟 = HOUR_HEIGHT / 60 像素 (当前为 1.5px)
    const top = Math.max(0, startMinutes * (HOUR_HEIGHT / 60));
    // 最小高度32px保证选手名字完整居中展现
    const height = Math.max(duration * (HOUR_HEIGHT / 60), 32);

    // 格式化时间段：eg：14：00--16：00
    const timeRangeText = `${s.format('HH:mm')}-${e.format('HH:mm')}`;

    // 获取分配到本场次的候选人
    const assignedApps = recStore.curApplications.filter((app) => {
      if (!isTeam && app.group !== currentGroup.value) return false;
      const allo = isTeam
        ? app.interview_allocations_team
        : app.interview_allocations_group;
      return allo?.uid === item.uid;
    });

    // 候选人姓名始终按照首字母顺序排列
    const candidateNames = assignedApps
      .map((app) => app.user_detail?.name || '未知')
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { numeric: true }));

    return {
      uid: item.uid,
      rawInterview: item,
      timeRangeText,
      candidateNames,
      startMinutes,
      endMinutes,
      top,
      height,
      colIndex: 0,
      totalCols: 1,
    };
  });

  // 处理时间重叠：贪心多列布局算法
  parsedCards.sort(
    (a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes,
  );

  const columns: (typeof parsedCards)[] = [];
  parsedCards.forEach((card) => {
    const colIndex = columns.findIndex(
      (col) => col[col.length - 1].endMinutes <= card.startMinutes,
    );
    if (colIndex !== -1) {
      columns[colIndex].push(card);
      card.colIndex = colIndex;
    } else {
      card.colIndex = columns.length;
      columns.push([card]);
    }
  });

  parsedCards.forEach((card) => {
    const overlapping = parsedCards.filter(
      (o) =>
        Math.max(card.startMinutes, o.startMinutes) <
        Math.min(card.endMinutes, o.endMinutes),
    );
    const maxCol = Math.max(...overlapping.map((o) => o.colIndex || 0));
    card.totalCols = maxCol + 1;
  });

  return parsedCards.map((card) => {
    const totalCols = card.totalCols || 1;
    const colIndex = card.colIndex || 0;
    const widthPct = 100 / totalCols;
    const leftPct = colIndex * widthPct;

    return {
      uid: card.uid,
      rawInterview: card.rawInterview,
      timeRangeText: card.timeRangeText,
      candidateNames: card.candidateNames,
      startMinutes: card.startMinutes,
      endMinutes: card.endMinutes,
      style: {
        top: `${card.top}px`,
        height: `${card.height}px`,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
      },
    };
  });
};

// 当周别或组别变更时自动滚动
watch([currentWeekDate, currentGroup], () => {
  scrollToDefaultPosition();
});

onMounted(async () => {
  if (!recStore.currentRid) {
    await recStore.getAllRecruitments();
  }
  // 检查是否已有面试安排，优先将周定位到最近有面试的周或当前周
  if (recStore.curInterviews.length > 0) {
    const now = dayjs();
    const sorted = [...recStore.curInterviews]
      .filter((i) => i.start)
      .sort(
        (a, b) =>
          Math.abs(dayjs(a.start).diff(now)) -
          Math.abs(dayjs(b.start).diff(now)),
      );
    if (sorted[0]) {
      currentWeekDate.value = dayjs(sorted[0].start).startOf('isoWeek');
    }
  }
  scrollToDefaultPosition();
});
</script>

<style scoped lang="less">
/* 自定义滚动条与网格样式 */
:deep(.arco-btn) {
  border-radius: 4px;
}
</style>

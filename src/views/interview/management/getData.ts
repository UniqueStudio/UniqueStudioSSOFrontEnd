import { Application } from '@/constants/httpMsg/application/getApplicationMsg';
import { Interview } from '@/constants/httpMsg/interview/getInterviewMsg';
import { Step } from '@/constants/team';
import { TableData } from '@arco-design/web-vue';
import i18n from '@/locale';
import { Recruitment } from '@/constants/httpMsg/recruitment/getRecruitmentMsg';

type Data = {
  [key: string]: TableData[];
};

const groupInterview = 'common.steps.GroupInterview';
const teamInterview = 'common.steps.TeamInterview';

export function dealTime(startTime: string, endTime: string): string {
  // 处理面试时间
  const start = new Date(startTime);
  const end = new Date(endTime);
  // turn it to YYYY-MM-DD HH:MM-HH:MM
  //
  return `${start.getFullYear()}-${(start.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')} ${start
    .getHours()
    .toString()
    .padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}-${end
    .getHours()
    .toString()
    .padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
}

function dealData(
  application: Application,
  interviewData: Interview | undefined,
): TableData {
  // 处理前端所需数据
  return {
    name: application.user_detail?.name,
    step: application.step,
    interviewTime:
      interviewData && interviewData.uid
        ? dealTime(interviewData?.start, interviewData?.end)
        : i18n.global.t('common.status.waitForDistribution'),
    aid: application.uid,
  };
}

function getDataKey(step: string, group: string): string {
  return `${step}_${group}`;
}

export default async function getApplicationData(
  totalData: Recruitment,
): Promise<Data> {
  const applicationData: Data = {};
  if (!totalData.applications) return applicationData;
  totalData.applications.forEach((application) => {
    // console.log(application);

    let stepName;
    let interviewData;
    let needDeal = false;
    if (
      application.step === Step.GroupInterview ||
      application.step === Step.GroupTimeSelection
    ) {
      stepName = groupInterview;
      interviewData = application.interview_allocations_group;
      needDeal = true;
    } else if (
      application.step === Step.TeamInterview ||
      application.step === Step.TeamTimeSelection
    ) {
      stepName = teamInterview;
      interviewData = application.interview_allocations_team;
      needDeal = true;
    } // 如果不是这两种就不需要处理

    if (application.abandoned || application.rejected) needDeal = false;

    if (needDeal) {
      const dataKey = getDataKey(stepName as string, application.group);
      if (!applicationData[dataKey]) applicationData[dataKey] = [];
      applicationData[dataKey].push(dealData(application, interviewData));
    }
  });
  return applicationData;
}

const dataEndIndex = 10;
export const getDate = (time: string): string => {
  return time.substring(0, dataEndIndex);
};
export const getTime = (startStr: string, endStr: string): string => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  return `${start.getHours().toString().padStart(2, '0')}:${start
    .getMinutes()
    .toString()
    .padStart(2, '0')}-${end.getHours().toString().padStart(2, '0')}:${end
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

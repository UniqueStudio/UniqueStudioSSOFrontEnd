import { getLatestRecruitment, getRecruitment } from '@/api/recruitment';
import { Application } from '@/constants/httpMsg/application/getApplicationMsg';
import { Interview } from '@/constants/httpMsg/interview/getInterviewMsg';
import { Step } from '@/constants/team';
import { TableData } from '@arco-design/web-vue';
import i18n from '@/locale';

type Data = {
  [key: string]: TableData[];
};

const groupInterview = 'common.steps.GroupInterview';
const teamInterview = 'common.steps.TeamInterview';

async function getLastestRid(): Promise<string> {
  return (await getLatestRecruitment()).data.uid;
}

function dealTime(startTime: string, endTime: string): string {
  // 处理面试时间
  const start = new Date(startTime);
  const end = new Date(endTime);
  // turn it to YYYY-MM-DD HH:MM-HH:MM
  return `${start.getFullYear()}-${
    start.getMonth() + 1
  }-${start.getDate()} ${start.getHours()}:${start.getMinutes()}-${end.getHours()}:${end.getMinutes()}`;
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
  };
}

function getDataKey(step: string, group: string): string {
  return `${step}_${group}`;
}

export default async function getApplicationData(): Promise<Data> {
  // const nowRid = await getLastestRid();
  const nowRid = 'ba10675e-22ae-4335-83c8-8e84a4a6855b'; // 调试
  const applicationData: Data = {
    groupInterview: [],
    teamInterview: [],
  };

  const totalData = await getRecruitment(nowRid);
  if (!totalData.data.applications) return applicationData;
  totalData.data.applications.forEach((application) => {
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

    if (needDeal) {
      const dataKey = getDataKey(stepName, application.group);
      if (!applicationData[dataKey]) applicationData[dataKey] = [];
      applicationData[dataKey].push(dealData(application, interviewData));
    }
  });
  return applicationData;
}
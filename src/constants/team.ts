// 团队常量
export enum Gender {
  Undefined = 0,
  Male = 1,
  Female = 2,
  Oth = 3,
}

export enum Period {
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
}

export enum Group {
  Web = 'web',
  Lab = 'lab',
  Ai = 'ai',
  Game = 'game',
  Android = 'android',
  Ios = 'ios',
  Design = 'design',
  Pm = 'pm',
  Unique = 'unique', // for team interview
}

export enum Evaluation {
  Good = 0,
  Normal = 1,
  Bad = 2,
}

export enum Step {
  SignUp = 'SignUp', // 报名
  WrittenTest = 'WrittenTest', // 笔试
  GroupTimeSelection = 'GroupTimeSelection', // 组面时间选择
  GroupInterview = 'GroupInterview', // 组面
  OnlineGroupInterview = 'OnlineGroupInterview', // 在线组面
  StressTest = 'StressTest', // 熬测
  TeamTimeSelection = 'TeamTimeSelection', // 面试时间选择
  TeamInterview = 'TeamInterview', // 团体面试(群面)
  OnlineTeamInterview = 'OnlineTeamInterview', // 在线群面
  Pass = 'Pass', // 通过
}

// 招新流程对应的多语言key
export const recruitSteps = [
  {
    i18Key: 'common.steps.SignUp',
    value: [Step.SignUp], // 报名
  },
  {
    i18Key: 'common.steps.WrittenTest',
    value: [Step.WrittenTest], // 笔试
  },
  {
    i18Key: 'common.steps.GroupInterview',
    value: [
      Step.GroupTimeSelection,
      Step.GroupInterview,
      Step.OnlineGroupInterview,
    ], // 组面
  },
  {
    i18Key: 'common.steps.StressTest',
    value: [Step.StressTest], // 熬测
  },
  {
    i18Key: 'common.steps.TeamInterview',
    value: [
      Step.TeamTimeSelection,
      Step.TeamInterview,
      Step.OnlineTeamInterview,
    ], // 群面
  },
  {
    i18Key: 'common.steps.Pass',
    value: [Step.Pass], // 通过
  },
];

export type TimeString = string;

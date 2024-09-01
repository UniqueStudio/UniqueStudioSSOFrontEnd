// 团队常量
export enum Gender {
  Undefined = 0,
  Male = 1,
  Female = 2,
  Oth = 3,
}

export const GenderMap = [
  'common.user.undefined',
  'common.user.gender.male',
  'common.user.gender.female',
  'common.user.gender.other',
];

export enum Period {
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
}

export const PeriodDefineHour = {
  morning: [5, 12], // 5:00 - 12:00
  afternoon: [12, 18], // 12:00 - 6:00
  evening: [18, 24], // 18:00 - 24:00
};

export enum InterviewType {
  Group = 'common.steps.GroupInterview',
  Team = 'common.steps.TeamInterview',
}

export enum Group {
  Web = 'web',
  Lab = 'lab',
  AI = 'ai',
  Game = 'game',
  Mobile = 'mobile',
  Design = 'design',
  PM = 'pm',
  Unique = 'unique', // for team interview
}

export const groupMapping = {
  PM: Group.PM,
  Design: Group.Design,
  AI: Group.AI,
  Mobile: Group.Mobile,
  Web: Group.Web,
  Lab: Group.Lab,
  Game: Group.Game,
};

export enum Evaluation {
  Undefined = 0,
  Good = 1,
  Normal = 2,
  Bad = 3,
}

export const EvaluationMap = ['', '😘', '🤔', '😅'];

export enum Step {
  SignUp = 'SignUp', // 报名
  WrittenTest = 'WrittenTest', // 笔试
  GroupTimeSelection = 'GroupTimeSelection', // 组面时间选择
  GroupInterview = 'GroupInterview', // 组面
  OnlineGroupInterview = 'OnlineGroupInterview', // 在线组面
  StressTest = 'StressTest', // 熬测
  TeamTimeSelection = 'TeamTimeSelection', // 群面时间选择
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
    i18Key: 'common.steps.GroupTimeSelection',
    value: [Step.GroupTimeSelection], // 组面时间选择
  },
  {
    i18Key: 'common.steps.GroupInterview',
    value: [Step.GroupInterview, Step.OnlineGroupInterview], // 组面
  },
  {
    i18Key: 'common.steps.StressTest',
    value: [Step.StressTest], // 熬测
  },
  {
    i18Key: 'common.steps.TeamTimeSelection',
    value: [Step.TeamTimeSelection], // 群面时间选择
  },
  {
    i18Key: 'common.steps.TeamInterview',
    value: [Step.TeamInterview, Step.OnlineTeamInterview], // 群面
  },
  {
    i18Key: 'common.steps.Pass',
    value: [Step.Pass], // 通过
  },
];

export const SMSTemplate: {
  i18nKey: string;
  restI18nKey?: string;
  match: Step[];
  required: string[];
}[] = [
  {
    i18nKey: 'sms.reject',
    match: [],
    required: [],
  },
  {
    i18nKey: 'sms.interview',
    match: [Step.GroupInterview, Step.TeamInterview],
    required: ['place', 'next'],
  },
  {
    i18nKey: 'sms.onlineInterview',
    match: [Step.OnlineGroupInterview, Step.OnlineTeamInterview],
    required: ['meeting_id'],
  },
  {
    i18nKey: 'sms.base',
    match: [Step.WrittenTest, Step.StressTest],
    restI18nKey: 'sms.rest.test',
    required: ['time', 'place', 'next'],
  },
  {
    i18nKey: 'sms.base',
    match: [Step.GroupTimeSelection, Step.TeamTimeSelection],
    restI18nKey: 'sms.rest.timeSelection',
    required: [],
  },
  {
    i18nKey: 'sms.base',
    match: [Step.Pass],
    restI18nKey: 'sms.rest.pass',
    required: [],
  },
];

export type TimeString = string;

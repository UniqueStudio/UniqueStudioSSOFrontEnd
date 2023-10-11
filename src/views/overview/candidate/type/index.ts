import { Gender } from '@/views/login/type';

export interface Step {
  step: string;
  num: number;
}

interface CommentInfo {
  name: string;
  comment: string;
}

// todo 候选人信息，后续完善
export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  gender: Gender;
  school: string;
  major: string;
  grade: string;
  score: string;
  recommender: string;
  intro: string;
  comment: {
    good: CommentInfo[];
    normal: CommentInfo[];
    bad: CommentInfo[];
  };
  phone: string;
  email: string;
  status: string;
  steps: string[];
  group: string;
}

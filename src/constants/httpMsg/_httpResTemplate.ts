export interface HttpRes<T = object> {
  code: number;
  msg: string;
  data: T;
}

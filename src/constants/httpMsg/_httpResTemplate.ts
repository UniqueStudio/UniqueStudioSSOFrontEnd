export interface HttpRes<T = object> {
  message: string;
  data: T;
}

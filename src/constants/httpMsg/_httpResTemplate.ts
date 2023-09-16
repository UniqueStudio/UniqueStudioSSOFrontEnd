export interface HttpRes<T = {}> {
  message:string;
  data:T;
}
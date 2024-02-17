// 工具类型
export type ReplaceKeys<
  U extends object,
  T extends PropertyKey,
  Y extends object,
> = {
  [p in keyof U]: p extends T ? (p extends keyof Y ? Y[p] : never) : U[p];
};

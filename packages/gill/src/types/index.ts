export * from "./rpc";
export * from "./explorer";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

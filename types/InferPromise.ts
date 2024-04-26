// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromiseType<T extends (...args: any) => Promise<any>> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any
) => Promise<infer R>
  ? R
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

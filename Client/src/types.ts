type ActionFn = (...args: any) => {};

export type Action = {
  name: string;

  execute: ActionFn;
};

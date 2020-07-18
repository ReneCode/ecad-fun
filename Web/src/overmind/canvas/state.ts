export type State = {
  mousePosition: { x: number; y: number };
  name: string;
};

export const state: State = {
  mousePosition: { x: 0, y: 0 },
  name: "hello",
};

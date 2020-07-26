export type ECadBaseElement = {
  id: string;
  type: string;
  color: string;
  x: number;
  y: number;
};

export type ECadLineElement = ECadBaseElement & {
  x2: number;
  y2: number;
};

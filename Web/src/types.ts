export type ActionName = string;

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

export type ECadCircleElement = ECadBaseElement & {
  radius: number;
};

export type ECadRectangleElement = ECadBaseElement & {
  w: number;
  h: number;
};

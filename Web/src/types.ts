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

export type AppState = {
  cursor: string;

  // screen-coords of mouse/touch event
  clientX: number;
  clientY: number;

  // world-coords of mouse/touch event
  pointerX: number;
  pointerY: number;

  // project-coords view
  zoom: number;

  // screen-coords view
  screenWidth: number;
  screenHeight: number;
  // there is the word 0,0 point
  screenOriginX: number;
  screenOriginY: number;

  editingElement: ECadBaseElement | null;
  elements: readonly ECadBaseElement[];
};

type ActionFn = (appState: AppState) => {} | void;

export type Action = {
  name: string;

  start?: ActionFn;
  pointerDown?: ActionFn;
  pointerUp?: ActionFn;
  pointerMove?: ActionFn;
};

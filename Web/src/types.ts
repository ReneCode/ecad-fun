export type ActionName = string;

export const POINTER_BUTTONS = {
  MAIN: 1,
  SECONDARY: 2,
};

type ECadElementType = "line" | "rectangle" | "circle";

export type ECadBaseElement = {
  id: string;
  type: ECadElementType;
  color: string;
  x: number;
  y: number;
};

export type ECadLineElement = ECadBaseElement & {
  x: number;
  y: number;
  w: number;
  h: number;
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
  pointerButtons: number;

  // world-coords of mouse/touch event
  pointerX: number;
  pointerY: number;

  gripSize: number; // in worldCoord
  // project-coords view
  zoom: number;

  // screen-coords view
  screenWidth: number;
  screenHeight: number;
  // there is the word 0,0 point
  screenOriginX: number;
  screenOriginY: number;

  selectedElementIds: string[];
  editingElement: ECadBaseElement | null;
  elements: readonly ECadBaseElement[];
};

export const getDefaultAppState = (): AppState => {
  return {
    cursor: "default",

    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    screenOriginX: window.innerWidth / 2,
    screenOriginY: window.innerHeight / 2,

    editingElement: null,
    selectedElementIds: [],

    elements: [],
    pointerButtons: -1,

    gripSize: 12,
    zoom: 1.0,

    pointerX: 0,
    pointerY: 0,
  };
};

// Action
export type Action = {
  name: string;

  stop?: ActionFn;
  start?: ActionFn;

  execute?: ActionFn;
  pointerDown?: ActionFn;
  pointerUp?: ActionFn;
  pointerMove?: ActionFn;
};

export type ActionState = {
  lastX: number;
  lastY: number;
  selectedHandleIdx: number;
};

export const defaultActionState: ActionState = {
  lastX: 0,
  lastY: 0,
  selectedHandleIdx: -1,
};

export type ActionResult = {
  state?: {
    elements?: ECadBaseElement[];
    editingElement?: ECadBaseElement | null;
    selectedElementIds?: string[];

    cursor?: string;

    screenOriginX?: number;
    screenOriginY?: number;

    gripSize?: number;
    zoom?: number;
  };
  actionState?: Partial<ActionState>;
  stopAction?: boolean;
};

type ActionFn = (args: {
  state: AppState;
  actionState: ActionState;
  params: any;
}) => ActionResult | void;

export type HitTestResult = {
  id: string;
  type: "element" | "handle";
  handleIdx?: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  w: number;
  h: number;
};

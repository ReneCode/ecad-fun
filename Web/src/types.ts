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
  clientX: number;
  clientY: number;
  pointerButtons: number;

  // world-coords of mouse/touch event
  pointerX: number;
  pointerY: number;
  pointerDownX: number;
  pointerDownY: number;

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
  selectedHandleIdx: number;
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
    selectedHandleIdx: -1,

    elements: [],
    clientX: 0,
    clientY: 0,
    pointerButtons: -1,

    gripSize: 12,
    zoom: 1.0,

    pointerX: 0,
    pointerY: 0,
    pointerDownX: 0,
    pointerDownY: 0,
  };
};

// Action
export type Action = {
  name: string;

  start?: ActionFn;
  pointerDown?: ActionFn;
  pointerUp?: ActionFn;
  pointerMove?: ActionFn;
};

export type ActionResult = {
  state?: {
    elements?: ECadBaseElement[];
    editingElement?: ECadBaseElement | null;
    selectedElementIds?: string[];
    selectedHandleIdx?: number;

    cursor?: string;

    screenOriginX?: number;
    screenOriginY?: number;

    gripSize?: number;
    zoom?: number;
  };
  actionFinished?: boolean;
};

type ActionFn = (appState: AppState, params: any) => ActionResult | void;

export type HitTestResult = {
  id: string;
  type: "element" | "handle";
  handleIdx?: number;
};

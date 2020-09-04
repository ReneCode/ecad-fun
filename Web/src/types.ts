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
};

export type ECadLineElement = ECadBaseElement & {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ECadCircleElement = ECadBaseElement & {
  x: number;
  y: number;
  radius: number;
};

export type ECadRectangleElement = ECadBaseElement & {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
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

  editingElement: ECadBaseElement | null;
  selectedElementIds: string[];
  selectionBox: Box | null;

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
    selectionBox: null,

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
  mode: "selectionbox" | "";
};

export const defaultActionState: ActionState = {
  lastX: 0,
  lastY: 0,
  selectedHandleIdx: -1,
  mode: "",
};

export type ActionResult = {
  state?: Partial<AppState>;
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

export type Box = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ElementHandle = { x: number; y: number; idx: number };

export type ElementWorker = {
  type: string;

  render: ElementRenderFn;

  hitTest: (element: ECadBaseElement, pt: Point, epsilon: number) => boolean;

  getBoundingBox: (element: ECadBaseElement) => Box;

  getHandles: (element: ECadBaseElement) => ElementHandle[];

  moveByDelta: (element: ECadBaseElement, delta: Point) => ECadBaseElement;

  moveHandle: (
    element: ECadBaseElement,
    handleIdx: number,
    pt: Point
  ) => ECadBaseElement;
};

export type ElementRenderFn = (
  element: ECadBaseElement,
  context: CanvasRenderingContext2D,
  {
    worldCoordToScreenCoord,
    worldLengthToScreenLength,
  }: {
    worldCoordToScreenCoord: (x: number, y: number) => { x: number; y: number };

    worldLengthToScreenLength: (len: number) => number;
  }
) => void;

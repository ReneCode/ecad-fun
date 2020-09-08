export type ActionName = string;

export const POINTER_BUTTONS = {
  MAIN: 1,
  SECONDARY: 2,
};

type ECadElementType = "line" | "rectangle" | "circle" | "symbol" | "symbolRef";

export type ECadBaseElement = {
  id: string;
  type: ECadElementType;
  color?: string;
  fill?: string;
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

export type ECadSymbolElement = ECadBaseElement & {
  name: string;
  children: ECadBaseElement[];
  refX: number;
  refY: number;
};

export type ECadSymbolRefElement = ECadBaseElement & {
  x: number;
  y: number;
  symbolId: string;
  symbol: ECadSymbolElement;
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

  worldToScreenMatrix: Matrix;
  screenToWorldMatrix: Matrix;

  // screen-coords view
  screenWidth: number;
  screenHeight: number;
  // there is the word 0,0 point
  screenOriginX: number;
  screenOriginY: number;

  editingElement: ECadBaseElement | null;
  selectedElementIds: string[];
  selectionBox: ECadRectangleElement | null;

  elements: readonly ECadBaseElement[];
};

export const getDefaultAppState = (): AppState => {
  return {
    cursor: "default",
    pointerButtons: -1,
    pointerX: 0,
    pointerY: 0,
    gripSize: 12,
    zoom: 1.0,

    worldToScreenMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
    screenToWorldMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },

    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    screenOriginX: window.innerWidth / 2,
    screenOriginY: window.innerHeight / 2,

    editingElement: null,
    selectedElementIds: [],
    selectionBox: null,

    elements: [],
  };
};

/**
 * @description Action interface. if execute methode is set, that that action is only called once,
 * otherwise it is a long-running action and start,stop,pointer... are called until actionResult.stopAction:true is returned.
 */
export type Action = {
  name: string;

  // render?: React.FC<{ state: AppState }>;

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
  selectionMode: "selectionbox" | "element";
};

export const defaultActionState: ActionState = {
  lastX: 0,
  lastY: 0,
  selectedHandleIdx: -1,
  selectionMode: "element",
};

export type ActionResult = {
  state?: Partial<AppState>;
  actionState?: Partial<ActionState> | any;
  stopAction?: boolean;
};

type ActionFn = (args: {
  state: AppState;
  actionState: ActionState | any;
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

/**
 * @description
 * | a c e |
 * | b d f |
 * | 0 0 1 |
 * e,f translate
 * a,d scale
 */
export type Matrix = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
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

export type ElementRenderParams = {
  worldToScreenMatrix: Matrix;
  screenToWorldMatrix: Matrix;
  selected: Boolean;
};

export type ElementRenderFn = (
  element: ECadBaseElement,
  context: CanvasRenderingContext2D,
  params: ElementRenderParams
) => void;

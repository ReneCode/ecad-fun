import {
  ECadBaseElement,
  ECadLineElement,
  ECadCircleElement,
  ECadRectangleElement,
  AppState,
} from "../types";
import {
  worldCoordToScreenCoord,
  worldLengthToScreenLength,
} from "../utils/geometric";
import { getHandlesElement } from "../elements";

const COLOR = {
  SELECTED: "#5522ee",
  GRIPHANDLE_STROKE: "#5522ee",
  GRIPHANDLE_FILL: "#eee",
};

const GRIP_SIZE = 14;

type RenderOptions = {
  selected?: boolean;
};

export const renderScene = (
  canvas: HTMLCanvasElement,
  elements: ECadBaseElement[],
  state: AppState
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  renderBackground(context, canvasWidth, canvasHeight);

  for (let element of elements) {
    if (!state.selectedElementIds.includes(element.id)) {
      renderElement(context, element, state);
    }
  }

  for (let id of state.selectedElementIds) {
    const element = elements.find((el) => el.id === id);
    if (element) {
      // const bbox = getBoundingBox(element);
      // renderBoundingBox(context, bbox, state);
      renderElement(context, element, state, { selected: true });
    }
  }

  // context.beginPath();
  // context.strokeStyle = "RED";
  // context.fillStyle = "#22601355";
  // context.fillRect(200, 200, 400, 300);
};

// const renderBoundingBox = (
//   context: CanvasRenderingContext2D,
//   { x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number },
//   state: AppState
// ) => {
//   context.beginPath();
//   const { x: sx1, y: sy1 } = worldCoordToScreenCoord(x1, y1, state);
//   const { x: sx2, y: sy2 } = worldCoordToScreenCoord(x2, y2, state);
//   context.rect(sx1, sy2, sx2 - sx1, -(sy2 - sy1));
//   context.strokeStyle = "#9e9";
//   context.stroke();
// };

const renderElement = (
  context: CanvasRenderingContext2D,
  element: ECadBaseElement,
  state: AppState,
  options: RenderOptions = {}
) => {
  context.save();

  // context.beginPath();
  const { selected } = options;
  if (selected) {
    context.strokeStyle = COLOR.SELECTED;
  } else {
    context.strokeStyle = element.color;
  }
  switch (element.type) {
    case "line":
      renderLineElement(context, element as ECadLineElement, state);
      break;
    case "circle":
      renderCircleElement(context, element as ECadCircleElement, state);
      break;
    case "rectangle":
      renderRectangleElement(context, element as ECadRectangleElement, state);
      break;
    default:
      throw new Error(`bad element Type: ${element.type}`);
  }

  if (selected) {
    const handles = getHandlesElement(element);
    handles.forEach((handle) => {
      renderHandle(context, handle.x, handle.y, state);
    });
  }
  context.restore();
};

const renderBackground = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  context.beginPath();
  const padding = 0;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "#aaa";
  context.fillRect(
    0 + padding,
    0 + padding,
    canvasWidth - 2 * padding,
    canvasHeight - 2 * padding
  );
};

const renderLineElement = (
  context: CanvasRenderingContext2D,
  element: ECadLineElement,
  state: AppState
) => {
  context.beginPath();
  const line = element as ECadLineElement;
  const { x, y } = worldCoordToScreenCoord(line.x, line.y, state);
  const { x: x2, y: y2 } = worldCoordToScreenCoord(
    line.x + line.w,
    line.y + line.h,
    state
  );
  context.moveTo(x, y);
  context.lineTo(x2, y2);
  context.stroke();
};

const renderCircleElement = (
  context: CanvasRenderingContext2D,
  element: ECadCircleElement,
  state: AppState
) => {
  context.beginPath();
  const circle = element as ECadCircleElement;
  const { x, y } = worldCoordToScreenCoord(circle.x, circle.y, state);
  const radius = worldLengthToScreenLength(circle.radius, state);
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
};

const renderRectangleElement = (
  context: CanvasRenderingContext2D,
  element: ECadRectangleElement,
  state: AppState
) => {
  context.beginPath();
  const rectangle = element as ECadRectangleElement;
  const { x, y } = worldCoordToScreenCoord(rectangle.x, rectangle.y, state);
  const w = worldLengthToScreenLength(rectangle.w, state);
  const h = worldLengthToScreenLength(rectangle.h, state);
  context.fillStyle = "red";
  context.strokeStyle = element.color;
  context.rect(x, y, w, -h);
  context.stroke();
};

const renderHandle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  state: AppState
) => {
  const { x: sx, y: sy } = worldCoordToScreenCoord(x, y, state);

  context.beginPath();
  context.strokeStyle = COLOR.GRIPHANDLE_STROKE;
  context.fillStyle = COLOR.GRIPHANDLE_FILL;
  context.fillRect(
    sx - GRIP_SIZE / 2,
    sy - GRIP_SIZE / 2,
    GRIP_SIZE,
    GRIP_SIZE
  );
  context.strokeRect(
    sx - GRIP_SIZE / 2,
    sy - GRIP_SIZE / 2,
    GRIP_SIZE,
    GRIP_SIZE
  );
};

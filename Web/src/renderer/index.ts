import {
  ECadBaseElement,
  ECadLineElement,
  ECadCircleElement,
  ECadRectangleElement,
} from "../types";
import {
  worldCoordToScreenCoord,
  worldLengthToScreenLength,
} from "../utils/geometric";
import { AppState } from "../state/appState";

export const renderScene = (
  canvas: HTMLCanvasElement,
  elements: ECadBaseElement[],
  state: AppState,
  scale: number
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  // context.resetTransform();
  // context.scale(scale, scale);

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  renderBackground(context, canvasWidth / scale, canvasHeight / scale);

  for (let element of elements) {
    renderElement(context, element, state, scale);
  }

  // context.beginPath();
  // context.strokeStyle = "RED";
  // context.fillStyle = "#22601355";
  // context.fillRect(200, 200, 400, 300);
};

const renderElement = (
  context: CanvasRenderingContext2D,
  element: ECadBaseElement,
  state: AppState,
  scale: number
) => {
  // context.save();
  // context.scale(scale, scale);

  // context.beginPath();
  context.strokeStyle = element.color;
  switch (element.type) {
    case "line":
      renderLineElement(context, element as ECadLineElement, state, scale);
      break;
    case "circle":
      renderCircleElement(context, element as ECadCircleElement, state, scale);
      break;
    case "rectangle":
      renderRectangleElement(
        context,
        element as ECadRectangleElement,
        state,
        scale
      );
      break;
  }
  // context.restore();
};

const renderBackground = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  context.beginPath();
  const padding = 10;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "#888";
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
  state: AppState,
  scale: number
) => {
  context.beginPath();
  const line = element as ECadLineElement;
  const { x, y } = worldCoordToScreenCoord(line.x, line.y, state, scale);
  const { x: x2, y: y2 } = worldCoordToScreenCoord(
    line.x2,
    line.y2,
    state,
    scale
  );
  console.log(x, y, x2, y2);
  context.moveTo(x, y);
  context.lineTo(x2, y2);
  context.stroke();
};

const renderCircleElement = (
  context: CanvasRenderingContext2D,
  element: ECadCircleElement,
  state: AppState,
  scale: number
) => {
  context.beginPath();
  const circle = element as ECadCircleElement;
  const { x, y } = worldCoordToScreenCoord(circle.x, circle.y, state, scale);
  const radius = worldLengthToScreenLength(circle.radius, state);
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
};

const renderRectangleElement = (
  context: CanvasRenderingContext2D,
  element: ECadRectangleElement,
  state: AppState,
  scale: number
) => {
  context.beginPath();
  const rectangle = element as ECadRectangleElement;
  const { x, y } = worldCoordToScreenCoord(
    rectangle.x,
    rectangle.y,
    state,
    scale
  );
  const w = worldLengthToScreenLength(rectangle.w, state);
  const h = worldLengthToScreenLength(rectangle.h, state);
  context.rect(x, y, w, -h);
  context.stroke();
};

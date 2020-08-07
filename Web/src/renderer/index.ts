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
    renderElement(context, element, state);
  }

  // context.beginPath();
  // context.strokeStyle = "RED";
  // context.fillStyle = "#22601355";
  // context.fillRect(200, 200, 400, 300);
};

const renderElement = (
  context: CanvasRenderingContext2D,
  element: ECadBaseElement,
  state: AppState
) => {
  context.save();

  // context.beginPath();
  context.strokeStyle = element.color;
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
  const { x: x2, y: y2 } = worldCoordToScreenCoord(line.x2, line.y2, state);
  console.log(x, y, x2, y2);
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
  context.rect(x, y, w, -h);
  context.stroke();
};

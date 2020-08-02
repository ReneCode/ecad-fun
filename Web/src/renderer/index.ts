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
  state: AppState
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.resetTransform();

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
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "#eee";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.closePath();
};

const renderLineElement = (
  context: CanvasRenderingContext2D,
  element: ECadLineElement,
  state: AppState
) => {
  const line = element as ECadLineElement;
  const { x, y } = worldCoordToScreenCoord(line.x, line.y, state);
  const { x: x2, y: y2 } = worldCoordToScreenCoord(line.x2, line.y2, state);
  context.moveTo(x, y);
  context.lineTo(x2, y2);
  context.stroke();
};

const renderCircleElement = (
  context: CanvasRenderingContext2D,
  element: ECadCircleElement,
  state: AppState
) => {
  const circle = element as ECadCircleElement;
  const { x, y } = worldCoordToScreenCoord(circle.x, circle.y, state);
  const radius = worldLengthToScreenLength(circle.radius, state);
  //   state.offsetX,
  //   state.offsetY
  // );
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
};

const renderRectangleElement = (
  context: CanvasRenderingContext2D,
  element: ECadRectangleElement,
  state: AppState
) => {
  const rectangle = element as ECadRectangleElement;
  const { x, y } = worldCoordToScreenCoord(rectangle.x, rectangle.y, state);
  const w = worldLengthToScreenLength(rectangle.w, state);
  const h = worldLengthToScreenLength(rectangle.h, state);
  context.rect(x, y, w, -h);
  context.stroke();
};

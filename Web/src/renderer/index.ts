import { ECadBaseElement, ECadLineElement, ECadCircleElement } from "../types";

export const renderScene = (
  canvas: HTMLCanvasElement,
  elements: ECadBaseElement[]
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
    renderElement(context, element);
  }

  context.beginPath();
  context.strokeStyle = "RED";
  context.fillStyle = "#22601355";
  context.fillRect(200, 200, 400, 300);
};

function renderElement(
  context: CanvasRenderingContext2D,
  element: ECadBaseElement
) {
  context.save();
  context.beginPath();
  context.strokeStyle = element.color;
  switch (element.type) {
    case "line":
      const lineElement = element as ECadLineElement;
      context.moveTo(lineElement.x, lineElement.y);
      context.lineTo(lineElement.x2, lineElement.y2);
      context.stroke();
      break;

    case "circle":
      const circleElement = element as ECadCircleElement;
      context.arc(
        circleElement.x,
        circleElement.y,
        circleElement.radius,
        0,
        Math.PI * 2
      );
      context.stroke();
      break;
  }
  context.restore();
}

function renderBackground(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "#eee";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  // I dont't know why, but without begin/endPath the old rended canvas is not cleared
  // context.beginPath();
  // context.closePath();
}

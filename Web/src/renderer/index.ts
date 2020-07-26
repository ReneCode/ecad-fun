import {
  ECadBaseElement,
  ECadLineElement,
  ECadCircleElement,
} from "../element";

export const renderScene = (
  canvas: HTMLCanvasElement,
  elements: ECadBaseElement[]
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  renderBackground(context, canvasWidth, canvasHeight);

  for (let element of elements) {
    renderElement(context, element);
  }
};

function renderElement(
  context: CanvasRenderingContext2D,
  element: ECadBaseElement
) {
  switch (element.type) {
    case "line":
      const lineElement = element as ECadLineElement;
      context.moveTo(lineElement.x, lineElement.y);
      context.lineTo(lineElement.x2, lineElement.y2);
      context.strokeStyle = lineElement.color;
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
      context.strokeStyle = circleElement.color;
      context.stroke();
      break;
  }
  context.beginPath();
  context.closePath();
}

function renderBackground(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  // context.fillStyle = "#eee";
  // context.fillRect(0, 0, canvasWidth, canvasHeight);
  // I dont't know why, but without begin/endPath the old rended canvas is not cleared
  context.beginPath();
  context.closePath();
}

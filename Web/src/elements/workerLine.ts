import { ElementWorker, ECadBaseElement, ECadLineElement } from "../types";

import { distancePointToLine, normalizeBox } from "../utils/geometric";

export const workerLine: ElementWorker = {
  type: "line",

  render: (element, context, { worldCoordToScreenCoord }) => {
    const line = element as ECadLineElement;

    context.beginPath();
    const { x, y } = worldCoordToScreenCoord(line.x, line.y);
    const { x: x2, y: y2 } = worldCoordToScreenCoord(
      line.x + line.w,
      line.y + line.h
    );
    context.moveTo(x, y);
    context.lineTo(x2, y2);
    context.stroke();
  },

  hitTest: (
    element: ECadBaseElement,
    x: number,
    y: number,
    epsilon: number
  ) => {
    const line = element as ECadLineElement;
    const dist = distancePointToLine(
      x,
      y,
      line.x,
      line.y,
      line.x + line.w,
      line.y + line.h
    );
    return dist <= epsilon;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const line = element as ECadLineElement;

    return normalizeBox(line.x, line.y, line.x + line.w, line.y + line.h);
  },

  getHandles: (element: ECadBaseElement) => {
    const line = element as ECadLineElement;

    return [
      { x: line.x, y: line.y, idx: 0 },
      { x: line.x + line.w, y: line.y + line.h, idx: 1 },
    ];
  },
}; // workerLine

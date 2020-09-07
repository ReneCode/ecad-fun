import { ElementWorker, ECadBaseElement, ECadRectangleElement } from "../types";

import {
  normalizeBox,
  distancePointToLine,
  transformPoint,
} from "../utils/geometric";

export const workerRectangle: ElementWorker = {
  type: "rectangle",

  render: (element, context, { worldToScreenMatrix }) => {
    context.beginPath();
    const rectangle = element as ECadRectangleElement;
    const { x: x1, y: y1 } = transformPoint(
      rectangle.x1,
      rectangle.y1,
      worldToScreenMatrix
    );
    const { x: x2, y: y2 } = transformPoint(
      rectangle.x2,
      rectangle.y2,
      worldToScreenMatrix
    );
    if (rectangle.fill) {
      context.fillStyle = rectangle.fill;
      context.fillRect(x1, y1, x2 - x1, y2 - y1);
    }
    context.rect(x1, y1, x2 - x1, y2 - y1);
    context.stroke();
  },

  hitTest: (element, pt, epsilon) => {
    const rect = element as ECadRectangleElement;

    const hitTestLine = (x1: number, y1: number, x2: number, y2: number) => {
      const dist = distancePointToLine(pt.x, pt.y, x1, y1, x2, y2);
      return dist <= epsilon;
    };

    return (
      hitTestLine(rect.x1, rect.y1, rect.x1, rect.y2) ||
      hitTestLine(rect.x1, rect.y2, rect.x2, rect.y2) ||
      hitTestLine(rect.x2, rect.y2, rect.x2, rect.y1) ||
      hitTestLine(rect.x2, rect.y1, rect.x1, rect.y1)
    );
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const rectangle = element as ECadRectangleElement;

    return normalizeBox(rectangle);
  },
  getHandles: (element: ECadBaseElement) => {
    const rectangle = element as ECadRectangleElement;

    return [
      { x: rectangle.x1, y: rectangle.y1, idx: 0 },
      { x: rectangle.x1, y: rectangle.y2, idx: 1 },
      { x: rectangle.x2, y: rectangle.y2, idx: 2 },
      { x: rectangle.x2, y: rectangle.y1, idx: 3 },
    ];
  },

  moveByDelta: (element, { x: dx, y: dy }): ECadRectangleElement => {
    const rectangle = element as ECadRectangleElement;
    return {
      ...rectangle,
      x1: rectangle.x1 + dx,
      y1: rectangle.y1 + dy,
      x2: rectangle.x2 + dx,
      y2: rectangle.y2 + dy,
    };
  },

  moveHandle: (element, handleIdx, pt) => {
    const rectangle = element as ECadRectangleElement;
    return { ...rectangle };
  },
};

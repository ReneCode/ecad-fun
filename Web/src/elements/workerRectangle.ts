import { ElementWorker, ECadBaseElement, ECadRectangleElement } from "../types";

import {
  normalizeBox,
  distancePointToLine,
  transformPoint,
} from "../utils/geometric";
import { COLOR } from "../utils/color";
import { ObjectType } from "multiplayer";

export const workerRectangle: ElementWorker = {
  type: "rectangle",

  render: (element, context, { worldToScreenMatrix, selected }) => {
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

    context.strokeStyle = selected
      ? COLOR.SELECTED
      : element.color
      ? element.color
      : COLOR.DEFAULT_STROKE;

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

  updateMoveByDelta: (element, { x: dx, y: dy }): ObjectType => {
    const rectangle = element as ECadRectangleElement;
    return {
      id: rectangle.id,
      x1: rectangle.x1 + dx,
      y1: rectangle.y1 + dy,
      x2: rectangle.x2 + dx,
      y2: rectangle.y2 + dy,
    };
  },

  updateMoveHandle: ({ element, handleIdx, x, y, shiftKey }): ObjectType => {
    const rectangle = element as ECadRectangleElement;
    switch (handleIdx) {
      case 0:
        return { id: rectangle.id, x1: x, y1: y };
      case 1:
        return { id: rectangle.id, x1: x, y2: y };
      case 2:
        return { id: rectangle.id, x2: x, y2: y };
      case 3:
        return { id: rectangle.id, x2: x, y1: y };

      default:
        return rectangle;
    }
  },
};

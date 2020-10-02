import { ElementWorker, ECadBaseElement, ECadCircleElement } from "../types";

import {
  distancePointToPoint,
  normalizeBox,
  transformPoint,
  transformLength,
} from "../utils/geometric";
import { COLOR } from "../utils/color";
import { ObjectType } from "multiplayer";

export const workerCircle: ElementWorker = {
  type: "circle",

  render: (
    element: ECadBaseElement,
    context: CanvasRenderingContext2D,
    { worldToScreenMatrix, selected }
  ) => {
    context.beginPath();
    const circle = element as ECadCircleElement;
    const { x, y } = transformPoint(circle.x, circle.y, worldToScreenMatrix);
    const radius = transformLength(circle.radius, worldToScreenMatrix);
    context.arc(x, y, radius, 0, Math.PI * 2);

    context.strokeStyle = selected
      ? COLOR.SELECTED
      : element.color
      ? element.color
      : COLOR.DEFAULT_STROKE;

    context.stroke();
  },

  hitTest: (element, pt, epsilon) => {
    const circle = element as ECadCircleElement;
    const dist = distancePointToPoint(pt.x, pt.y, circle.x, circle.y);
    return dist >= circle.radius - epsilon && dist <= circle.radius + epsilon;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const circle = element as ECadCircleElement;
    return normalizeBox({
      x1: circle.x - circle.radius,
      y1: circle.y - circle.radius,
      x2: circle.x + circle.radius,
      y2: circle.y + circle.radius,
    });
  },

  getHandles: (element: ECadBaseElement) => {
    const circle = element as ECadCircleElement;
    return [
      { x: circle.x, y: circle.y + circle.radius, idx: 0 },
      { x: circle.x + circle.radius, y: circle.y, idx: 1 },
      { x: circle.x, y: circle.y - circle.radius, idx: 2 },
      { x: circle.x - circle.radius, y: circle.y, idx: 3 },
    ];
  },

  updateMoveByDelta: (element, { x: dx, y: dy }): ObjectType => {
    const circle = element as ECadCircleElement;
    return {
      id: circle.id,
      x: circle.x + dx,
      y: circle.y + dy,
    };
  },

  updateMoveHandle: (element, handleIdx, pt): ObjectType => {
    const circle = element as ECadCircleElement;
    return {
      id: circle.id,
      radius: distancePointToPoint(pt.x, pt.y, circle.x, circle.y),
    };
  },
};

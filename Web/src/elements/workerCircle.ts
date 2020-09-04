import { ElementWorker, ECadBaseElement, ECadCircleElement } from "../types";

import { distancePointToPoint, normalizeBox } from "../utils/geometric";

export const workerCircle: ElementWorker = {
  type: "circle",

  render: (
    element: ECadBaseElement,
    context: CanvasRenderingContext2D,
    {
      worldCoordToScreenCoord,
      worldLengthToScreenLength,
    }: {
      worldCoordToScreenCoord: (
        x: number,
        y: number
      ) => { x: number; y: number };

      worldLengthToScreenLength: (len: number) => number;
    }
  ) => {
    context.beginPath();
    const circle = element as ECadCircleElement;
    const { x, y } = worldCoordToScreenCoord(circle.x, circle.y);
    const radius = worldLengthToScreenLength(circle.radius);
    context.arc(x, y, radius, 0, Math.PI * 2);
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

  moveByDelta: (element, { x: dx, y: dy }): ECadCircleElement => {
    const circle = element as ECadCircleElement;
    return {
      ...circle,
      x: circle.x + dx,
      y: circle.y + dy,
    };
  },

  moveHandle: (element, handleIdx, pt) => {
    const circle = element as ECadCircleElement;
    return {
      ...circle,
      radius: distancePointToPoint(pt.x, pt.y, circle.x, circle.y),
    };
  },
};

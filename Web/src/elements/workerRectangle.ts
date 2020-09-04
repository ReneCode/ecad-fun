import { ElementWorker, ECadBaseElement, ECadRectangleElement } from "../types";

import { normalizeBox } from "../utils/geometric";

export const workerRectangle: ElementWorker = {
  type: "rectangle",

  render: (
    element,
    context,
    { worldCoordToScreenCoord, worldLengthToScreenLength }
  ) => {
    context.beginPath();
    const rectangle = element as ECadRectangleElement;
    const { x, y } = worldCoordToScreenCoord(rectangle.x, rectangle.y);
    const w = worldLengthToScreenLength(rectangle.w);
    const h = worldLengthToScreenLength(rectangle.h);
    context.rect(x, y, w, -h);
    context.stroke();
  },

  hitTest: (element, pt, epsilon) => {
    return false;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const rectangle = element as ECadRectangleElement;

    return normalizeBox(
      rectangle.x,
      rectangle.y,
      rectangle.x + rectangle.w,
      rectangle.y + rectangle.h
    );
  },
  getHandles: (element: ECadBaseElement) => {
    return [];
  },

  moveByDelta: (element, { x: dx, y: dy }): ECadRectangleElement => {
    const rectangle = element as ECadRectangleElement;
    return {
      ...rectangle,
      x: rectangle.x + dx,
      y: rectangle.y + dy,
    };
  },

  moveHandle: (element, handleIdx, pt) => {
    const rectangle = element as ECadRectangleElement;
    return { ...rectangle };
  },
};

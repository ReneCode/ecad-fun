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

  hitTest: (
    element: ECadBaseElement,
    x: number,
    y: number,
    epsilon: number
  ) => {
    const rectangle = element as ECadRectangleElement;
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
    const rectangle = element as ECadRectangleElement;

    return [];
  },
};

import { ElementWorker, ECadBaseElement } from "../types";

import { normalizeBox } from "../utils/geometric";

export const workerDefault: ElementWorker = {
  type: "rectangle",

  render: (
    element,
    context,
    { worldCoordToScreenCoord, worldLengthToScreenLength }
  ) => {},

  hitTest: (
    element: ECadBaseElement,
    x: number,
    y: number,
    epsilon: number
  ) => {
    return false;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    return normalizeBox(0, 0, 0, 0);
  },
  getHandles: (element: ECadBaseElement) => {
    return [];
  },
};

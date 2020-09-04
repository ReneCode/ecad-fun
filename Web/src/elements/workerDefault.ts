import { ElementWorker, ECadBaseElement } from "../types";

import { normalizeBox } from "../utils/geometric";

export const workerDefault: ElementWorker = {
  type: "default",

  render: (
    element,
    context,
    { worldCoordToScreenCoord, worldLengthToScreenLength }
  ) => {},

  hitTest: (element, x, y, epsilon) => {
    return false;
  },

  getBoundingBox: (element) => {
    return normalizeBox(0, 0, 0, 0);
  },
  getHandles: (element) => {
    return [];
  },

  moveByDelta: (element, { x: dx, y: dy }): ECadBaseElement => {
    return element;
  },

  moveHandle: (element, handleIdx, pt) => {
    return element;
  },
};

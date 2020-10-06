import { ElementWorker } from "../types";

import { normalizeBox } from "../utils/geometric";

export const workerDefault: ElementWorker = {
  type: "default",

  render: (
    element,
    context,
    { worldToScreenMatrix, screenToWorldMatrix }
  ) => {},

  hitTest: (element, pt, epsilon) => {
    return false;
  },

  getBoundingBox: (element) => {
    return normalizeBox({ x1: 0, y1: 0, x2: 0, y2: 0 });
  },

  getHandles: (element) => {
    return [];
  },

  updateMoveHandle: ({ element }) => {
    return { id: element.id };
  },

  updateMoveByDelta: (element, delta) => {
    return { id: element.id };
  },
};

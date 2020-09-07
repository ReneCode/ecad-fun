import { ElementWorker, ECadBaseElement } from "../types";

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

  moveByDelta: (element, { x: dx, y: dy }): ECadBaseElement => {
    return element;
  },

  moveHandle: (element, handleIdx, pt) => {
    return element;
  },
};

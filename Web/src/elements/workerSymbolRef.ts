import { ElementWorker, ECadBaseElement, ECadSymbolRefElement } from "../types";
import elementWorkerManager from "./ElementWorkerManager";
import * as Matrix from "../utils/Matrix";

export const workerSymbolRef: ElementWorker = {
  type: "symbolRef",

  render: (element, context, params) => {
    const symbolRef = element as ECadSymbolRefElement;

    const m = Matrix.multiply(
      Matrix.translate(40, 40),
      params.worldToScreenMatrix
    );
    const mInverse = Matrix.inverse(m);

    elementWorkerManager.render(symbolRef.symbol, context, {
      ...params,
      worldToScreenMatrix: m,
      screenToWorldMatrix: mInverse,
    });
  },

  hitTest: (element, pt, epsilon) => {
    // const symbolRef = element as ECadSymbolRefElement;
    return false;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const symbolRef = element as ECadSymbolRefElement;
    return elementWorkerManager.getBoundingBox(symbolRef.symbol);
  },

  getHandles: (element: ECadBaseElement) => {
    // const symbolRef = element as ECadSymbolRefElement;

    return [];
  },

  moveByDelta: (element, { x: dx, y: dy }) => {
    const symbolRef = element as ECadSymbolRefElement;
    return {
      ...symbolRef,
      x: symbolRef.x + dx,
      y: symbolRef.y + dy,
    };
  },

  moveHandle: (element, handleIdx, pt) => {
    return element;
  },
}; // workerLine

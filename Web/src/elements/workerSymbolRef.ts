import { ElementWorker, ECadBaseElement, ECadSymbolRefElement } from "../types";
import elementWorkerManager from "./ElementWorkerManager";

export const workerSymbolRef: ElementWorker = {
  type: "symbolRef",

  render: (element, context, params) => {
    const symbolRef = element as ECadSymbolRefElement;

    context.translate(40, 20);
    context.strokeStyle = "red";

    elementWorkerManager.render(symbolRef.symbol, context, {
      ...params,
      offsetX: symbolRef.x,
      offsetY: symbolRef.y,
    });
  },

  hitTest: (element, pt, epsilon) => {
    const symbolRef = element as ECadSymbolRefElement;
    return false;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const symbolRef = element as ECadSymbolRefElement;
    return elementWorkerManager.getBoundingBox(symbolRef.symbol);
  },

  getHandles: (element: ECadBaseElement) => {
    const symbolRef = element as ECadSymbolRefElement;

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

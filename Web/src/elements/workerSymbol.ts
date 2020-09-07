import { ElementWorker, ECadBaseElement, ECadSymbolElement } from "../types";
import elementWorkerManager from "./ElementWorkerManager";
import { enlargeBoxByBox } from "../utils/geometric";

export const workerSymbol: ElementWorker = {
  type: "symbol",

  render: (element, context, params) => {
    const symbol = element as ECadSymbolElement;
    symbol.children.forEach((element) =>
      elementWorkerManager.render(element, context, params)
    );
  },

  hitTest: (element, pt, epsilon) => {
    const symbol = element as ECadSymbolElement;
    for (const element of symbol.children) {
      if (elementWorkerManager.hitTest(element, pt, epsilon)) {
        return true;
      }
    }
    return false;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const symbol = element as ECadSymbolElement;

    let bbox = elementWorkerManager.getBoundingBox(symbol.children[0]);
    for (let i = 1; i < symbol.children.length; i++) {
      let childBox = elementWorkerManager.getBoundingBox(symbol.children[i]);
      bbox = enlargeBoxByBox(bbox, childBox);
    }
    return bbox;
  },

  getHandles: (element: ECadBaseElement) => {
    const bbox = elementWorkerManager.getBoundingBox(element);

    return [
      { x: bbox.x1, y: bbox.y1, idx: 0 },
      { x: bbox.x1, y: bbox.y2, idx: 1 },
      { x: bbox.x2, y: bbox.y2, idx: 2 },
      { x: bbox.x2, y: bbox.y1, idx: 3 },
    ];
  },

  moveByDelta: (element, { x: dx, y: dy }) => {
    const symbol = element as ECadSymbolElement;
    return {
      ...symbol,
    };
  },

  moveHandle: (element, handleIdx, pt) => {
    return element;
  },
}; // workerLine

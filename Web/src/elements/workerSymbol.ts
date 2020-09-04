import {
  ElementWorker,
  ECadBaseElement,
  ECadLineElement,
  ECadSymbolElement,
} from "../types";
import elementWorkerManager from "./ElementWorkerManager";
import { distancePointToLine, normalizeBox } from "../utils/geometric";

export const workerSymbol: ElementWorker = {
  type: "symbol",

  render: (element, context, params) => {
    const symbol = element as ECadSymbolElement;

    symbol.children.forEach((element) =>
      elementWorkerManager.render(element, context, params)
    );
  },

  hitTest: (element, pt, epsilon) => {
    const line = element as ECadLineElement;
    const dist = distancePointToLine(
      pt.x,
      pt.y,
      line.x1,
      line.y1,
      line.x2,
      line.y2
    );
    return dist <= epsilon;
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const line = element as ECadLineElement;

    return normalizeBox(line);
  },

  getHandles: (element: ECadBaseElement) => {
    return [];
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

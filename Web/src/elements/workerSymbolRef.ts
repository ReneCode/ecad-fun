import { ElementWorker, ECadBaseElement, ECadSymbolRefElement } from "../types";
import elementWorkerManager from "./ElementWorkerManager";
import * as Matrix from "../utils/Matrix";
import { moveBoxByPoint } from "../utils/geometric";

export const workerSymbolRef: ElementWorker = {
  type: "symbolRef",

  render: (element, context, params) => {
    const symbolRef = element as ECadSymbolRefElement;

    // translate Symbol on changing the worldToScreen matrix (and the inverse screenToWorldMatrix)
    let m = Matrix.multiply(
      Matrix.translate(-symbolRef.symbol.refX, -symbolRef.symbol.refY),
      params.worldToScreenMatrix
    );
    m = Matrix.multiply(Matrix.translate(symbolRef.x, symbolRef.y), m);
    const mInverse = Matrix.inverse(m);

    // context.strokeStyle = "yellow";
    elementWorkerManager.render(symbolRef.symbol, context, {
      ...params,
      worldToScreenMatrix: m,
      screenToWorldMatrix: mInverse,
    });
  },

  hitTest: (element, pt, epsilon) => {
    const symbolRef = element as ECadSymbolRefElement;

    // move the pt point 'into' the symbol for hitTesting
    const ptRef = {
      x: pt.x + symbolRef.symbol.refX - symbolRef.x,
      y: pt.y + symbolRef.symbol.refY - symbolRef.y,
    };
    return elementWorkerManager.hitTest(symbolRef.symbol, ptRef, epsilon);
  },

  getBoundingBox: (element: ECadBaseElement) => {
    const symbolRef = element as ECadSymbolRefElement;
    const bbox = elementWorkerManager.getBoundingBox(symbolRef.symbol);
    const ptRef = {
      x: symbolRef.x - symbolRef.symbol.refX,
      y: symbolRef.y - symbolRef.symbol.refY,
    };
    return moveBoxByPoint(bbox, ptRef);
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

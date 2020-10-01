import { ElementWorker, ECadBaseElement, ECadLineElement } from "../types";

import {
  distancePointToLine,
  normalizeBox,
  transformPoint,
} from "../utils/geometric";
import { COLOR } from "../utils/color";

export const workerLine: ElementWorker = {
  type: "line",

  render: (element, context, { worldToScreenMatrix, selected }) => {
    const line = element as ECadLineElement;

    context.beginPath();
    const { x: x1, y: y1 } = transformPoint(
      line.x1,
      line.y1,
      worldToScreenMatrix
    );
    const { x: x2, y: y2 } = transformPoint(
      line.x2,
      line.y2,
      worldToScreenMatrix
    );
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = selected
      ? COLOR.SELECTED
      : element.color
      ? element.color
      : COLOR.DEFAULT_STROKE;

    context.stroke();
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
    const line = element as ECadLineElement;

    return [
      { x: line.x1, y: line.y1, idx: 0 },
      { x: line.x2, y: line.y2, idx: 1 },
    ];
  },

  moveByDelta: (element, { x: dx, y: dy }) => {
    const line = element as ECadLineElement;
    return {
      ...line,
      x1: line.x1 + dx,
      y1: line.y1 + dy,
      x2: line.x2 + dx,
      y2: line.y2 + dy,
    };
  },

  updateMoveByDeleta: (element, { x: dx, y: dy }) => {
    const line = element as ECadLineElement;
    return {
      id: line.id,
      x1: line.x1 + dx,
      y1: line.y1 + dy,
      x2: line.x2 + dx,
      y2: line.y2 + dy,
    };
  },

  moveHandle: (element, handleIdx, pt) => {
    const line = element as ECadLineElement;
    const newLine = { ...line };
    if (handleIdx === 0) {
      newLine.x1 = pt.x;
      newLine.y1 = pt.y;
    }
    if (handleIdx === 1) {
      newLine.x2 = pt.x;
      newLine.y2 = pt.y;
    }
    return newLine;
  },
}; // workerLine

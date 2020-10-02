import { ElementWorker, ECadBaseElement, ECadLineElement } from "../types";

import {
  distancePointToLine,
  normalizeBox,
  transformPoint,
} from "../utils/geometric";
import { COLOR } from "../utils/color";
import { ObjectType } from "multiplayer";

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

  updateMoveByDelta: (element, { x: dx, y: dy }): ObjectType => {
    const line = element as ECadLineElement;
    return {
      id: line.id,
      x1: line.x1 + dx,
      y1: line.y1 + dy,
      x2: line.x2 + dx,
      y2: line.y2 + dy,
    };
  },

  updateMoveHandle: (element, handleIdx, pt): ObjectType => {
    const line = element as ECadLineElement;
    const update: ObjectType = { id: element.id };
    if (handleIdx === 0) {
      update.x1 = pt.x;
      update.y1 = pt.y;
    }
    if (handleIdx === 1) {
      update.x2 = pt.x;
      update.y2 = pt.y;
    }
    return update;
  },
}; // workerLine

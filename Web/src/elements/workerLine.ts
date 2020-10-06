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

  updateMoveHandle: ({ element, handleIdx, x, y, shiftKey }): ObjectType => {
    const line = element as ECadLineElement;
    const update: ObjectType = { id: element.id };

    if (shiftKey) {
      // keep the line-angle
      const ratio = (line.y2 - line.y1) / (line.x2 - line.x1);
      if (Math.abs(ratio) < 1) {
        // take X, recalc Y
        if (handleIdx === 1) {
          const newY = ratio * (x - line.x1) + line.y1;
          update.x2 = x;
          update.y2 = newY;
        } else if (handleIdx === 0) {
          const newY = ratio * (x - line.x2) + line.y2;
          update.x1 = x;
          update.y1 = newY;
        }
      } else {
        // take Y, recalc X
        if (handleIdx === 1) {
          const newX = (y - line.y1) / ratio + line.x1;
          update.x2 = newX;
          update.y2 = y;
        } else if (handleIdx === 0) {
          const newX = (y - line.y2) / ratio + line.x2;
          update.x1 = newX;
          update.y1 = y;
        }
      }
    } else {
      if (handleIdx === 0) {
        update.x1 = x;
        update.y1 = y;
      } else if (handleIdx === 1) {
        update.x2 = x;
        update.y2 = y;
      }
    }
    return update;
  },
}; // workerLine

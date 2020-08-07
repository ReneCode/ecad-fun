import {
  ECadBaseElement,
  ECadLineElement,
  ECadRectangleElement,
} from "../types";
import { normalizeBox, enlargeBox, isPointInsideBox } from "../utils/geometric";

export const hitTestElement = (
  element: ECadBaseElement,
  x: number,
  y: number,
  epsilon: number
) => {
  switch (element.type) {
    case "line":
      return hitTestLine(element as ECadLineElement, x, y, epsilon);
    case "rectangle":
      return hitTestRectangle(element as ECadRectangleElement, x, y);
    case "circle":
      // TODO
      break;
    default:
      throw new Error(`bad element Type: ${element.type}`);
  }
};

const hitTestLine = (
  line: ECadLineElement,
  x: number,
  y: number,
  epsilon: number
) => {
  const bbox = enlargeBox(getBoundingBox(line), epsilon);
  if (!isPointInsideBox(x, y, bbox)) {
    return null;
  }
  return true;
};

const hitTestRectangle = (
  line: ECadRectangleElement,
  x: number,
  y: number
) => {};

export const getBoundingBox = (element: ECadBaseElement) => {
  switch (element.type) {
    case "line":
      const line = element as ECadLineElement;
      return normalizeBox(line.x, line.y, line.x2, line.y2);
    default:
      throw new Error(`bad element Type: ${element.type}`);
  }
};

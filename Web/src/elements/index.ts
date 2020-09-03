import {
  ECadBaseElement,
  ECadLineElement,
  ECadRectangleElement,
  AppState,
  HitTestResult,
  ECadCircleElement,
  Point,
} from "../types";
import {
  normalizeBox,
  enlargeBox,
  isPointInsideBox,
  distancePointToLine,
  distancePointToPoint,
} from "../utils/geometric";
import { dirxml } from "console";

export const getSelectedElements = (state: AppState) => {
  return state.elements.filter((e) => state.selectedElementIds.includes(e.id));
};

export const replaceElements = (
  replacements: ECadBaseElement[],
  state: AppState
) => {
  return state.elements.map((e) => {
    const newElement = replacements.find((re) => re.id === e.id);
    if (newElement) {
      return newElement;
    } else {
      return e;
    }
  });
};

export const hitTestElement = (
  element: ECadBaseElement,
  x: number,
  y: number,
  { gripSize }: { gripSize: number }
): HitTestResult | undefined => {
  const epsilon = gripSize / 2;

  // check if outside bounding box
  const bbox = enlargeBox(getBoundingBox(element), epsilon);
  if (!isPointInsideBox(x, y, bbox)) {
    return;
  }

  // check if handle it hit
  const handles = getHandlesElement(element);
  for (let handle of handles) {
    const bbox = enlargeBox(
      {
        x1: handle.x,
        y1: handle.y,
        x2: handle.x,
        y2: handle.y,
      },
      epsilon
    );
    if (isPointInsideBox(x, y, bbox)) {
      return { id: element.id, type: "handle", handleIdx: handle.idx };
    }
  }

  let hitElement = false;
  switch (element.type) {
    case "line":
      hitElement = hitTestLine(element as ECadLineElement, x, y, epsilon);
      break;
    case "circle":
      hitElement = hitTestCircle(element as ECadCircleElement, x, y, epsilon);
      break;
    case "rectangle":
      hitElement = hitTestRectangle(
        element as ECadRectangleElement,
        x,
        y,
        epsilon
      );
      break;
    default:
      throw new Error(`bad element Type: ${element.type}`);
  }
  if (hitElement) {
    return { id: element.id, type: "element" };
  }
};

const hitTestLine = (
  line: ECadLineElement,
  x0: number,
  y0: number,
  epsilon: number
) => {
  const dist = distancePointToLine(
    x0,
    y0,
    line.x,
    line.y,
    line.x + line.w,
    line.y + line.h
  );
  return dist <= epsilon;
};

const hitTestCircle = (
  circle: ECadCircleElement,
  x: number,
  y: number,
  epsilon: number
) => {
  const dist = distancePointToPoint(x, y, circle.x, circle.y);
  return dist >= circle.radius - epsilon && dist <= circle.radius + epsilon;
};

const hitTestRectangle = (
  line: ECadRectangleElement,
  x: number,
  y: number,
  epsilon: number
) => {
  return false;
};

export const getBoundingBox = (element: ECadBaseElement) => {
  switch (element.type) {
    case "line":
      const line = element as ECadLineElement;
      return normalizeBox(line.x, line.y, line.x + line.w, line.y + line.h);

    case "circle":
      const circle = element as ECadCircleElement;
      return normalizeBox(
        circle.x - circle.radius,
        circle.y - circle.radius,
        circle.x + circle.radius,
        circle.y + circle.radius
      );

    default:
      throw new Error(`bad element Type: ${element.type}`);
  }
};

/**
 *
 * @returns { x:number, y:number, idx: number }[]
 */
export const getHandlesElement = (element: ECadBaseElement) => {
  switch (element.type) {
    case "line":
      return getHandlesLine(element as ECadLineElement);
    case "circle":
      return getHandlesCircle(element as ECadCircleElement);
    default:
      throw new Error("error");
  }
};

const getHandlesLine = (line: ECadLineElement) => {
  return [
    { x: line.x, y: line.y, idx: 0 },
    { x: line.x + line.w, y: line.y + line.h, idx: 1 },
  ];
};

const getHandlesCircle = (circle: ECadCircleElement) => {
  return [
    { x: circle.x, y: circle.y + circle.radius, idx: 0 },
    { x: circle.x + circle.radius, y: circle.y, idx: 1 },
    { x: circle.x, y: circle.y - circle.radius, idx: 2 },
    { x: circle.x - circle.radius, y: circle.y, idx: 3 },
  ];
};

export const moveHandleOfElement = (
  element: ECadBaseElement,
  handleIdx: number,
  pt: Point
) => {
  switch (element.type) {
    case "line":
      return moveHandleOfLine(element as ECadLineElement, handleIdx, pt);
    default:
      throw new Error("bad type for moveHandleOfElement");
  }
};

export const moveHandleOfLine = (
  line: ECadLineElement,
  handleIdx: number,
  pt: Point
): ECadLineElement => {
  const newLine = { ...line };
  if (handleIdx === 0) {
    const dx = pt.x - line.x;
    const dy = pt.y - line.y;
    newLine.x = pt.x;
    newLine.y = pt.y;
    newLine.w = line.w - dx;
    newLine.h = line.h - dy;
  }

  return newLine;
};

export const moveElementByDelta = (element: ECadBaseElement, delta: Point) => {
  switch (element.type) {
    case "line":
      return moveByDeltaLine(element as ECadLineElement, delta);
    case "circle":
    case "rectangle":
      return { ...element, x: element.x + delta.x, y: element.y + delta.y };
    default:
      throw new Error("bad type for moveHandleOfElement");
  }
};

export const moveByDeltaLine = (
  line: ECadLineElement,
  delta: Point
): ECadLineElement => {
  return { ...line, x: line.x + delta.x, y: line.y + delta.y };
};

import {
  ECadBaseElement,
  ECadLineElement,
  ECadRectangleElement,
  AppState,
  HitTestResult,
} from "../types";
import {
  normalizeBox,
  enlargeBox,
  isPointInsideBox,
  distancePointToLine,
} from "../utils/geometric";

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
  const handles = getHandles(element);
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

  switch (element.type) {
    case "line":
      return hitTestLine(element as ECadLineElement, x, y, epsilon);
    case "rectangle":
    // return hitTestRectangle(element as ECadRectangleElement, x, y);
    case "circle":
      // TODO
      break;
    default:
      throw new Error(`bad element Type: ${element.type}`);
  }
};

const hitTestLine = (
  line: ECadLineElement,
  x0: number,
  y0: number,
  epsilon: number
): HitTestResult | undefined => {
  const dist = distancePointToLine(
    x0,
    y0,
    line.x,
    line.y,
    line.x + line.w,
    line.y + line.h
  );
  if (dist <= epsilon) {
    return { id: line.id, type: "element" };
  }
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
      return normalizeBox(line.x, line.y, line.x + line.w, line.y + line.h);
    default:
      throw new Error(`bad element Type: ${element.type}`);
  }
};

/**
 *
 * @returns { x:number, y:number, idx: number }[]
 */
const getHandles = (element: ECadBaseElement) => {
  switch (element.type) {
    case "line":
      return getHandlesLine(element as ECadLineElement);
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

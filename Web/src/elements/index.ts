import {
  ECadBaseElement,
  ECadLineElement,
  AppState,
  HitTestResult,
  ECadCircleElement,
  Point,
} from "../types";
import { enlargeBox, isPointInsideBox } from "../utils/geometric";

import elementWorkerManager from "../elements/ElementWorkerManager";

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

  const hitElement = elementWorkerManager.hitTest(
    element as ECadCircleElement,
    x,
    y,
    epsilon
  );
  if (hitElement) {
    return { id: element.id, type: "element" };
  }
};

export const getBoundingBox = (element: ECadBaseElement) => {
  return elementWorkerManager.getBoundingBox(element);
};

/**
 *
 * @returns ElementHandle[]
 */
export const getHandlesElement = (element: ECadBaseElement) => {
  return elementWorkerManager.getHandles(element);
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

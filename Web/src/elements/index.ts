import {
  ECadBaseElement,
  AppState,
  HitTestResult,
  ECadCircleElement,
  Point,
  Box,
} from "../types";
import {
  enlargeBox,
  isPointInsideBox,
  normalizeBox,
  intersectBoxWithBox,
} from "../utils/geometric";

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
  pt: Point,
  { gripSize }: { gripSize: number }
): HitTestResult | undefined => {
  const epsilon = gripSize / 2;

  // check if outside bounding box
  const bbox = enlargeBox(getBoundingBox(element), epsilon);
  if (!isPointInsideBox(pt, bbox)) {
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
    if (isPointInsideBox(pt, bbox)) {
      return { id: element.id, type: "handle", handleIdx: handle.idx };
    }
  }

  const hitElement = elementWorkerManager.hitTest(
    element as ECadCircleElement,
    pt,
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
  return elementWorkerManager.moveHandle(element, handleIdx, pt);
};

export const moveElementByDelta = (element: ECadBaseElement, delta: Point) => {
  return elementWorkerManager.moveByDelta(element, delta);
};

export const insideSelectionBox = (
  element: ECadBaseElement,
  selectionBox: Box
) => {
  const normElementBox = elementWorkerManager.getBoundingBox(element);
  const normSelectionBox = normalizeBox(selectionBox);

  // TODO optimize on lines
  const intersect = intersectBoxWithBox(normElementBox, normSelectionBox);
  if (intersect) {
    return true;
  }
};

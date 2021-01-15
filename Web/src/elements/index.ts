import {
  ECadBaseElement,
  AppState,
  HitTestResult,
  ECadCircleElement,
  Point,
  Box,
  ElementChangeArgs,
} from "../types";
import {
  enlargeBoxByDelta,
  isPointInsideBox,
  normalizeBox,
  intersectBoxWithBox,
} from "../utils/geometric";

import elementWorkerManager from "../elements/ElementWorkerManager";
import { Project } from "../share";

export const getElements = (project: Project): readonly ECadBaseElement[] => {
  const elements = project.getRoot()._children;
  if (!elements) {
    return [];
  }
  return elements as ECadBaseElement[];
};

export const getSelectedElements = (
  state: AppState,
  elements: readonly ECadBaseElement[]
) => {
  return elements.filter((e) => state.selectedElementIds.includes(e.id));
};

export const replaceElements = (
  elements: readonly ECadBaseElement[],
  replacements: ECadBaseElement[]
) => {
  return elements.map((e) => {
    const newElement = replacements.find((re) => re.id === e.id);
    if (newElement) {
      return newElement;
    } else {
      return e;
    }
  });
};

export type HitTestElementOption = { gripSize: number };

export const hitTestElement = (
  element: ECadBaseElement,
  pt: Point,
  { gripSize }: HitTestElementOption
): HitTestResult | undefined => {
  const epsilon = gripSize / 2;

  // check if outside bounding box
  const bbox = enlargeBoxByDelta(getBoundingBox(element), epsilon);
  if (!isPointInsideBox(pt, bbox)) {
    return;
  }

  // check if handle it hit
  const handles = getHandlesElement(element);
  for (let handle of handles) {
    const bbox = enlargeBoxByDelta(
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

export const updateMoveHandleOfElement = (args: ElementChangeArgs) => {
  return elementWorkerManager.updateMoveHandle(args);
};

export const updateMoveElementByDelta = (
  element: ECadBaseElement,
  delta: Point
) => {
  return elementWorkerManager.updateMoveByDelta(element, delta);
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

export const copyElements = (elements: ECadBaseElement[]) => {
  return elements.map((e) => {
    return { ...e };
  });
};

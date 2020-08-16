import {
  ECadBaseElement,
  ECadLineElement,
  ECadRectangleElement,
  AppState,
} from "../types";
import { normalizeBox, enlargeBox, isPointInsideBox } from "../utils/geometric";

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
  state: { gripSize: number }
) => {
  switch (element.type) {
    case "line":
      return hitTestLine(element as ECadLineElement, x, y, state);
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
  x: number,
  y: number,
  { gripSize }: { gripSize: number }
) => {
  const bbox = enlargeBox(getBoundingBox(line), gripSize);
  if (!isPointInsideBox(x, y, bbox)) {
    return;
  }

  const gripHandles = getGripHandlesLine(line);
  for (let gripHandle of gripHandles) {
    const bbox = enlargeBox(
      {
        x1: gripHandle.x,
        y1: gripHandle.y,
        x2: gripHandle.x,
        y2: gripHandle.y,
      },
      gripSize / 2
    );
    if (isPointInsideBox(x, y, bbox)) {
      return { id: line.id, type: "grip", idx: gripHandle.idx };
    }
  }

  return { id: line, type: "element" };
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

const getGripHandlesLine = (line: ECadLineElement) => {
  return [
    { x: line.x, y: line.y, idx: 0 },
    { x: line.x + line.w, y: line.y + line.h, idx: 1 },
  ];
};

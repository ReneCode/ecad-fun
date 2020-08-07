import { ECadCircleElement, Action, AppState } from "../types";
import { distanceBetweenPoints } from "../utils/geometric";
import { getRandomId } from "../utils/getRandomId";

export const actionCircle: Action = {
  name: "circle",

  pointerDown: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadCircleElement = {
      id: getRandomId(),
      type: "circle",
      x,
      y,
      radius: 0,
      color: "black",
    };
    return {
      editingElement: element,
    };
  },

  pointerMove: (state: AppState) => {
    if (state.editingElement) {
      const { x, y } = state.editingElement;
      const nx = state.pointerX;
      const ny = state.pointerY;
      const radius = distanceBetweenPoints(x, y, nx, ny);
      const element: ECadCircleElement = {
        ...state.editingElement,
        radius,
      };
      return {
        editingElement: element,
      };
    }
  },

  pointerUp: (state: AppState) => {
    if (state.editingElement) {
      return {
        elements: [...state.elements, state.editingElement],
        editingElement: null,
      };
    }
  },
};

import { ECadRectangleElement, Action, AppState } from "../types";
import { randomId } from "../utils/randomId";

export const actionRectangle: Action = {
  name: "rectangle",

  pointerDown: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadRectangleElement = {
      id: randomId(),
      type: "rectangle",
      x,
      y,
      w: 0,
      h: 0,
      color: "green",
    };
    return {
      editingElement: element,
    };
  },

  pointerMove: (state: AppState) => {
    if (state.editingElement) {
      const x = state.pointerX;
      const y = state.pointerY;

      const element: ECadRectangleElement = {
        ...state.editingElement,
        w: x - state.editingElement.x,
        h: y - state.editingElement.y,
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

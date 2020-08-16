import { ECadLineElement, Action, AppState } from "../types";
import { randomId } from "../utils/randomId";

export const actionLine: Action = {
  name: "line",

  pointerDown: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadLineElement = {
      id: randomId(),
      type: "line",
      x,
      y,
      w: 0,
      h: 0,
      color: "#222",
    };
    return {
      editingElement: element,
    };
  },

  pointerMove: (state: AppState) => {
    if (state.editingElement) {
      const x = state.pointerX;
      const y = state.pointerY;

      const oldLine = state.editingElement;
      const element: ECadLineElement = {
        ...oldLine,
        w: x - oldLine.x,
        h: y - oldLine.y,
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

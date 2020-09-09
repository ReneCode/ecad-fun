import { ECadRectangleElement, Action } from "../types";
import { randomId } from "../utils/randomId";

export const actionRectangle: Action = {
  name: "rectangle",

  pointerDown: ({ state }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadRectangleElement = {
      id: randomId(),
      type: "rectangle",
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      color: "green",
    };
    return {
      state: {
        editingElement: element,
      },
    };
  },

  pointerMove: ({ state }) => {
    if (state.editingElement) {
      const x = state.pointerX;
      const y = state.pointerY;

      const rectangle = state.editingElement as ECadRectangleElement;
      const element: ECadRectangleElement = {
        ...rectangle,
        x2: x,
        y2: y,
      };
      return {
        state: {
          editingElement: element,
        },
      };
    }
  },

  pointerUp: ({ state, elements }) => {
    if (state.editingElement) {
      return {
        state: {
          editingElement: null,
        },
        elements: [...elements, state.editingElement],
        stopAction: true,
      };
    }
  },
};

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
      x,
      y,
      w: 0,
      h: 0,
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
        w: x - rectangle.x,
        h: y - rectangle.y,
      };
      return {
        state: {
          editingElement: element,
        },
      };
    }
  },

  pointerUp: ({ state }) => {
    if (state.editingElement) {
      return {
        state: {
          elements: [...state.elements, state.editingElement],
          editingElement: null,
        },
        stopAction: true,
      };
    }
  },
};

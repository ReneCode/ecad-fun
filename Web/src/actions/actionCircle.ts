import { ECadCircleElement, Action } from "../types";
import { distancePointToPoint } from "../utils/geometric";
import { randomId } from "../utils/randomId";

export const actionCircle: Action = {
  name: "circle",

  pointerDown: ({ state }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadCircleElement = {
      id: randomId(),
      type: "circle",
      x,
      y,
      radius: 0,
      color: "black",
    };
    return {
      state: {
        editingElement: element,
      },
      pointerState: {
        downX: x,
        downY: y,
      },
    };
  },

  pointerMove: ({ state }) => {
    if (state.editingElement) {
      const { x, y } = state.editingElement;
      const nx = state.pointerX;
      const ny = state.pointerY;
      const radius = distancePointToPoint(x, y, nx, ny);
      const element: ECadCircleElement = {
        ...state.editingElement,
        radius,
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

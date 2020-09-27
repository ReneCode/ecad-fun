import { ECadLineElement, Action } from "../types";
import { randomId } from "../utils/randomId";

export const actionLine: Action = {
  name: "line",

  pointerDown: ({ state }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadLineElement = {
      id: randomId(),
      type: "line",
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      color: "#222",
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

      const oldLine = state.editingElement as ECadLineElement;
      const element: ECadLineElement = {
        ...oldLine,
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

  pointerUp: ({ state, elements, project }) => {
    if (state.editingElement) {
      console.log(">>>>");
      return {
        state: {
          editingElement: null,
        },
        elements: [...elements, state.editingElement],
        createObject: { _parent: `0:0-5`, ...state.editingElement },
        stopAction: true,
      };
    }
  },
};

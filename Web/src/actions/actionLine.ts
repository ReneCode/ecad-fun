import { ECadLineElement, Action } from "../types";

export const actionLine: Action = {
  name: "line",

  pointerDown: ({ state, project, params }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadLineElement = {
      id: project.createNewId(),
      _parent: state.currentPageId,
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

  pointerMove: ({ state, params }) => {
    if (state.editingElement) {
      let x = state.pointerX;
      let y = state.pointerY;

      const { shiftKey } = params;

      const oldLine = state.editingElement as ECadLineElement;
      if (shiftKey) {
        const dx = Math.abs(x - oldLine.x1);
        const dy = Math.abs(y - oldLine.y1);
        if (dx > dy) {
          y = oldLine.y1;
        } else {
          x = oldLine.x1;
        }
      }

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

  pointerUp: ({ state }) => {
    if (state.editingElement) {
      return {
        state: {
          editingElement: null,
        },
        createObjects: [state.editingElement],
        stopAction: true,
      };
    }
  },
};

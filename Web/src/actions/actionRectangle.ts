import { CUD_Create, ECadRectangleElement } from "../types";
import { registerAction } from "./registerAction";

export const actionRectangle = registerAction({
  name: "rectangle",

  pointerDown: ({ state, project }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadRectangleElement = {
      id: project.createNewId(),
      _parent: state.currentPageId,
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

  pointerUp: ({ state }) => {
    if (state.editingElement) {
      return {
        state: {
          editingElement: null,
        },
        doCUD: [CUD_Create([state.editingElement])],
        stopAction: true,
      };
    }
  },
});

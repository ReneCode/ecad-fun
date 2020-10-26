import { ECadCircleElement, Action } from "../types";
import { distancePointToPoint } from "../utils/geometric";

export const actionCircle: Action = {
  name: "circle",

  pointerDown: ({ state, project }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadCircleElement = {
      id: project.createNewId(),
      _parent: project.getRoot().id,
      type: "circle",
      x,
      y,
      radius: 0,
      lineWidth: 1,
      color: "#33ee4488",
    };
    return {
      state: {
        editingElement: element,
      },
      actionState: {
        lastX: x,
        lastY: y,
      },
    };
  },

  pointerMove: ({ state }) => {
    if (state.editingElement) {
      const circle = state.editingElement as ECadCircleElement;
      const nx = state.pointerX;
      const ny = state.pointerY;
      const radius = distancePointToPoint(circle.x, circle.y, nx, ny);
      const element: ECadCircleElement = {
        ...(state.editingElement as ECadCircleElement),
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
          editingElement: null,
        },
        createObjects: [state.editingElement],
        stopAction: true,
      };
    }
  },
};

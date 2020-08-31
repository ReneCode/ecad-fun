import { Action, AppState, POINTER_BUTTONS } from "../types";
import {
  hitTestElement,
  getSelectedElements,
  replaceElements,
} from "../elements";

let lastPoint: { x: number; y: number } = { x: 0, y: 0 };

export const actionSelect: Action = {
  name: "select",

  pointerDown: ({ state }) => {
    const x = state.pointerX;
    const y = state.pointerY;

    lastPoint = { x, y };

    const selectedElements = state.elements.filter((e) =>
      state.selectedElementIds.includes(e.id)
    );
    for (let element of selectedElements) {
      const result = hitTestElement(element, x, y, state);
      if (result) {
        return {
          state: {
            selectedElementIds: [result.id],
            selectedHandleIdx: result.type === "handle" ? result.handleIdx : -1,
          },
        };
      }
    }

    for (let element of state.elements) {
      const result = hitTestElement(element, x, y, state);
      if (result) {
        return {
          state: {
            selectedElementIds: [result.id],
            selectedHandleIdx: -1,
          },
        };
      }
    }

    return {
      state: {
        selectedElementIds: [],
      },
    };
  },

  pointerMove: ({ state }) => {
    if (
      state.selectedElementIds.length > 0 &&
      state.pointerButtons & POINTER_BUTTONS.MAIN
    ) {
      const x = state.pointerX;
      const y = state.pointerY;
      const dx = x - lastPoint.x;
      const dy = y - lastPoint.y;

      lastPoint = { x, y };

      const replace = getSelectedElements(state).map((e) => {
        return {
          ...e,
          x: e.x + dx,
          y: e.y + dy,
        };
      });
      return {
        state: {
          elements: replaceElements(replace, state),
        },
      };
    }
  },
};

import { Action, POINTER_BUTTONS } from "../types";
import {
  hitTestElement,
  getSelectedElements,
  replaceElements,
  moveHandleOfElement,
  moveElementByDelta,
} from "../elements";

export const actionSelect: Action = {
  name: "select",

  stop: ({ state }) => {
    return {
      state: {
        selectedElementIds: [],
      },
    };
  },

  pointerDown: ({ state }) => {
    const x = state.pointerX;
    const y = state.pointerY;

    const selectedElements = state.elements.filter((e) =>
      state.selectedElementIds.includes(e.id)
    );
    for (let element of selectedElements) {
      const result = hitTestElement(element, { x, y }, state);
      if (result) {
        return {
          state: {
            selectedElementIds: [result.id],
          },
          actionState: {
            lastX: x,
            lastY: y,
            selectedHandleIdx: result.type === "handle" ? result.handleIdx : -1,
          },
        };
      }
    }

    for (let element of state.elements) {
      const result = hitTestElement(element, { x, y }, state);
      if (result) {
        return {
          state: {
            selectedElementIds: [result.id],
          },
          actionState: {
            lastX: x,
            lastY: y,
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

  pointerMove: ({ state, actionState }) => {
    if (
      state.selectedElementIds.length > 0 &&
      state.pointerButtons & POINTER_BUTTONS.MAIN
    ) {
      const x = state.pointerX;
      const y = state.pointerY;
      const dx = x - actionState.lastX;
      const dy = y - actionState.lastY;
      const handleIdx = actionState.selectedHandleIdx;

      if (handleIdx < 0) {
        // move element

        const replace = getSelectedElements(state).map((e) => {
          return moveElementByDelta(e, { x: dx, y: dy });
          // return {
          //   ...e,
          //   x: e.x + dx,
          //   y: e.y + dy,
          // };
        });
        return {
          state: {
            elements: replaceElements(replace, state),
          },
          actionState: {
            lastX: x,
            lastY: y,
          },
        };
      } else {
        // move handle
        const replace = getSelectedElements(state).map((e) => {
          return moveHandleOfElement(e, handleIdx, { x, y });
        });
        return {
          state: {
            elements: replaceElements(replace, state),
          },
          actionState: {
            lastX: x,
            lastY: y,
          },
        };
      }
    }
  },
};

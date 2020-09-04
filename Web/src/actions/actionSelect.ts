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

    //  check selection on the selected elements
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

    // select new element be picking
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

    // start select with selection-box

    return {
      state: {
        lastX: x,
        lastY: y,
        selectedElementIds: [],
        selectionBox: { x1: x, y1: y, x2: x, y2: y },
      },
      actionState: {
        mode: "selectionbox",
      },
    };
  },

  pointerMove: ({ state, actionState }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    if (
      state.selectedElementIds.length > 0 &&
      state.pointerButtons & POINTER_BUTTONS.MAIN
    ) {
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

    // draw selection-box
    if (state.selectionBox && state.pointerButtons & POINTER_BUTTONS.MAIN) {
      return {
        state: {
          selectionBox: {
            ...state.selectionBox,
            x2: x,
            y2: y,
          },
        },
      };
    }
  },

  pointerUp: ({ state, actionState }) => {
    return {
      state: {
        selectionBox: null,
      },
    };
  },
};

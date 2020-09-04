import { Action, POINTER_BUTTONS, ECadRectangleElement } from "../types";
import {
  hitTestElement,
  getSelectedElements,
  replaceElements,
  moveHandleOfElement,
  moveElementByDelta,
  insideSelectionBox,
} from "../elements";
import { COLOR } from "../utils/color";

export const actionSelect: Action = {
  name: "select",

  stop: ({ state }) => {
    return {
      state: {
        selectedElementIds: [],
      },
      actionState: {
        selectionMode: "element",
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
      if (
        result?.type === "element" &&
        state.selectedElementIds.includes(result.id)
      ) {
        // element is allready selected
        return {
          actionState: {
            lastX: x,
            lastY: y,
          },
        };
      }
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
        selectionBox: createSelectionBox(x, y),
      },
      actionState: {
        selectionMode: "selectionbox",
      },
    };
  },

  pointerMove: ({ state, actionState }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    if (
      actionState.selectionMode === "element" &&
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
    if (
      actionState.selectionMode === "selectionbox" &&
      state.selectionBox &&
      state.pointerButtons & POINTER_BUTTONS.MAIN
    ) {
      const selectionBox = { ...state.selectionBox, x2: x, y2: y };
      const selectedElementIds = state.elements
        .filter((element) => {
          return insideSelectionBox(element, selectionBox);
        })
        .map((element) => element.id);
      return {
        state: {
          selectionBox: selectionBox,
          selectedElementIds: selectedElementIds,
        },
      };
    }
  },

  pointerUp: ({ state, actionState }) => {
    return {
      state: {
        selectionBox: null,
      },
      actionState: {
        selectionMode: "element",
      },
    };
  },
};

const createSelectionBox = (x: number, y: number): ECadRectangleElement => {
  return {
    id: "",
    type: "rectangle",
    color: COLOR.SELECTION_BOX_BORDER,
    fill: COLOR.SELECTION_BOX_FILL,
    x1: x,
    y1: y,
    x2: x,
    y2: y,
  };
};

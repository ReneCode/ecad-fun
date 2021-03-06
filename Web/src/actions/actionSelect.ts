import {
  POINTER_BUTTONS,
  ECadRectangleElement,
  ActionResult,
  ECadBaseElement,
  CUD_Update,
  ActionState,
} from "../types";
import {
  hitTestElement,
  getSelectedElements,
  insideSelectionBox,
  updateMoveElementByDelta,
  updateMoveHandleOfElement,
  copyElements,
} from "../elements";

import { getCurrentPageElements } from "../data/getCurrentPageElements";
import { COLOR } from "../utils/color";
import { ObjectType } from "../share";
import { registerAction } from "./registerAction";

export const actionSelect = registerAction({
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

  pointerDown: ({ state, project }): ActionResult | void => {
    const x = state.pointerX;
    const y = state.pointerY;

    const elements = getCurrentPageElements(project, state);
    //  check selection on the selected elements
    const selectedElements = elements.filter((e) =>
      state.selectedElementIds.includes(e.id)
    );
    for (let element of selectedElements) {
      const result = hitTestElement(element, { x, y }, state);
      if (
        result?.type === "element" &&
        state.selectedElementIds.includes(result.id)
      ) {
        // element is allready selected
        // update actionState.oldData
        return {
          actionState: {
            lastX: x,
            lastY: y,
            ...saveOrginalElements(selectedElements),
          },
        };
      }
      if (result) {
        // handle selected
        // update actionState.oldData
        return {
          state: {
            selectedElementIds: [result.id],
          },
          actionState: {
            lastX: x,
            lastY: y,
            selectedHandleIdx: result.type === "handle" ? result.handleIdx : -1,
            ...saveOrginalElements([element]),
          },
        };
      }
    }

    // select new element be picking
    for (let element of elements) {
      const result = hitTestElement(element, { x, y }, state);
      if (result) {
        // select element by picking
        return {
          state: {
            selectedElementIds: [result.id],
          },
          actionState: {
            lastX: x,
            lastY: y,
            selectedHandleIdx: -1,
            ...saveOrginalElements([element]),
          },
        };
      }
    }

    // start select with selection-box
    return {
      state: {
        selectedElementIds: [],
        selectionBox: createSelectionBox(x, y),
      },
      actionState: {
        selectionMode: "selectionbox",
        ...saveOrginalElements([]),
      },
    };
  },

  pointerMove: ({
    state,
    project,
    actionState,
    params,
  }): ActionResult | void => {
    const elements = getCurrentPageElements(project, state);
    if (elements.length === 0) {
      return;
    }

    const { shiftKey } = params;
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

        const update = getSelectedElements(state, elements)
          .map((e) => {
            return updateMoveElementByDelta(e, { x: dx, y: dy });
          })
          .filter((o) => !!o) as ObjectType[];
        return {
          doCUD: [CUD_Update(update)],
          withUndo: false,
          // elements: replaceElements(elements, replace),
          actionState: {
            lastX: x,
            lastY: y,
            newData: update,
          },
        };
      } else {
        // move handle
        const update = getSelectedElements(state, elements)
          .map((e) => {
            return updateMoveHandleOfElement({
              element: e,
              handleIdx,
              x,
              y,
              shiftKey,
            });
          })
          .filter((o) => !!o) as ObjectType[];
        return {
          doCUD: [CUD_Update(update)],
          withUndo: false,
          actionState: {
            lastX: x,
            lastY: y,
            newData: update,
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
      const selectedElements = elements.filter((element) => {
        return insideSelectionBox(element, selectionBox);
      });
      // select elements by box");
      return {
        state: {
          selectionBox: selectionBox,
          selectedElementIds: selectedElements.map((e) => e.id),
        },
        actionState: {
          ...saveOrginalElements(selectedElements),
        },
      };
    }
  },

  pointerUp: ({ state, actionState }): ActionResult | void => {
    let result = {};
    if (actionState.newData && actionState.newData.length > 0) {
      result = {
        doCUD: [CUD_Update(actionState.newData, actionState.oldData)],
      };
    }
    return {
      ...result,
      state: {
        selectionBox: null,
      },
      actionState: {
        selectionMode: "element",
        selectedHandleIdx: -1,
        newData: [],
      },
    };
  },
});

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

const saveOrginalElements = (
  elements: ECadBaseElement[]
): Partial<ActionState> => {
  return {
    oldData: copyElements(elements),
    newData: [],
  };
};

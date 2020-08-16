import { Action, AppState, POINTER_BUTTONS } from "../types";
import {
  hitTestElement,
  getSelectedElements,
  replaceElements,
} from "../elements";

let lastPoint: { x: number; y: number } = { x: 0, y: 0 };

export const actionSelect: Action = {
  name: "select",

  pointerDown: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;

    lastPoint = { x, y };
    // const selectedElements = state.elements.filter((e) =>
    //   state.selectedElementIds.includes(e.id)
    // );
    // for (let element of selectedElements) {
    //   const result = hitTestElement(element, x, y, state);
    //   if (result) {
    //     if (result.type === "grip") {
    //       return {
    //         cursor: "move",
    //       };
    //     }
    //     return {
    //       cursor: "pointer",
    //     };
    //   }
    // }

    for (let element of state.elements) {
      if (hitTestElement(element, x, y, state)) {
        return {
          selectedElementIds: [element.id],
        };
      }
    }

    return {
      selectedElementIds: [],
    };
  },

  pointerMove: (state: AppState) => {
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
        elements: replaceElements(replace, state),
      };
    }
  },
};

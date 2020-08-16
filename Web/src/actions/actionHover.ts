import { Action, AppState } from "../types";
import { hitTestElement } from "../elements";

export const actionHover: Action = {
  name: "hover",

  pointerMove: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;

    const selectedElements = state.elements.filter((e) =>
      state.selectedElementIds.includes(e.id)
    );
    for (let element of selectedElements) {
      const result = hitTestElement(element, x, y, state);
      if (result) {
        if (result.type === "grip") {
          return {
            cursor: "move",
          };
        }
        return {
          cursor: "pointer",
        };
      }
    }

    for (let element of state.elements) {
      if (element.type === "line") {
        const result = hitTestElement(element, x, y, state);

        if (result) {
          return {
            cursor: "pointer",
          };
        }
      }
    }
    return {
      cursor: "default",
    };
  },
};

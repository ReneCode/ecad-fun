import { Action, AppState } from "../types";
import { hitTestElement } from "../elements";

export const actionHover: Action = {
  name: "hover",

  pointerMove: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;

    for (let element of state.elements) {
      if (element.type === "line") {
        if (hitTestElement(element, x, y, 2)) {
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

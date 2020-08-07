import { Action, AppState } from "../types";

export const actionHover: Action = {
  name: "hover",

  pointerMove: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;

    for (let element of state.elements) {
      if (element.type === "circle") {
        if (x > element.x && y > element.y) {
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

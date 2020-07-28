import { Action } from "./manager";
import { AppState } from "../state/appState";

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

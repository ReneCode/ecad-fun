import { Action } from "./manager";
import { AppState } from "../state/appState";

export const actionSelect: Action = {
  name: "select",

  pointerMove: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;
  },
};

import { Action, AppState } from "../types";

export const actionSelect: Action = {
  name: "select",

  pointerMove: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;
  },
};

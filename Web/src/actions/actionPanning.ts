import { Action } from "../types";

export const actionPanning: Action = {
  name: "panning",

  execute: ({ state, params }) => {
    return {
      state: {
        screenOriginX: state.screenOriginX - params.deltaX,
        screenOriginY: state.screenOriginY - params.deltaY,
      },
    };
  },
};

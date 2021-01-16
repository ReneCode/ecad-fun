import { registerAction } from "./registerAction";

export const actionPanning = registerAction({
  name: "panning",

  execute: ({ state, params }) => {
    return {
      state: {
        screenOriginX: state.screenOriginX - params.deltaX,
        screenOriginY: state.screenOriginY - params.deltaY,
      },
    };
  },
});

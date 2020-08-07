import { Action, AppState } from "../types";

export const actionPanning: Action = {
  name: "panning",

  start: (
    appState: AppState,
    { deltaX, deltaY }: { deltaX: number; deltaY: number }
  ) => {
    return {
      screenOriginX: appState.screenOriginX - deltaX,
      screenOriginY: appState.screenOriginY - deltaY,
    };
  },
};

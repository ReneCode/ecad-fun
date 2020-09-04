import { Action, AppState, ActionResult } from "../types";

export const actionDelete: Action = {
  name: "delete",

  execute: ({ state, params }) => {
    if (!state.selectedElementIds.length) {
      return;
    }

    return {
      state: {
        elements: state.elements.filter(
          (element) => !state.selectedElementIds.includes(element.id)
        ),
      },
    };
  },
};

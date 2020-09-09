import { Action } from "../types";

export const actionDelete: Action = {
  name: "delete",

  execute: ({ state, elements }) => {
    if (!state.selectedElementIds.length) {
      return;
    }

    return {
      elements: elements.filter(
        (element) => !state.selectedElementIds.includes(element.id)
      ),
    };
  },
};

import { getElements } from "../elements";
import { Action } from "../types";
import { getCurrentPageElements } from "../data/getCurrentPageElements";
import { KEYS } from "./keys";

export const actionDelete: Action = {
  name: "delete",
  keyTest: (event) => [KEYS.DELETE, KEYS.BACKSPACE].includes(event.key),
  execute: ({ state, project }) => {
    if (!state.selectedElementIds.length) {
      return;
    }

    const ids = getCurrentPageElements(project, state)
      .filter((element) => state.selectedElementIds.includes(element.id))
      .map((e) => e.id);
    return {
      deleteObjects: ids,
    };
  },
};

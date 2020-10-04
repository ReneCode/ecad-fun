import { getElements } from "../elements";
import { Action } from "../types";

export const actionDelete: Action = {
  name: "delete",

  execute: ({ state, project }) => {
    if (!state.selectedElementIds.length) {
      return;
    }

    const ids = getElements(project)
      .filter((element) => state.selectedElementIds.includes(element.id))
      .map((e) => e.id);
    return {
      deleteObjects: ids,
    };
  },
};

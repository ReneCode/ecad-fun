import { getCurrentPageElements } from "../data/getCurrentPageElements";
import { CUD_Delete } from "../types";
import { KEYS } from "./keys";
import { registerAction } from "./registerAction";

export const actionDelete = registerAction({
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
      doCUD: [CUD_Delete(ids)],
    };
  },
});

import { Action } from "../types";
import { hitTestElement } from "../elements";

export const actionHover: Action = {
  name: "hover",

  pointerMove: ({ state }) => {
    const x = state.pointerX;
    const y = state.pointerY;
    let cursor = "default";

    const selectedElements = state.elements.filter((e) =>
      state.selectedElementIds.includes(e.id)
    );
    for (let element of selectedElements) {
      const result = hitTestElement(element, { x, y }, state);
      if (result) {
        if (result.type === "handle") {
          cursor = "ew-resize";
        } else {
          cursor = "move";
        }
        break;
      }
    }
    return { state: { cursor } };
  },
};

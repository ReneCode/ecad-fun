import { Action, AppState } from "../types";
import { hitTestElement } from "../elements";

export const actionSelect: Action = {
  name: "select",

  pointerDown: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;

    // TOTO get from screensize => worldCoord
    const eplilon = 2;

    for (let element of state.elements) {
      if (element.type === "line") {
        if (hitTestElement(element, x, y, eplilon)) {
          console.log("found");
          return {
            selectedElementIds: [element.id],
          };
        }
      }
    }

    return {
      selectedElementIds: [],
    };
  },
};

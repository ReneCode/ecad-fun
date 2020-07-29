import { Action } from "./manager";
import { AppState } from "../state/appState";
import { ECadLineElement } from "../types";
import { nanoid } from "nanoid";

export const actionLine: Action = {
  name: "line",

  pointerDown: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadLineElement = {
      id: nanoid(),
      type: "line",
      x,
      y,
      x2: x,
      y2: y,
      color: "green",
    };
    return {
      editingElement: element,
    };
  },

  pointerMove: (state: AppState) => {
    if (state.editingElement) {
      const x = state.pointerX;
      const y = state.pointerY;

      const element: ECadLineElement = {
        ...state.editingElement,
        x2: x,
        y2: y,
      };
      return {
        editingElement: element,
      };
    }
  },

  pointerUp: (state: AppState) => {
    if (state.editingElement) {
      return {
        elements: [...state.elements, state.editingElement],
        editingElement: null,
      };
    }
  },
};

import { Action } from "./manager";
import { AppState } from "../state/appState";
import { ECadLineElement } from "../element";
import { nanoid } from "nanoid";

export const actionLine: Action = {
  name: "line",
  pointerDown: (state: AppState) => {
    console.log(">>down");

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
    state.editingElement = element;
  },

  pointerMove: (state: AppState) => {
    console.log(">>move");

    if (state.editingElement) {
      const x = state.pointerX;
      const y = state.pointerY;

      const element = {
        ...state.editingElement,
        x2: x,
        y2: y,
      };
      state.editingElement = element;
    }
  },

  pointerUp: (state: AppState) => {
    console.log(">>up");

    if (state.editingElement) {
      state.elements = [...state.elements, state.editingElement];
      state.editingElement = null;
    }
  },
};

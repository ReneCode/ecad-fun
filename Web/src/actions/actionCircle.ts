import { Action } from "./manager";
import { AppState } from "../state/appState";
import { ECadCircleElement } from "../element";
import { nanoid } from "nanoid";
import { distanceBetweenPoints } from "../utils/geometric";

export const actionCircle: Action = {
  name: "circle",

  pointerDown: (state: AppState) => {
    const x = state.pointerX;
    const y = state.pointerY;
    const element: ECadCircleElement = {
      id: nanoid(),
      type: "circle",
      x,
      y,
      radius: 0,
      color: "black",
    };
    return {
      editingElement: element,
    };
  },

  pointerMove: (state: AppState) => {
    if (state.editingElement) {
      const x = state.pointerX;
      const y = state.pointerY;
      const radius = distanceBetweenPoints(
        state.editingElement.x,
        state.editingElement.y,
        x,
        y
      );
      const element = {
        ...state.editingElement,
        radius,
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

import { ECadBaseElement } from "../types";

export type AppState = {
  cursor: string;

  // screen-coords of mouse/touch event
  clientX: number;
  clientY: number;

  // project-coords of mouse/touch event
  pointerX: number;
  pointerY: number;

  // project-coords view
  viewX: number;
  viewY: number;
  viewWidth: number;
  viewHeight: number;

  // screen-coords view
  screenWidth: number;
  screenHeight: number;

  editingElement: ECadBaseElement | null;
  elements: readonly ECadBaseElement[];
};

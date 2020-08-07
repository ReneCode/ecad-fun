import { ECadBaseElement } from "../types";

export type AppState = {
  cursor: string;

  // screen-coords of mouse/touch event
  clientX: number;
  clientY: number;

  // world-coords of mouse/touch event
  pointerX: number;
  pointerY: number;

  // project-coords view
  zoom: number;

  // screen-coords view
  screenWidth: number;
  screenHeight: number;
  // there is the word 0,0 point
  screenOriginX: number;
  screenOriginY: number;

  editingElement: ECadBaseElement | null;
  elements: readonly ECadBaseElement[];
};

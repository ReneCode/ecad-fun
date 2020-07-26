import { ECadBaseElement } from "../element";

export type AppState = {
  clientX: number;
  clientY: number;
  pointerX: number;
  pointerY: number;
  width: number;
  height: number;
  editingElement: ECadBaseElement | null;
  elements: readonly ECadBaseElement[];
};

import { AppState } from "../state/appState";
import { actionLine } from "./actionLine";

export type EventType = "pointerMove" | "pointerUp" | "pointerDown";

type PointerFn = (appState: AppState) => void;

export type Action = {
  name: string;
  pointerDown?: PointerFn;
  pointerUp?: PointerFn;
  pointerMove?: PointerFn;
};

export class ActionManager {
  actions: Action[] = [];

  register(action: Action) {
    this.actions.push(action);
  }
  registerAll() {
    this.register(actionLine);
  }

  execute(type: EventType, state: AppState) {
    for (let action of this.actions) {
      const fn = action[type];
      if (fn) {
        fn(state);
      }
    }
  }
}

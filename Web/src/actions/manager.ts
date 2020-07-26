import { AppState } from "../state/appState";
import { actionLine } from "./actionLine";
import { actionCircle } from "./actionCircle";

export type EventType = "start" | "pointerMove" | "pointerUp" | "pointerDown";

type PointerFn = (appState: AppState) => void;

export type Action = {
  name: string;
  start?: () => void;
  pointerDown?: PointerFn;
  pointerUp?: PointerFn;
  pointerMove?: PointerFn;
};

export class ActionManager {
  allActions: Action[] = [];
  basicActions: Action[] = [];
  currentActionName: string = "";

  register(action: Action) {
    this.allActions.push(action);
  }
  registerAll() {
    this.register(actionLine);
    this.register(actionCircle);
  }

  public execute(type: EventType, state: AppState) {
    for (let action of this.basicActions) {
      this.executeActionMethode(action, type, state);
    }

    const currentAction = this.allActions.find(
      (action) => action.name === this.currentActionName
    );
    if (currentAction) {
      this.executeActionMethode(currentAction, type, state);
    } else {
      console.error("can't find action:", this.currentActionName);
    }
  }

  public startAction(actionName: string, state: AppState) {
    this.currentActionName = actionName;
    this.execute("start", state);
  }

  private executeActionMethode(
    action: Action,
    type: EventType,
    state: AppState
  ) {
    const fn = action[type];
    if (fn) {
      fn(state);
    }
  }
}

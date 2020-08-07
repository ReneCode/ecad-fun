import { actionLine } from "./actionLine";
import { actionCircle } from "./actionCircle";
import { actionRectangle } from "./actionRectangle";
import { actionHover } from "./actionHover";
import { actionSelect } from "./actionSelect";
import { actionLoadElements } from "./actionLoadElements";
import { actionZoomIn, actionZoomOut } from "./actionZoom";
import { Action, AppState } from "../types";

export type EventType = "start" | "pointerMove" | "pointerUp" | "pointerDown";

type setStateFn = (data: any) => void;

export class ActionManager {
  allActions: Action[] = [];
  basicActions: Action[] = [];
  currentActionName: string = "";
  setState: setStateFn;

  constructor({ setState }: { setState: setStateFn }) {
    this.setState = setState;
  }

  register(action: Action) {
    this.allActions.push(action);
  }
  registerAll() {
    this.basicActions.push(actionHover);

    this.register(actionSelect);
    this.register(actionLine);
    this.register(actionCircle);
    this.register(actionRectangle);

    this.register(actionLoadElements);
    this.register(actionZoomIn);
    this.register(actionZoomOut);
  }

  public execute(type: EventType, state: AppState) {
    for (let action of this.basicActions) {
      this.executeActionMethode(action, type, state);
    }

    if (this.currentActionName) {
      const currentAction = this.allActions.find(
        (action) => action.name === this.currentActionName
      );
      if (currentAction) {
        this.executeActionMethode(currentAction, type, state);
      } else {
        throw new Error(`can't find action: ${this.currentActionName}`);
      }
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
      const newState = fn(state);
      if (newState) {
        this.setState(newState);
      }
    }
  }
}

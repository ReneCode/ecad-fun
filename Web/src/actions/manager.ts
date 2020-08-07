import { actionLine } from "./actionLine";
import { actionCircle } from "./actionCircle";
import { actionRectangle } from "./actionRectangle";
import { actionHover } from "./actionHover";
import { actionSelect } from "./actionSelect";
import { actionLoadElements } from "./actionLoadElements";
import { actionZoomIn, actionZoomOut, actionZoomPinch } from "./actionZoom";
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
    this.register(actionZoomPinch);
  }

  public execute(type: EventType, state: AppState, params: any = null) {
    for (let action of this.basicActions) {
      this.executeActionMethode(action, type, state, params);
    }

    if (this.currentActionName) {
      const currentAction = this.allActions.find(
        (action) => action.name === this.currentActionName
      );
      if (currentAction) {
        this.executeActionMethode(currentAction, type, state, params);
      } else {
        throw new Error(`can't find action: ${this.currentActionName}`);
      }
    }
  }

  public startAction(actionName: string, state: AppState, params: any = null) {
    this.currentActionName = actionName;
    this.execute("start", state, params);
  }

  private executeActionMethode(
    action: Action,
    type: EventType,
    state: AppState,
    params: any
  ) {
    const fn = action[type];
    if (fn) {
      const newState = fn(state, params);
      if (newState) {
        this.setState(newState);
      }
    }
  }
}

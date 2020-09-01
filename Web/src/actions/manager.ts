import { Action, AppState, ActionState, defaultActionState } from "../types";
import { actionLine } from "./actionLine";
import { actionCircle } from "./actionCircle";
import { actionRectangle } from "./actionRectangle";
import { actionSelect } from "./actionSelect";
import { actionLoadElements } from "./actionLoadElements";
import { actionZoomIn, actionZoomOut, actionZoomPinch } from "./actionZoom";
import { actionPanning } from "./actionPanning";

export type EventType =
  | "execute"
  | "start"
  | "stop"
  | "pointerMove"
  | "pointerUp"
  | "pointerDown";

type setStateFn = (data: any) => void;

export class ActionManager {
  allActions: Action[] = [];
  basicActions: Action[] = [];
  setState: setStateFn;
  runningActionNames: string[] = [];
  actionState: ActionState = defaultActionState;

  constructor({ setState }: { setState: setStateFn }) {
    this.setState = setState;
  }

  register(action: Action) {
    this.allActions.push(action);
  }
  registerAll() {
    // this.basicActions.push(actionHover);

    this.register(actionSelect);

    this.register(actionLine);
    this.register(actionCircle);
    this.register(actionRectangle);

    this.register(actionLoadElements);
    this.register(actionZoomIn);
    this.register(actionZoomOut);
    this.register(actionZoomPinch);
    this.register(actionPanning);
  }

  public dispatch(
    type: EventType,
    { state, params }: { state: AppState; params?: any }
  ) {
    // for (let action of this.basicActions) {
    //   this.executeActionMethode(action, type, { state, actionState: this.actionState, params });
    // }

    this.runningActionNames.forEach((name) => {
      const action = this.getAction(name);
      if (action) {
        this.executeActionMethode(action, type, {
          state,
          actionState: this.actionState,
          params,
        });
      }
    });
  }

  public execute(
    actionName: string,
    { state, params }: { state: AppState; params: any }
  ) {
    const action = this.getAction(actionName);
    if (action) {
      this.executeActionMethode(action, "execute", {
        state,
        actionState: defaultActionState,
        params,
      });
    }
  }

  public start(actionName: string, { state }: { state: AppState }) {
    const action = this.getAction(actionName);
    if (!action) {
      throw new Error(`Action: ${actionName} not found`);
    }

    this.dispatch("stop", { state });
    this.runningActionNames = [];
    this.runningActionNames.push(actionName);

    this.executeActionMethode(action, "start", {
      state,
      actionState: defaultActionState,
    });
  }

  private getAction(actionName: string) {
    return this.allActions.find((action) => action.name === actionName);
  }

  private executeActionMethode(
    action: Action,
    type: EventType,
    {
      state,
      actionState,
      params,
    }: { state: AppState; actionState: ActionState; params?: any }
  ) {
    const fn = action[type];
    if (fn) {
      const result = fn({ state, actionState, params });
      if (result) {
        if (result.state) {
          this.setState(result.state);
        }
        if (result.actionState) {
          this.setActionState(result.actionState);
        }
        if (result.stopAction) {
          this.runningActionNames = this.runningActionNames.filter(
            (name) => name !== action.name
          );
          if (this.runningActionNames.length === 0) {
            this.start("select", { state });
          }
        }
      }
    }
  }

  private setActionState(data: any) {
    for (const key of Object.keys(data)) {
      (this.actionState as any)[key] = (data as any)[key];
    }
  }
}

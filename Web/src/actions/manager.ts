import { Action, AppState, ActionResult, PointerState } from "../types";
import { actionLine } from "./actionLine";
import { actionCircle } from "./actionCircle";
import { actionRectangle } from "./actionRectangle";
import { actionHover } from "./actionHover";
import { actionSelect } from "./actionSelect";
import { actionLoadElements } from "./actionLoadElements";
import { actionZoomIn, actionZoomOut, actionZoomPinch } from "./actionZoom";
import { actionPanning } from "./actionPanning";

export type EventType = "execute" | "pointerMove" | "pointerUp" | "pointerDown";

type setStateFn = (data: any) => void;
type setPointerStateFn = (data: any) => void;

export class ActionManager {
  allActions: Action[] = [];
  basicActions: Action[] = [];
  setState: setStateFn;
  setPointerState: setPointerStateFn;
  runningActionNames: string[] = [];

  constructor({
    setState,
    setPointerState,
  }: {
    setState: setStateFn;
    setPointerState: setPointerStateFn;
  }) {
    this.setState = setState;
    this.setPointerState = setPointerState;
  }

  register(action: Action) {
    this.allActions.push(action);
  }
  registerAll() {
    this.basicActions.push(actionHover);
    this.basicActions.push(actionSelect);

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
    {
      state,
      pointerState,
      params,
    }: { state: AppState; pointerState: PointerState; params?: any }
  ) {
    for (let action of this.basicActions) {
      this.executeActionMethode(action, type, { state, pointerState, params });
    }

    this.runningActionNames.forEach((name) => {
      const action = this.getAction(name);
      if (action) {
        this.executeActionMethode(action, type, {
          state,
          pointerState,
          params,
        });
      }
    });
  }

  public execute(actionName: string, state: AppState, params: any = null) {
    const action = this.getAction(actionName);
    if (action) {
      this.executeActionMethode(action, "execute", {
        state,
        params,
      });
    }
  }

  public start(actionName: string, { state }: { state: AppState }) {
    const action = this.getAction(actionName);
    if (!action) {
      throw new Error(`Action: ${actionName} not found`);
    }
    this.runningActionNames.push(actionName);

    // may be later a "start" methode would be usefull
    // this.executeActionMethode(action, "start", {
    //   state,
    // });
  }

  private getAction(actionName: string) {
    return this.allActions.find((action) => action.name === actionName);
  }

  private executeActionMethode(
    action: Action,
    type: EventType,
    {
      state,
      pointerState,
      params,
    }: { state: AppState; pointerState?: PointerState; params?: any }
  ) {
    const fn = action[type];
    if (fn) {
      const result = fn({ state, pointerState, params });
      if (result) {
        if (result.state) {
          this.setState(result.state);
        }
        if (result.pointerState) {
          this.setPointerState(result.pointerState);
        }
        if (result.stopAction) {
          this.runningActionNames = this.runningActionNames.filter(
            (name) => name !== action.name
          );
        }
      }
    }
  }
}

import {
  Action,
  AppState,
  ActionState,
  defaultActionState,
  ECadBaseElement,
} from "../types";
import { actionLine } from "./actionLine";
import { actionCircle } from "./actionCircle";
import { actionRectangle } from "./actionRectangle";
import { actionSelect } from "./actionSelect";
import { actionDelete } from "./actionDelete";
import { actionLoadElements } from "./actionLoadElements";
import { actionZoomIn, actionZoomOut, actionZoomPinch } from "./actionZoom";
import { actionPanning } from "./actionPanning";
import { actionCreateSymbol } from "./actionCreateSymbol";
import { actionPlaceSymbol } from "./actionPlaceSymbol";
import { actionExportDocument } from "./actionExportDocument";
import { actionImportDocument } from "./actionImportDocument";

export type EventType =
  | "execute"
  | "start"
  | "stop"
  | "pointerMove"
  | "pointerUp"
  | "pointerDown";

type setStateFn = (data: any) => void;
type getStateFn = () => AppState;
type getElementsFn = () => readonly ECadBaseElement[];
type setElementsFn = (elements: readonly ECadBaseElement[]) => void;

export class ActionManager {
  allActions: Action[] = [];
  basicActions: Action[] = [];
  runningActionName: string = "";
  actionState: ActionState = defaultActionState;
  getState: getStateFn;
  setState: setStateFn;
  getElements: getElementsFn;
  setElements: setElementsFn;

  constructor(
    getState: getStateFn,
    setState: setStateFn,
    getElements: getElementsFn,
    setElements: setElementsFn
  ) {
    this.getState = getState;
    this.setState = setState;
    this.getElements = getElements;
    this.setElements = setElements;
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
    this.register(actionCreateSymbol);
    this.register(actionPlaceSymbol);

    this.register(actionLoadElements);
    this.register(actionZoomIn);
    this.register(actionZoomOut);
    this.register(actionZoomPinch);
    this.register(actionPanning);
    this.register(actionDelete);

    this.register(actionExportDocument);
    this.register(actionImportDocument);

    // default action
    this.runningActionName = "select";
  }

  public dispatch(type: EventType, { params }: { params?: any }) {
    const action = this.getAction(this.runningActionName);
    if (action) {
      this.applyActionMethode(action, type, {
        actionState: this.actionState,
        params,
      });
    }
  }

  public execute(actionName: string, { params }: { params: any }) {
    const action = this.getAction(actionName);
    if (!action) {
      console.error(`action ${actionName} not found`);
      return;
    }

    if (action.execute) {
      // if execute methode exists, than it is a execute-once-action
      this.applyActionMethode(action, "execute", {
        actionState: defaultActionState,
        params,
      });
    } else {
      // otherwise this is a long running action

      // stop the current long-running action
      this.dispatch("stop", {});
      this.actionState = defaultActionState;

      // and make actionName to the new long-running actino
      // and start it
      this.runningActionName = actionName;
      this.dispatch("start", { params });
    }
  }

  // public getRenderComponent() {
  //   const action = this.getAction(this.runningActionName);
  //   if (action) {
  //     return action.render;
  //   }
  // }

  private getAction(actionName: string) {
    return this.allActions.find((action) => action.name === actionName);
  }

  private applyActionMethode(
    action: Action,
    type: EventType,
    { actionState, params }: { actionState: ActionState; params?: any }
  ) {
    const fn = action[type];
    if (fn) {
      const result = fn({
        state: this.getState(),
        elements: this.getElements(),
        actionState,
        params,
      });
      if (result) {
        if (result.state) {
          this.setState(result.state);
        }
        if (result.elements) {
          this.setElements(result.elements);
        }
        if (result.actionState) {
          this.setActionState(result.actionState);
        }
        if (result.stopAction) {
          this.execute("select", { params });
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

import {
  Action,
  AppState,
  ActionState,
  defaultActionState,
  ECadBaseElement,
  ActionResult,
} from "../types";
import { Project } from "../share";
import { Socket } from "../data/Socket";
import { actions } from "./registerAction";

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

type AddinFn = (data: any) => void;

export class ActionManager {
  allActions: Action[] = [];
  runningActionName: string = "";
  actionState: ActionState = defaultActionState;
  getState: getStateFn;
  setState: setStateFn;
  getElements: getElementsFn;
  setElements: setElementsFn;
  project: Project;
  socket: Socket;

  addins: Record<string, AddinFn> = {};

  constructor(
    getState: getStateFn,
    setState: setStateFn,
    getElements: getElementsFn,
    setElements: setElementsFn,
    project: Project,
    socket: Socket
  ) {
    this.getState = getState;
    this.setState = setState;
    this.getElements = getElements;
    this.setElements = setElements;
    this.project = project;
    this.socket = socket;

    actions.forEach((action) => {
      this.register(action);
    });

    // default action
    this.runningActionName = "select";
  }

  register(action: Action) {
    this.allActions.push(action);
  }

  public registerAddin(name: string, fn: AddinFn) {
    this.addins[name] = fn;
  }

  public getCurrentAction() {
    return this.runningActionName;
  }

  public async dispatch(type: EventType, params: any) {
    const action = this.getAction(this.runningActionName);
    if (action) {
      await this.applyActionMethode(action, type, {
        actionState: this.actionState,
        params,
      });
    }
  }

  public async execute(actionName: string, params: any) {
    const action = this.getAction(actionName);
    if (!action) {
      console.error(`action ${actionName} not found`);
      return;
    }

    if (action.execute) {
      // if execute methode exists, than it is a execute-once-action
      await this.applyActionMethode(action, "execute", {
        actionState: defaultActionState,
        params,
      });
    } else {
      // otherwise this is a long running action

      // stop the current long-running action
      this.dispatch("stop", null);
      this.actionState = defaultActionState;

      // and make actionName to the new long-running actino
      // and start it
      this.runningActionName = actionName;
      this.dispatch("start", params);
    }
  }

  public keyDown(event: KeyboardEvent) {
    const action = this.allActions.find(
      (action) => action.keyTest && action.keyTest(event)
    );
    if (action) {
      this.execute(action.name, []);
    }
  }

  // ----------------------------------------------------

  private getAction(actionName: string) {
    return this.allActions.find((action) => action.name === actionName);
  }

  private async applyActionMethode(
    action: Action,
    type: EventType,
    { actionState, params }: { actionState: ActionState; params?: any }
  ) {
    const fn = action[type];
    if (fn) {
      const resultOrPromise = fn({
        state: this.getState(),
        elements: this.getElements(),
        actionState,
        params,
        project: this.project,
      });
      let result: (ActionResult & Record<string, any>) | void;
      if (resultOrPromise instanceof Promise) {
        result = await resultOrPromise;
      } else {
        result = resultOrPromise;
      }
      if (result) {
        // addins
        for (let name in this.addins) {
          if (name in result) {
            this.addins[name](result[name]);
          }
        }

        if (result.doCUD) {
          const withUndo =
            result.withUndo !== undefined ? result.withUndo : true;
          this.project.doCUD(result.doCUD, { withUndo });
          this.socket.emit("do-cud", result.doCUD);
          this.setState({});
        }

        if (result.state) {
          this.setState(result.state);
        }
        if (result.elements) {
          this.setElements(result.elements);
          // re-render
          this.setState({});
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

import { Project } from "../core/Project";
import { Action } from "../types";
import { registeredActions } from "./registerAction";

type Props = {
  project: Project;
};
class ActionManager {
  allActions: Record<string, Action> = {};
  project: Project;

  constructor({ project }: Props) {
    this.project = project;
    registeredActions.forEach((action) => {
      this.register(action);
    });
  }

  private register(action: Action) {
    if (this.allActions[action.name]) {
      throw new Error(`Action ${action.name} allready registered`);
    }
    this.allActions[action.name] = action;
  }

  execute(actionName: string, ...args: any) {
    const action = this.getAction(actionName);
    if (action.execute) {
      action.execute(this.project, ...args);
    }
  }

  private getAction(actionName: string) {
    const action = this.allActions[actionName];
    if (!action) {
      throw new Error(`Action ${actionName} not found`);
    }
    return action;
  }
}

export { ActionManager };

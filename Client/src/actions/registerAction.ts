import { Action } from "../types";

export let registeredActions: readonly Action[] = [];

export const registerAction = (action: Action) => {
  registeredActions = registeredActions.concat(action);
  return action;
};

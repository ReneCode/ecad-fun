import { Action } from "../types";

export let actions: readonly Action[] = [];

export const registerAction = (action: Action) => {
  actions = actions.concat(action);
  return action;
};

import { Action } from "../types";

export const actionNavigateHome: Action = {
  name: "navigateHome",

  execute: () => {
    window.location.href = "/";
  },
};

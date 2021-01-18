import { Project } from "../share";
import { KEYS } from "./keys";
import { registerAction } from "./registerAction";

export const actionUndo = registerAction({
  name: "undo",
  keyTest: (event) =>
    KEYS.ctrlOrCmdKey(event) && !event.shiftKey && event.key === KEYS.Z,

  execute: ({ project }) => {
    console.log("undo");
    project.undo();
    return {
      state: {},
    };
  },
});

export const actionRedo = registerAction({
  name: "redo",
  keyTest: (event) =>
    KEYS.ctrlOrCmdKey(event) &&
    event.shiftKey &&
    event.key.toLowerCase() === KEYS.Z,

  execute: ({ project }) => {
    console.log("redo");
    project.redo();
    return {
      state: {},
    };
  },
});

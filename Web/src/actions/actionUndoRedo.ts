import { KEYS } from "./keys";
import { registerAction } from "./registerAction";

export const actionUndo = registerAction({
  name: "undo",
  keyTest: (event) =>
    KEYS.ctrlOrCmdKey(event) && !event.shiftKey && event.key === KEYS.Z,

  execute: ({ project }) => {
    const result = project.undo();
    return {
      withUndo: false,
      doCUD: result,
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
    const result = project.redo();
    return {
      withUndo: false,
      doCUD: result,
      state: {},
    };
  },
});

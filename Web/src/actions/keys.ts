export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

export const KEYS = {
  BACKSPACE: "Backspace",
  ALT: "Alt",
  CTRL_OR_CMD: isDarwin ? "metaKey" : "ctrlKey",
  DELETE: "Delete",
  ENTER: "Enter",
  ESCAPE: "Escape",
  A: "a",
  D: "d",
  E: "e",
  L: "l",
  O: "o",
  P: "p",
  Q: "q",
  R: "r",
  S: "s",
  T: "t",
  V: "v",
  X: "x",
  Z: "z",

  ctrlOrCmdKey: (event: KeyboardEvent) => {
    if (isDarwin) {
      return event.metaKey;
    } else {
      return event.ctrlKey;
    }
  },
};

export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

export const KEYS = {
  BACKSPACE: "Backspace",
  ALT: "Alt",
  CTRL_OR_CMD: isDarwin ? "metaKey" : "ctrlKey",
  DELETE: "Delete",
  ENTER: "Enter",
  ESCAPE: "Escape",
};

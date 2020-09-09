import { Action, AppState } from "../types";

export const actionImportDocument: Action = {
  name: "importDocument",

  execute: ({
    state,
    params,
  }: {
    state: AppState;
    params: React.DragEvent<HTMLCanvasElement>;
  }) => {
    const file = params.dataTransfer?.files[0];
    console.log(file);
  },
};

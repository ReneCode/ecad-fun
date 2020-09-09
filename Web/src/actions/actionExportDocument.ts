import { Action } from "../types";
import { exportToJsonFile } from "../data/json";

export const actionExportDocument: Action = {
  name: "exportDocument",

  execute: ({ state, params }) => {
    exportToJsonFile(state);
  },
};

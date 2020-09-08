import { Action } from "../types";
import { exportToJsonFile } from "../data/export";

export const actionExportDocument: Action = {
  name: "exportDocument",

  execute: ({ state, params }) => {
    exportToJsonFile(state);
  },
};

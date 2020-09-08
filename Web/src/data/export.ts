import { fileSave } from "browser-nativefs";

import { AppState } from "../types";
import { cleanupAppStateForExport } from "../state";

const serializeData = (appState: AppState) => {
  return JSON.stringify({
    type: "ecad.fun",
    version: "1",
    appState: appState,
  });
};

export const exportToJsonFile = async (appState: AppState) => {
  const serialized = serializeData(cleanupAppStateForExport(appState));

  const blob = new Blob([serialized], { type: "application/json" });
  const name = "ecad.json";
  await fileSave(blob, {
    fileName: name,
    description: "ecad file",
    extensions: ["ecad"],
  });
};

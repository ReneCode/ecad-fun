import { fileSave } from "browser-nativefs";

import { AppState } from "../types";

const serializeData = (appState: AppState) => {
  return JSON.stringify({
    type: "ecad.fun",
    version: "1",
    appState: appState,
  });
};

export const exportToJsonFile = async (appState: AppState) => {
  const serialized = serializeData(appState);

  const blob = new Blob([serialized], { type: "application/json" });
  const name = "ecad.json";
  await fileSave(blob, {
    fileName: name,
    description: "ecad file",
    extensions: ["ecad"],
  });
};

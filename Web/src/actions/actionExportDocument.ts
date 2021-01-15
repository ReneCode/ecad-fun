import { AppState, ECadBaseElement } from "../types";
import { fileSave } from "browser-nativefs";
import { removeSymbolFromSymbolRef } from "../state";
import { registerAction } from "./registerAction";

export const actionExportDocument = registerAction({
  name: "exportDocument",

  execute: ({ state, elements, params }) => {
    exportToJsonFile(state, elements);
  },
});

const serializeData = (
  appState: AppState,
  elements: readonly ECadBaseElement[]
) => {
  return JSON.stringify({
    type: "ecad",
    version: "1",
    appState: appState,
    elements: removeSymbolFromSymbolRef(elements),
  });
};

const exportToJsonFile = async (
  appState: AppState,
  elements: readonly ECadBaseElement[]
) => {
  const serialized = serializeData(appState, elements);

  const blob = new Blob([serialized], { type: "application/json" });
  const name = "ecad.json";
  await fileSave(blob, {
    fileName: name,
    description: "ecad file",
    extensions: ["ecad"],
  });
};

import { Action } from "../types";

import { addSymbolToSymbolRef } from "../state";

export const actionImportDocument: Action = {
  name: "importDocument",

  execute: async ({
    params,
  }: {
    params: React.DragEvent<HTMLCanvasElement>;
  }) => {
    const file = params.dataTransfer?.files[0];
    if (file.type === "application/json") {
      const { elements } = await importFromJsonFile(file);
      if (elements) {
        return { elements: addSymbolToSymbolRef(elements) };
      }
    }
  },
};

const importFromJsonFile = async (blob: any) => {
  try {
    const content = (await readFileAsString(blob)) as string;
    const result = JSON.parse(content);
    return result;
  } catch {
    return null;
  }
};

const readFileAsString = (blob: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        resolve(reader.result as string);
      } else {
        reject();
      }
    };
    reader.readAsText(blob, "utf8");
  });
};

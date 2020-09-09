import { Action, ECadBaseElement } from "../types";

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
      const content = await importFromJsonFile(file);
      if (content.type === "ecad-symbollib") {
        return {
          symbollib: {
            name: content.name,
            elements: content.elements.filter(
              (e: ECadBaseElement) => e.type === "symbol"
            ),
          },
          state: {},
        };
      }
      if (content.elements) {
        return {
          elements: addSymbolToSymbolRef(content.elements),
        };
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

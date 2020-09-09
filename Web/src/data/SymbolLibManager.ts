import { Project } from "./Project";
import { ECadBaseElement } from "../types";

class SymbolLibMananger {
  symbolLibraries: Record<string, Project> = {};

  constructor(symbolLibraries: Record<string, Project>) {
    this.symbolLibraries = symbolLibraries;
    this.applyResult = this.applyResult.bind(this);
  }

  applyResult(data: { elements: readonly ECadBaseElement[]; name: string }) {
    if (data.name !== "main") {
      const project = new Project(data.name);
      project.setElements(data.elements);
      this.symbolLibraries[data.name] = project;
    }
  }
}

export default SymbolLibMananger;

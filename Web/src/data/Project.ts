import { ECadBaseElement, ECadSymbolElement } from "../types";

export class Project {
  id: number = -1;
  elements: ECadBaseElement[] = [];
  symbolLibraries: Project[] = [];

  constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }

  public getElements(): readonly ECadBaseElement[] {
    return this.elements;
  }

  public setElements(elements: readonly ECadBaseElement[]) {
    this.elements = elements as ECadSymbolElement[];
  }

  public getElement(id: string) {
    return this.elements.find((symbol) => symbol.id === id);
  }

  public addElement(element: ECadBaseElement) {
    if (this.getElement(element.id)) {
      throw new Error(
        `element with id:${element.id} allready in project: ${this.name}`
      );
    }
    this.elements.push(element);
  }
}

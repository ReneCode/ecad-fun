import * as Dispatcher from "./common/Dispatcher";

export type BaseElement = {
  id: string;
  x: number;
  y: number;
  strokeColor: string;
  fillStyle: string;
};

class CanvasState {
  private elements: BaseElement[] = [];
  private dispatcher = new Dispatcher.Dispatcher<"canvasState">();

  public subscribe(handler: Dispatcher.EventHandler) {
    this.dispatcher.subscribe("canvasState", handler);
  }

  public getElements = () => {
    return this.elements;
  };

  public addElement = (element: BaseElement) => {
    this.elements = [...this.elements, element];
    this.dispatcher.dispatch("canvasState", this.elements);
  };
}

export const canvasState = new CanvasState();

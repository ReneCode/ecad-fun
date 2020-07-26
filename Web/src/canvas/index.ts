import * as Dispatcher from "./common/Dispatcher";
import { ECadBaseElement } from "../element";

// export type BaseElement = {
//   id: string;
//   x: number;
//   y: number;
//   strokeColor: string;
//   fillStyle: string;
// };

class CanvasState {
  private elements: ECadBaseElement[] = [];
  private dispatcher = new Dispatcher.Dispatcher<"canvasState">();

  public subscribe(handler: Dispatcher.EventHandler) {
    return this.dispatcher.subscribe("canvasState", handler);
  }

  public getElements = () => {
    return this.elements;
  };

  public addElement = (element: ECadBaseElement) => {
    this.elements = [...this.elements, element];
    this.dispatcher.dispatch("canvasState", this.elements);
  };
}

export const canvasState = new CanvasState();

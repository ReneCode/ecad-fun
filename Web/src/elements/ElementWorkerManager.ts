import {
  ElementWorker,
  ECadBaseElement,
  ElementRenderFn,
  Point,
  ElementChangeArgs,
} from "../types";

import { workerDefault } from "./workerDefault";
import { workerLine } from "./workerLine";
import { workerCircle } from "./workerCircle";
import { workerRectangle } from "./workerRectangle";
import { workerSymbol } from "./workerSymbol";
import { workerSymbolRef } from "./workerSymbolRef";

class ElementWorkerManager {
  private worker: Record<string, ElementWorker> = {};

  constructor() {
    this.register(workerLine);
    this.register(workerCircle);
    this.register(workerRectangle);
    this.register(workerSymbol);
    this.register(workerSymbolRef);
  }

  public register(elementWorker: ElementWorker) {
    if (this.worker[elementWorker.type]) {
      throw new Error(
        `ElementWorker for ${elementWorker.type} allready registerd`
      );
    }
    this.worker[elementWorker.type] = elementWorker;
  }

  public render: ElementRenderFn = (element, context, params) => {
    this.getWorker(element.type).render(element, context, params);
  };

  hitTest(element: ECadBaseElement, pt: Point, epsilon: number) {
    return this.getWorker(element.type).hitTest(element, pt, epsilon);
  }

  getBoundingBox(element: ECadBaseElement) {
    return this.getWorker(element.type).getBoundingBox(element);
  }

  getHandles(element: ECadBaseElement) {
    return this.getWorker(element.type).getHandles(element);
  }

  updateMoveHandle(args: ElementChangeArgs) {
    return this.getWorker(args.element.type).updateMoveHandle?.(args);
  }

  updateMoveByDelta(element: ECadBaseElement, delta: Point) {
    return this.getWorker(element.type).updateMoveByDelta?.(element, delta);
  }

  // ----------------------------------------------------

  private getWorker(type: string) {
    const worker = this.worker[type];
    if (!worker) {
      console.error(`can not find ElementWorker for type:${type}`);
      return workerDefault;
    }
    return worker;
  }
}

const elementWorkerManager = new ElementWorkerManager();

export default elementWorkerManager;

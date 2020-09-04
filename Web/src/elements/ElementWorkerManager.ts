import { ElementWorker, ECadBaseElement, ElementRenderFn } from "../types";

import { workerLine } from "./workerLine";
import { workerCircle } from "./workerCircle";
import { workerRectangle } from "./workerRectangle";
import { workerDefault } from "./workerDefault";

class ElementWorkerManager {
  private worker: Record<string, ElementWorker> = {};

  constructor() {
    this.register(workerLine);
    this.register(workerCircle);
    this.register(workerRectangle);
  }

  public register(elementWorker: ElementWorker) {
    if (this.worker[elementWorker.type]) {
      throw new Error(
        `ElementWorker for ${elementWorker.type} allready registerd`
      );
    }
    this.worker[elementWorker.type] = elementWorker;
  }

  public render: ElementRenderFn = (
    element,
    context,
    { worldCoordToScreenCoord, worldLengthToScreenLength }
  ) => {
    this.getWorker(element.type).render(element, context, {
      worldCoordToScreenCoord,
      worldLengthToScreenLength,
    });
  };

  hitTest(element: ECadBaseElement, x: number, y: number, epsilon: number) {
    return this.getWorker(element.type).hitTest(element, x, y, epsilon);
  }

  getBoundingBox(element: ECadBaseElement) {
    return this.getWorker(element.type).getBoundingBox(element);
  }

  getHandles(element: ECadBaseElement) {
    return this.getWorker(element.type).getHandles(element);
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

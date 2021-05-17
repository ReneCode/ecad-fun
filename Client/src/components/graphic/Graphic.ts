import { Matrix } from "./Matrix";
import { LineNode, PageNode } from "../../core/Project";

export class Graphic {
  screenToWorldMatrix: Matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  worldToScreenMatrix: Matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

  public render(canvas: HTMLCanvasElement, page: PageNode) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = "#eee";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let node of page.children) {
      ctx.fillStyle = "#11e";
      ctx.strokeStyle = "#2a2";
      ctx.lineWidth = 1;
      if (node.type === "LINE") {
        const line = node as LineNode;
        const x = line.x1;
        const y = line.y1;
        const w = line.x2 - x;
        const h = line.y2 - y;
        ctx.rect(x, y, w, h);
        ctx.stroke();
      }
    }
  }
}

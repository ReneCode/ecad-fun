import { ECadLineElement, ECadCircleElement } from "../types";
import { randomId } from "../utils/randomId";
import { registerAction } from "./registerAction";

export const actionLoadElements = registerAction({
  name: "loadElements",

  execute: () => {
    const line: ECadLineElement = {
      id: randomId(),
      type: "line",
      x1: -50,
      y1: 0,
      x2: 200,
      y2: 100,
      color: "#222",
    };
    const circle: ECadCircleElement = {
      id: randomId(),
      type: "circle",
      x: 120,
      y: 50,
      radius: 100,
      color: "#e23",
    };

    const lines = [];
    for (let i = 0; i < 5_000; i++) {
      const l: ECadLineElement = {
        id: randomId(),
        type: "line",
        x1: -200 + 400 * Math.random(),
        y1: -200 + 400 * Math.random(),
        x2: -200 + 400 * Math.random(),
        y2: -200 + 400 * Math.random(),
        color: "#ed2",
      };
      lines.push(l);
    }

    return {
      elements: [...lines, line, circle],
    };
  },
});

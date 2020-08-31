import { ECadLineElement, ECadCircleElement, Action } from "../types";
import { randomId } from "../utils/randomId";

export const actionLoadElements: Action = {
  name: "loadElements",

  execute: () => {
    const line: ECadLineElement = {
      id: randomId(),
      type: "line",
      x: -50,
      y: 0,
      w: 200,
      h: 100,
      color: "#222",
    };
    const line2: ECadLineElement = {
      id: randomId(),
      type: "line",
      x: 210,
      y: 20,
      w: -140,
      h: 80,
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
        x: -200 + 400 * Math.random(),
        y: -200 + 400 * Math.random(),
        w: -100 + 200 * Math.random(),
        h: -100 + 200 * Math.random(),
        color: "#ed2",
      };
      lines.push(l);
    }

    return {
      state: {
        elements: [...lines, line, line2, circle],
      },
    };
  },
};

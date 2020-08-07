import { ECadLineElement, ECadCircleElement, Action } from "../types";
import { getRandomId } from "../utils/getRandomId";

export const actionLoadElements: Action = {
  name: "loadElements",
  start: () => {
    const line: ECadLineElement = {
      id: getRandomId(),
      type: "line",
      x: -50,
      y: 0,
      x2: 200,
      y2: 100,
      color: "#222",
    };
    const line2: ECadLineElement = {
      id: getRandomId(),
      type: "line",
      x: 10,
      y: 20,
      x2: 200,
      y2: 100,
      color: "#222",
    };
    const circle: ECadCircleElement = {
      id: getRandomId(),
      type: "circle",
      x: 120,
      y: 50,
      radius: 100,
      color: "#e23",
    };

    return {
      elements: [line, line2, circle],
    };
  },
};

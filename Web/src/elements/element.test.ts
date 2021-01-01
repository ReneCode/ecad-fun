import { ECadLineElement, ECadCircleElement } from "../types";
import { randomId } from "../utils/randomId";
import { hitTestElement } from "./index";

describe("hitTest", () => {
  it("Line", () => {
    const id = randomId();
    const element: ECadLineElement = {
      id: id,
      type: "line",
      x1: 40,
      y1: 50,
      x2: 140,
      y2: 250,
      color: "#222",
    };

    const state = {
      gripSize: 12,
    };
    const result = hitTestElement(element, { x: 40, y: 50 }, state);
    expect(result).toBeTruthy();
  });

  it("circle", () => {
    const circle: ECadCircleElement = {
      id: "a",
      type: "circle",
      x: 50,
      y: 100,
      radius: 100,
      color: "red",
    };
    const state = {
      gripSize: 10,
    };
    const r1 = hitTestElement(circle, { x: 151, y: 100 }, state);
    expect(r1).toBeTruthy();

    const r2 = hitTestElement(circle, { x: 50, y: 100 }, state);
    expect(r2).toBeFalsy();
  });
});

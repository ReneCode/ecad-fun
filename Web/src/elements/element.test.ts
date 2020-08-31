import { ECadLineElement, ECadCircleElement } from "../types";
import { randomId } from "../utils/randomId";
import { hitTestElement } from "./index";

describe("hitTest", () => {
  it("Line", () => {
    const id = randomId();
    const element: ECadLineElement = {
      id: id,
      type: "line",
      x: 40,
      y: 50,
      w: 100,
      h: 200,
      color: "#222",
    };

    const state = {
      gripSize: 12,
    };
    const result = hitTestElement(element, 40, 50, state);
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
    const r1 = hitTestElement(circle, 151, 100, state);
    expect(r1).toBeTruthy();

    const r2 = hitTestElement(circle, 50, 100, state);
    expect(r2).toBeFalsy();
  });
});

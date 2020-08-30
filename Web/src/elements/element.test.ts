import { ECadLineElement } from "../types";
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
});

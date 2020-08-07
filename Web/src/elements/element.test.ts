import { ECadLineElement } from "../types";
import { getRandomId } from "../utils/getRandomId";

describe("hitTest", () => {
  it("Line", () => {
    const element: ECadLineElement = {
      id: getRandomId(),
      type: "line",
      x: 40,
      y: 50,
      x2: 100,
      y2: 200,
      color: "#222",
    };
  });
});

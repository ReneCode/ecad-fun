import { actionCreateSymbol } from "./actionCreateSymbol";
import {
  AppState,
  getDefaultAppState,
  ActionResult,
  ECadCircleElement,
} from "../types";

describe("actionCreateSymbol", () => {
  it("create", () => {
    const c1: ECadCircleElement = {
      id: "c1",
      type: "circle",
      x: 10,
      y: 20,
      radius: 30,
    };
    const c2: ECadCircleElement = {
      id: "c2",
      type: "circle",
      x: 10,
      y: 20,
      radius: 30,
    };
    const c3: ECadCircleElement = {
      id: "c3",
      type: "circle",
      x: 10,
      y: 20,
      radius: 30,
    };
    const c4: ECadCircleElement = {
      id: "c4",
      type: "circle",
      x: 10,
      y: 20,
      radius: 30,
    };
    const state: AppState = {
      ...getDefaultAppState(),
      selectedElementIds: ["c3", "c1"],
      elements: [c1, c2, c3, c4],
    };

    const result = actionCreateSymbol.execute({
      state,
      actionState: {},
      params: {},
    }) as ActionResult;

    expect(result.state.selectedElementIds).toEqual(["id0"]);
    expect(result.state.elements).toHaveLength(3);
    const elementIds = result.state.elements.map((e) => e.id);
    expect(elementIds).toEqual(["c2", "id0", "c4"]);
    const symbol = result.state.elements[1];
    expect(symbol).toHaveProperty("type", "symbol");
    expect(symbol).toHaveProperty("id", "id0");
    expect(symbol).toHaveProperty("children", [c1, c3]);
  });
});

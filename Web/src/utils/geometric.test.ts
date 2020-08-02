import {
  screenCoordToWorldCoord,
  worldCoordToScreenCoord,
  worldLengthToScreenLength,
} from "./geometric";

describe("geometric", () => {
  it("screenCoordToWorldCoord(0,0)", () => {
    const { x, y } = screenCoordToWorldCoord(0, 0, {
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      zoom: 2,
    });
    expect(x).toEqual(10);
    expect(y).toEqual(170);
  });

  it("screenCoordToWorldCoord", () => {
    const { x, y } = screenCoordToWorldCoord(100, 200, {
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      zoom: 2,
    });
    expect(x).toEqual(60);
    expect(y).toEqual(70);
  });

  it("worldCoordToScreenCoord => 0,0", () => {
    const { x, y } = worldCoordToScreenCoord(10, 170, {
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      zoom: 2,
    });
    expect(x).toEqual(0);
    expect(y).toEqual(0);
  });
  it("worldCoordToScreenCoord", () => {
    const { x, y } = worldCoordToScreenCoord(60, 70, {
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      zoom: 2,
    });
    expect(x).toEqual(100);
    expect(y).toEqual(200);
  });

  it("worldLengthToScreenLength", () => {
    const len = worldLengthToScreenLength(100, {
      zoom: 2.0,
    });
    expect(len).toEqual(200);
  });
});

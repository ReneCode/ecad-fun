import {
  screenCoordToWorldCoord,
  worldCoordToScreenCoord,
  worldLengthToScreenLength,
} from "./geometric";

describe("geometric", () => {
  it("screenCoordToWorldCoord(0,0)", () => {
    const { x, y } = screenCoordToWorldCoord(0, 0, {
      screenWidth: 400,
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      viewWidth: 200,
      viewHeight: 150,
    });
    expect(x).toEqual(10);
    expect(y).toEqual(170);
  });

  it("screenCoordToWorldCoord", () => {
    const { x, y } = screenCoordToWorldCoord(100, 200, {
      screenWidth: 400,
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      viewWidth: 200,
      viewHeight: 150,
    });
    expect(x).toEqual(60);
    expect(y).toEqual(70);
  });

  it("worldCoordToScreenCoord => 0,0", () => {
    const { x, y } = worldCoordToScreenCoord(10, 170, {
      screenWidth: 400,
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      viewWidth: 200,
      viewHeight: 150,
    });
    expect(x).toEqual(0);
    expect(y).toEqual(0);
  });
  it("worldCoordToScreenCoord", () => {
    const { x, y } = worldCoordToScreenCoord(60, 70, {
      screenWidth: 400,
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      viewWidth: 200,
      viewHeight: 150,
    });
    expect(x).toEqual(100);
    expect(y).toEqual(200);
  });

  it("worldLengthToScreenLength", () => {
    const len = worldLengthToScreenLength(100, {
      screenWidth: 400,
      viewWidth: 200,
    });
    expect(len).toEqual(200);
  });
});

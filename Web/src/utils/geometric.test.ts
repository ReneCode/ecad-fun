import {
  screenCoordToWorldCoord,
  worldCoordToScreenCoord,
  worldLengthToScreenLength,
} from "./geometric";

describe("geometric", () => {
  it("screenCoordToWorldCoord", () => {
    const state = {
      screenOriginX: 30,
      screenOriginY: 200,
      zoom: 1,
    };

    const { x: wx, y: wy } = screenCoordToWorldCoord(
      { clientX: 100, clientY: 120 },
      state
    );
    expect(wx).toEqual(70);
    expect(wy).toEqual(80);

    const { x: sx, y: sy } = worldCoordToScreenCoord(wx, wy, state, 1);
    expect(sx).toEqual(100);
    expect(sy).toEqual(120);
  });

  it("screenCoordToWorldCoord with scale(retina)", () => {
    const state = {
      screenOriginX: 30,
      screenOriginY: 200,
      zoom: 1,
    };

    const { x: wx, y: wy } = screenCoordToWorldCoord(
      { clientX: 100, clientY: 120 },
      state
    );
    expect(wx).toEqual(70);
    expect(wy).toEqual(80);

    const { x: sx, y: sy } = worldCoordToScreenCoord(wx, wy, state, 1);
    expect(sx).toEqual(100);
    expect(sy).toEqual(120);
  });
  it("screenCoordToWorldCoord", () => {
    const { x, y } = screenCoordToWorldCoord(
      { clientX: 100, clientY: 120 },
      {
        screenOriginX: 30,
        screenOriginY: 200,
        zoom: 2,
      }
    );
    expect(x).toEqual(35);
    expect(y).toEqual(40);
  });

  it("worldLengthToScreenLength", () => {
    const len = worldLengthToScreenLength(100, {
      zoom: 2.0,
    });
    expect(len).toEqual(200);
  });
});

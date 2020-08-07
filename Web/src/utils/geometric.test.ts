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
      },
      1
    );
    expect(x).toEqual(35);
    expect(y).toEqual(40);
  });

  it("screenCoordToWorldCoord", () => {
    const { x, y } = screenCoordToWorldCoord(0, 0, {
      screenHeight: 300,
      viewX: 100,
      viewY: 200,
      zoom: 1,
    });
    expect(x).toEqual(100);
    expect(y).toEqual(500);
  });

  it("transform 0,0", () => {
    const state = {
      screenHeight: 300,
      viewX: 10,
      viewY: 20,
      zoom: 2,
    };

    const { x, y } = worldCoordToScreenCoord(10, 170, state);
    expect(x).toEqual(0);
    expect(y).toEqual(0);
    const { x: wx, y: wy } = screenCoordToWorldCoord(x, y, state);
    expect(wx).toEqual(10);
    expect(wy).toEqual(170);
  });
  it("worldCoordToScreenCoord => 400,0", () => {
    const state = {
      screenHeight: 300,
      viewX: 100,
      viewY: 200,
      zoom: 1,
    };

    const { x: wx, y: wy } = screenCoordToWorldCoord(400, 0, state);
    expect(wx).toEqual(500);
    expect(wy).toEqual(500);

    const { x: sx, y: sy } = worldCoordToScreenCoord(wx, wy, state);
    expect(sx).toEqual(400);
    expect(sy).toEqual(0);
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

  it("worldCoordToScreenCoord", () => {
    const { x, y } = worldCoordToScreenCoord(1060, 1070, {
      screenHeight: 300,
      viewX: 1010,
      viewY: 1020,
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

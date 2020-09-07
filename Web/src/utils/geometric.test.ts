import { lineLength, distancePointToLine } from "./geometric";
import * as Matrix from "./Matrix";

describe("geometric", () => {
  //   it("screenCoordToWorldCoord", () => {
  //     const state = {
  //       screenOriginX: 30,
  //       screenOriginY: 200,
  //       zoom: 1,
  //     };

  //     const { x: wx, y: wy } = screenCoordToWorldCoord(
  //       { clientX: 100, clientY: 120 },
  //       state
  //     );
  //     expect(wx).toEqual(70);
  //     expect(wy).toEqual(80);

  //     const { x: sx, y: sy } = worldCoordToScreenCoord(wx, wy, state);
  //     expect(sx).toEqual(100);
  //     expect(sy).toEqual(120);
  //   });

  it("matrix screenCoordToWorldCoord", () => {
    const screenOriginX = 30;
    const screenOriginY = 200;
    const zoom = 1;
    let m = Matrix.translate(-screenOriginX, -screenOriginY);
    m = Matrix.multiply(m, Matrix.scale(1, -1));
    m = Matrix.multiply(m, Matrix.scale(1 / zoom, 1 / zoom));
    const pt = Matrix.transform({ x: 100, y: 120 }, m);
    expect(pt).toEqual({ x: 70, y: 80 });
  });

  // it("screenCoordToWorldCoord with scale(retina)", () => {
  //   const state = {
  //     screenOriginX: 30,
  //     screenOriginY: 200,
  //     zoom: 1,
  //   };

  //   const { x: wx, y: wy } = screenCoordToWorldCoord(
  //     { clientX: 100, clientY: 120 },
  //     state
  //   );
  //   expect(wx).toEqual(70);
  //   expect(wy).toEqual(80);

  //   const { x: sx, y: sy } = worldCoordToScreenCoord(wx, wy, state, 1);
  //   expect(sx).toEqual(100);
  //   expect(sy).toEqual(120);
  // });

  // it("screenCoordToWorldCoord", () => {
  //   const { x, y } = screenCoordToWorldCoord(
  //     { clientX: 100, clientY: 120 },
  //     {
  //       screenOriginX: 30,
  //       screenOriginY: 200,
  //       zoom: 2,
  //     }
  //   );
  //   expect(x).toEqual(35);
  //   expect(y).toEqual(40);
  // });

  // it("worldLengthToScreenLength", () => {
  //   const len = worldLengthToScreenLength(100, {
  //     zoom: 2.0,
  //   });
  //   expect(len).toEqual(200);
  // });

  it("lineLength", () => {
    const len = lineLength(20, 120, 50, 160);
    expect(len).toBeCloseTo(50);
  });

  it("distancePointToLine point = start point", () => {
    const dist0 = distancePointToLine(-50, -50, -50, -50, 50, 50);
    expect(dist0).toBeCloseTo(0);
  });

  it("distancePointToLine point = point on line", () => {
    const dist0 = distancePointToLine(10, 10, -50, -50, 50, 50);
    expect(dist0).toBeCloseTo(0);
  });

  it("distancePointToLine point = outside point", () => {
    const dist = distancePointToLine(10, 0, -50, -50, 50, 50);
    expect(dist).toBeCloseTo(5 * Math.sqrt(2));
  });
});

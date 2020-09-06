import * as Matrix from "./Matrix";

describe("Matrix", () => {
  it("create", () => {
    expect(Matrix.create()).toEqual({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });

  it("transform - identity", () => {
    const pt = { x: 10, y: 20 };
    const m = Matrix.create();
    expect(Matrix.transform(m, pt)).toEqual(pt);
  });

  it("transform - translate", () => {
    const pt = { x: 10, y: 20 };
    const m = Matrix.translate(Matrix.create(), 7, 8);
    expect(Matrix.transform(m, pt)).toEqual({ x: 17, y: 28 });
  });

  it("transform - scale", () => {
    const pt = { x: 10, y: 20 };
    const m = Matrix.scale(Matrix.create(), 0.5);
    expect(Matrix.transform(m, pt)).toEqual({ x: 5, y: 10 });
  });

  it("transform - multiply-scale", () => {
    const pt = { x: 10, y: 20 };
    const m0 = Matrix.create();
    const mScale = Matrix.scale(Matrix.create(), 0.5);
    const m = Matrix.multiply(m0, mScale);
    expect(Matrix.transform(m, pt)).toEqual({ x: 5, y: 10 });
  });

  it("transform - scale-translate", () => {
    const pt = { x: 10, y: 20 };
    const m0 = Matrix.create();
    const mScale = Matrix.scale(Matrix.create(), 0.5);
    const m = Matrix.multiply(m0, mScale);
    expect(Matrix.transform(m, pt)).toEqual({ x: 5, y: 10 });
  });

  it("transform - translate-scale", () => {
    const pt = { x: 10, y: 20 };
    const m0 = Matrix.create();
    const mScale = Matrix.scale(Matrix.create(), 0.5);
    const m = Matrix.multiply(m0, mScale);
    expect(Matrix.transform(m, pt)).toEqual({ x: 5, y: 10 });
  });
});

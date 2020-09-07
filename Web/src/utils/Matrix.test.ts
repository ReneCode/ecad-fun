import * as Matrix from "./Matrix";

describe("Matrix", () => {
  it("create", () => {
    expect(Matrix.create()).toEqual({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });

  it("transform - identity", () => {
    const pt = { x: 10, y: 20 };
    const m = Matrix.create();
    expect(Matrix.transform(pt, m)).toEqual(pt);
  });

  it("transform - translate", () => {
    const pt = { x: 10, y: 20 };
    const m1 = Matrix.translate(7, 8);
    expect(Matrix.transform(pt, m1)).toEqual({ x: 17, y: 28 });
  });

  it("transform - scale", () => {
    const pt = { x: 10, y: 20 };
    const m1 = Matrix.scale(0.5, 0.5);
    expect(Matrix.transform(pt, m1)).toEqual({ x: 5, y: 10 });
  });

  it("trans - scale x,y different", () => {
    const pt = { x: 10, y: 20 };
    const m1 = Matrix.scale(2, 3);
    expect(Matrix.transform(pt, m1)).toEqual({ x: 20, y: 60 });
  });

  it("transform - scale-translate", () => {
    const pt = { x: 10, y: 20 };
    const mScale = Matrix.scale(0.5, 0.5);
    const mTranslate = Matrix.translate(50, 80);
    const m = Matrix.multiply(mTranslate, mScale);
    expect(Matrix.transform(pt, m)).toEqual({ x: 30, y: 50 });
  });

  it("transform - scale-translate-scale", () => {
    const pt = { x: 10, y: 20 };
    const mScale = Matrix.scale(0.5, 0.5);
    const mTranslate = Matrix.translate(50, 80);
    let m = Matrix.multiply(mTranslate, mScale);
    m = Matrix.multiply(m, Matrix.scale(3, 3));
    expect(Matrix.transform(pt, m)).toEqual({ x: 90, y: 150 });
  });

  it("transform - scale-translate-scale-translate", () => {
    const pt = { x: 10, y: 20 };
    const mScale = Matrix.scale(0.5, 0.5);
    const mTranslate = Matrix.translate(50, 80);
    let m = Matrix.multiply(mTranslate, mScale);
    m = Matrix.multiply(m, Matrix.scale(3, 3));
    m = Matrix.multiply(m, Matrix.translate(-50, -50));
    expect(Matrix.transform(pt, m)).toEqual({ x: 40, y: 100 });
  });

  it("transform - inverse", () => {
    const pt = { x: 20, y: 30 };
    const mTranslate = Matrix.translate(50, 30);
    const resultPt = Matrix.transform(pt, mTranslate);
    const mInverse = Matrix.inverse(mTranslate);
    expect(Matrix.transform(resultPt, mInverse)).toEqual(pt);
  });

  it("transform - inverse scale-translate", () => {
    const pt = { x: 20, y: 30 };
    const mScale = Matrix.scale(3, 2);
    const mTranslate = Matrix.translate(50, 30);
    const m = Matrix.multiply(mScale, mTranslate);
    const resultPt = Matrix.transform(pt, m);
    const mInverse = Matrix.inverse(m);
    const pt2 = Matrix.transform(resultPt, mInverse);
    expect(pt2.x).toBeCloseTo(pt.x);
    expect(pt2.y).toBeCloseTo(pt.y);
  });

  it("translate screen / world", () => {
    // screen-origin
    const m1 = Matrix.translate(-400, -300);
    // screen y is inverted
    const m2 = Matrix.scale(1, -1);
    const zoom = 1;
    const m3 = Matrix.scale(1 / zoom, 1 / zoom);
    const screenToWorldMatrix = Matrix.multiply(Matrix.multiply(m1, m2), m3);
    const worldToScreenMatrix = Matrix.inverse(screenToWorldMatrix);

    const { x: wx, y: wy } = Matrix.transform(
      { x: 500, y: 500 },
      screenToWorldMatrix
    );
    expect(wx).toBeCloseTo(100);
    expect(wy).toBeCloseTo(-200);

    const { x: sx, y: sy } = Matrix.transform(
      { x: wx, y: wy },
      worldToScreenMatrix
    );
    expect(sx).toBeCloseTo(500);
    expect(sy).toBeCloseTo(500);
  });
});

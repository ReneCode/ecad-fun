type Point = {
  x: number;
  y: number;
};

/**
 * @description
 * | a c e |
 * | b d f |
 * | 0 0 1 |
 * e,f translate
 * a,d scale
 */

export class Matrix {
  // a: number;
  // b: number;
  // c: number;
  // d: number;
  // e: number;
  // f: number;

  constructor(
    private a: number = 1,
    private b: number = 0,
    private c: number = 0,
    private d: number = 1,
    private e: number = 0,
    private f: number = 0
  ) {}

  public multiply(m2: Matrix) {
    return new Matrix(
      this.a * m2.a + this.c * m2.b,
      this.b * m2.a + this.d * m2.b,
      this.a * m2.c + this.c * m2.d,
      this.b * m2.c + this.d * m2.d,
      this.a * m2.e + this.c * m2.f + this.e,
      this.b * m2.e + this.d * m2.f + this.f
    );
  }

  public scale(scale: number) {
    return new Matrix(
      this.a * scale,
      this.b,
      this.c,
      this.d * scale,
      this.e,
      this.f
    );
  }

  public translate(m: Matrix, dx: number, dy: number) {
    return new Matrix(this.a, this.b, this.c, this.d, this.e + dx, this.f + dy);
  }

  public transform(pt: Point) {
    return {
      x: this.a * pt.x + this.c * pt.y + this.e,
      y: this.b * pt.x + this.d * pt.y + this.f,
    };
  }
}

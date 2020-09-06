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
export type Matrix = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

export function create() {
  return {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
  };
}

export function multiply(m1: Matrix, m2: Matrix) {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    e: m1.a * m2.e + m1.c * m2.f + m1.e,
    f: m1.b * m2.e + m1.d * m2.f + m1.f,
  };
}

export function scale(m: Matrix, scale: number) {
  return {
    ...m,
    a: m.a * scale,
    d: m.d * scale,
  };
}

export function translate(m: Matrix, dx: number, dy: number) {
  return {
    ...m,
    e: m.e + dx,
    f: m.f + dy,
  };
}

export function transform(m: Matrix, pt: Point) {
  return {
    x: m.a * pt.x + m.c * pt.y + m.e,
    y: m.b * pt.x + m.d * pt.y + m.f,
  };
}

//
import { Matrix, Point } from "../types";

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

export function scale(scaleX: number, scaleY: number) {
  return {
    a: scaleX,
    b: 0,
    c: 0,
    d: scaleY,
    e: 0,
    f: 0,
  };
}

export function translate(dx: number, dy: number) {
  return {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: dx,
    f: dy,
  };
}

export function inverse(m: Matrix) {
  const det = m.a * m.d - m.b * m.c;
  return {
    a: m.d / det,
    b: -m.b / det,
    c: -m.c / det,
    d: m.a / det,
    e: (m.c * m.f - m.d * m.e) / det,
    f: (m.b * m.e - m.a * m.f) / det,
  };
}

export function multiply(m2: Matrix, m1: Matrix) {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    e: m1.a * m2.e + m1.c * m2.f + m1.e,
    f: m1.b * m2.e + m1.d * m2.f + m1.f,
  };
}
export function transform(pt: Point, m: Matrix) {
  return {
    x: m.a * pt.x + m.c * pt.y + m.e,
    y: m.b * pt.x + m.d * pt.y + m.f,
  };
}

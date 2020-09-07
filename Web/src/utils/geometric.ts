import { Point, Box, Matrix } from "../types";
import * as MatrixNS from "./Matrix";

export const distancePointToPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * @description  calculates distance between point(x0,y0) and line (x1,y1,x2,y2)
 */
export const distancePointToLine = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return (
    Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) /
    lineLength(x1, y1, x2, y2)
  );
};

export const lineLength = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
};

// export const screenCoordToWorldCoord = (
//   { clientX, clientY }: { clientX: number; clientY: number },
//   {
//     screenOriginX,
//     screenOriginY,
//     zoom,
//   }: {
//     screenOriginX: number;
//     screenOriginY: number;
//     zoom: number;
//   }
// ) => {
//   return {
//     x: (clientX - screenOriginX) / zoom,
//     y: -(clientY - screenOriginY) / zoom,
//   };
// };

// export const worldCoordToScreenCoord = (
//   x: number,
//   y: number,
//   {
//     screenOriginX,
//     screenOriginY,
//     zoom,
//   }: {
//     screenOriginX: number;
//     screenOriginY: number;
//     zoom: number;
//   }
// ) => {
//   return {
//     x: x * zoom + screenOriginX,
//     y: screenOriginY - y * zoom,
//   };
// };

// export const worldLengthToScreenLength = (
//   len: number,
//   {
//     zoom,
//   }: {
//     zoom: number;
//   }
// ) => {
//   return len * zoom;
// };

export const normalizeBox = ({ x1, y1, x2, y2 }: Box) => {
  return {
    x1: Math.min(x1, x2),
    y1: Math.min(y1, y2),
    x2: Math.max(x1, x2),
    y2: Math.max(y1, y2),
  };
};

export const enlargeBoxByDelta = (
  { x1, y1, x2, y2 }: Box,
  delta: number
): Box => {
  return {
    x1: x1 - delta,
    y1: y1 - delta,
    x2: x2 + delta,
    y2: y2 + delta,
  };
};

export const enlargeBoxByBox = (b1: Box, b2: Box): Box => {
  return normalizeBox({
    x1: Math.min(b1.x1, b2.x1),
    y1: Math.min(b1.y1, b2.y1),
    x2: Math.max(b1.x2, b2.x2),
    y2: Math.max(b1.y2, b2.y2),
  });
};

export const isPointInsideBox = (pt: Point, { x1, y1, x2, y2 }: Box) => {
  return x1 <= pt.x && pt.x <= x2 && y1 <= pt.y && pt.y <= y2;
};

/**
 * @description box1 and box2 should be normalized
 */
export const intersectBoxWithBox = (box1: Box, box2: Box) => {
  if (
    box1.x1 > box2.x2 || // box1 right of box2
    box2.x1 > box1.x2 || // box2 right of box1
    box1.y1 > box2.y2 || // box1 above box2
    box2.y1 > box1.y2 // box2 above box1
  ) {
    return false;
  }
  return true;
};

export const calcTransformationMatrix = (
  screenOriginX: number,
  screenOriginY: number,
  zoom: number
) => {
  const m1 = MatrixNS.translate(-screenOriginX, -screenOriginY);
  const m2 = MatrixNS.scale(1, -1);
  const m3 = MatrixNS.scale(1 / zoom, 1 / zoom);
  const screenToWorldMatrix = MatrixNS.multiply(MatrixNS.multiply(m1, m2), m3);
  const worldToScreenMatrix = MatrixNS.inverse(screenToWorldMatrix);
  return {
    screenToWorldMatrix,
    worldToScreenMatrix,
  };
};

export const transformPoint = (x: number, y: number, matrix: Matrix) => {
  return MatrixNS.transform({ x, y }, matrix);
};

export const transformLength = (len: number, matrix: Matrix) => {
  return matrix.a * len;
};

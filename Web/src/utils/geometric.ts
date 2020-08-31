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
export const screenCoordToWorldCoord = (
  { clientX, clientY }: { clientX: number; clientY: number },
  {
    screenOriginX,
    screenOriginY,
    zoom,
  }: {
    screenOriginX: number;
    screenOriginY: number;
    zoom: number;
  }
) => {
  return {
    x: (clientX - screenOriginX) / zoom,
    y: -(clientY - screenOriginY) / zoom,
  };
};

export const worldCoordToScreenCoord = (
  x: number,
  y: number,
  {
    screenOriginX,
    screenOriginY,
    zoom,
  }: {
    screenOriginX: number;
    screenOriginY: number;
    zoom: number;
  }
) => {
  return {
    x: x * zoom + screenOriginX,
    y: screenOriginY - y * zoom,
  };
};

export const worldLengthToScreenLength = (
  len: number,
  {
    zoom,
  }: {
    zoom: number;
  }
) => {
  return len * zoom;
};

export const normalizeBox = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return {
    x1: Math.min(x1, x2),
    y1: Math.min(y1, y2),
    x2: Math.max(x1, x2),
    y2: Math.max(y1, y2),
  };
};

export const enlargeBox = (
  { x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number },
  delta: number
) => {
  return {
    x1: x1 - delta,
    y1: y1 - delta,
    x2: x2 + delta,
    y2: y2 + delta,
  };
};

export const isPointInsideBox = (
  x: number,
  y: number,
  { x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }
) => {
  return x1 <= x && x <= x2 && y1 <= y && y <= y2;
};

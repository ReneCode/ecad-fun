export const distanceBetweenPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export const screenCoordToWorldCoord = (
  x: number,
  y: number,
  {
    screenHeight,
    viewX,
    viewY,
    zoom,
  }: {
    screenHeight: number;
    viewX: number;
    viewY: number;
    zoom: number;
  }
) => {
  return {
    x: x / zoom + viewX,
    y: (screenHeight - y) / zoom + viewY,
  };
};

export const worldCoordToScreenCoord = (
  x: number,
  y: number,
  {
    screenHeight,
    viewX,
    viewY,
    zoom,
  }: {
    screenHeight: number;
    viewX: number;
    viewY: number;
    zoom: number;
  }
) => {
  return {
    x: (x - viewX) * zoom,
    y: screenHeight - (y - viewY) * zoom,
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

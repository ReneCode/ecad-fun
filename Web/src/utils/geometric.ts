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
    screenWidth,
    screenHeight,
    viewX,
    viewY,
    viewWidth,
    viewHeight,
  }: {
    screenWidth: number;
    screenHeight: number;
    viewX: number;
    viewY: number;
    viewWidth: number;
    viewHeight: number;
  }
) => {
  return {
    x: (x * viewWidth) / screenWidth + viewX,
    y: ((screenHeight - y) * viewHeight) / screenHeight + viewY,
  };
};

export const worldCoordToScreenCoord = (
  x: number,
  y: number,
  {
    screenWidth,
    screenHeight,
    viewX,
    viewY,
    viewWidth,
    viewHeight,
  }: {
    screenWidth: number;
    screenHeight: number;
    viewX: number;
    viewY: number;
    viewWidth: number;
    viewHeight: number;
  }
) => {
  return {
    x: ((x - viewX) * screenWidth) / viewWidth,
    y: screenHeight - ((y - viewY) * screenHeight) / viewHeight,
  };
};

export const worldLengthToScreenLength = (
  len: number,
  {
    screenWidth,
    viewWidth,
  }: {
    screenWidth: number;
    viewWidth: number;
  }
) => {
  return (len * screenWidth) / viewWidth;
};

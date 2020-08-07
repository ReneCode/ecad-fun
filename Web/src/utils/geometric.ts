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

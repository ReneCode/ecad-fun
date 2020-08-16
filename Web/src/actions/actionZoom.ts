import { Action, AppState } from "../types";

const zoom = (
  appState: AppState,
  zoomFactor: number,
  centerX?: number,
  centerY?: number
) => {
  const zoomCenterX = centerX || appState.screenWidth / 2;
  const zoomCenterY = centerY || appState.screenHeight / 2;

  const dx = appState.screenOriginX - zoomCenterX;
  const dy = appState.screenOriginY - zoomCenterY;
  const newScreenOriginX = dx * zoomFactor + zoomCenterX;
  const newScreenOriginY = dy * zoomFactor + zoomCenterY;

  const newZoom = Math.max(0.01, appState.zoom * zoomFactor);
  const SCREEN_GRIP_SIZE = 12;
  return {
    screenOriginX: newScreenOriginX,
    screenOriginY: newScreenOriginY,
    zoom: newZoom,
    gripSize: SCREEN_GRIP_SIZE / newZoom,
  };
};

export const actionZoomIn: Action = {
  name: "zoomIn",
  start: (appState: AppState) => {
    return zoom(appState, 1.1);
  },
};

export const actionZoomOut: Action = {
  name: "zoomOut",
  start: (appState: AppState) => {
    return zoom(appState, 1 / 1.1);
  },
};

export const actionZoomPinch: Action = {
  name: "zoomPinch",

  start: (
    appState: AppState,
    {
      deltaY,
      clientX,
      clientY,
    }: { deltaY: number; clientX: number; clientY: number }
  ) => {
    const MAX_DELTA = 10;
    let delta = Math.min(Math.abs(deltaY), MAX_DELTA);
    const sign = Math.sign(deltaY);
    delta *= sign;

    return zoom(appState, 1 - delta / 100, clientX, clientY);
  },
};

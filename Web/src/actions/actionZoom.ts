import { Action, AppState } from "../types";

const zoom = (appState: AppState, zoomFactor: number) => {
  const zoomCenterX = appState.screenWidth / 2;
  const zoomCenterY = appState.screenHeight / 2;

  const dx = appState.screenOriginX - zoomCenterX;
  const dy = appState.screenOriginY - zoomCenterY;
  const newScreenOriginX = dx * zoomFactor + zoomCenterX;
  const newScreenOriginY = dy * zoomFactor + zoomCenterY;

  return {
    screenOriginX: newScreenOriginX,
    screenOriginY: newScreenOriginY,
    zoom: appState.zoom * zoomFactor,
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

import { Action, AppState, ActionResult } from "../types";

const zoom = (
  appState: AppState,
  zoomFactor: number,
  centerX?: number,
  centerY?: number
): ActionResult => {
  const zoomCenterX = centerX || appState.screenWidth / 2;
  const zoomCenterY = centerY || appState.screenHeight / 2;

  const dx = appState.screenOriginX - zoomCenterX;
  const dy = appState.screenOriginY - zoomCenterY;
  const newScreenOriginX = dx * zoomFactor + zoomCenterX;
  const newScreenOriginY = dy * zoomFactor + zoomCenterY;

  const newZoom = Math.max(0.01, appState.zoom * zoomFactor);
  const SCREEN_GRIP_SIZE = 12;
  return {
    state: {
      screenOriginX: newScreenOriginX,
      screenOriginY: newScreenOriginY,
      zoom: newZoom,
      gripSize: SCREEN_GRIP_SIZE / newZoom,
    },
  };
};

export const actionZoomIn: Action = {
  name: "zoomIn",

  execute: ({ state }) => {
    return zoom(state, 1.1);
  },
};

export const actionZoomOut: Action = {
  name: "zoomOut",

  execute: ({ state }) => {
    return zoom(state, 1 / 1.1);
  },
};

export const actionZoomPinch: Action = {
  name: "zoomPinch",

  execute: ({ state, params }) => {
    const MAX_DELTA = 10;
    let delta = Math.min(Math.abs(params.deltaY), MAX_DELTA);
    const sign = Math.sign(params.deltaY);
    delta *= sign;

    return zoom(state, 1 - delta / 100, params.clientX, params.clientY);
  },
};

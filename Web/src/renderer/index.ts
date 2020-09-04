import { ECadBaseElement, AppState } from "../types";
import {
  worldCoordToScreenCoord,
  worldLengthToScreenLength,
} from "../utils/geometric";
import { getHandlesElement } from "../elements";
import elementWorkerManager from "../elements/ElementWorkerManager";

const COLOR = {
  SELECTED: "#5522ee",
  GRIPHANDLE_STROKE: "#5522ee",
  GRIPHANDLE_FILL: "#eee",
};

const GRIP_SIZE = 14;

type RenderOptions = {
  selected?: boolean;
};

export const renderScene = (
  canvas: HTMLCanvasElement,
  elements: ECadBaseElement[],
  state: AppState
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  renderBackground(context, canvasWidth, canvasHeight);

  for (let element of elements) {
    if (!state.selectedElementIds.includes(element.id)) {
      renderElement(context, element, state);
    }
  }

  for (let id of state.selectedElementIds) {
    const element = elements.find((el) => el.id === id);
    if (element) {
      renderElement(context, element, state, { selected: true });
    }
  }
};

const renderElement = (
  context: CanvasRenderingContext2D,
  element: ECadBaseElement,
  state: AppState,
  options: RenderOptions = {}
) => {
  context.save();

  // context.beginPath();
  const { selected } = options;
  if (selected) {
    context.strokeStyle = COLOR.SELECTED;
  } else {
    context.strokeStyle = element.color;
  }

  elementWorkerManager.render(element, context, {
    worldCoordToScreenCoord: (x: number, y: number) => {
      return worldCoordToScreenCoord(x, y, state);
    },
    worldLengthToScreenLength: (len: number) => {
      return worldLengthToScreenLength(len, state);
    },
  });

  if (selected) {
    const handles = getHandlesElement(element);
    handles.forEach((handle) => {
      renderHandle(context, handle.x, handle.y, state);
    });
  }
  context.restore();
};

const renderBackground = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  context.beginPath();
  const padding = 0;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "#aaa";
  context.fillRect(
    0 + padding,
    0 + padding,
    canvasWidth - 2 * padding,
    canvasHeight - 2 * padding
  );
};

const renderHandle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  state: AppState
) => {
  const { x: sx, y: sy } = worldCoordToScreenCoord(x, y, state);

  context.beginPath();
  context.strokeStyle = COLOR.GRIPHANDLE_STROKE;
  context.fillStyle = COLOR.GRIPHANDLE_FILL;
  context.fillRect(
    sx - GRIP_SIZE / 2,
    sy - GRIP_SIZE / 2,
    GRIP_SIZE,
    GRIP_SIZE
  );
  context.strokeRect(
    sx - GRIP_SIZE / 2,
    sy - GRIP_SIZE / 2,
    GRIP_SIZE,
    GRIP_SIZE
  );
};

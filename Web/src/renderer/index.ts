import {
  ECadBaseElement,
  AppState,
  ElementRenderParams,
  Matrix,
} from "../types";
import { transformPoint } from "../utils/geometric";

import { getHandlesElement } from "../elements";
import elementWorkerManager from "../elements/ElementWorkerManager";
import { COLOR } from "../utils/color";

const GRIP_SIZE = 14;

type RenderOptions = {
  selected?: boolean;
};

export const renderScene = (
  canvas: HTMLCanvasElement,
  elements: readonly ECadBaseElement[],
  dynamicElements: readonly ECadBaseElement[],
  state: AppState
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  renderBackground(context, canvasWidth, canvasHeight);

  const renderParams = {
    screenToWorldMatrix: state.screenToWorldMatrix,
    worldToScreenMatrix: state.worldToScreenMatrix,
    selected: false,
  };

  for (let element of elements) {
    if (!state.selectedElementIds.includes(element.id)) {
      renderElement(context, element, renderParams);
    }
  }

  const renderParamsSelected = {
    ...renderParams,
    selected: true,
  };
  for (let id of state.selectedElementIds) {
    const element = elements.find((el) => el.id === id);
    if (element) {
      renderElement(context, element, renderParamsSelected);
    }
  }

  for (let dynamicElement of dynamicElements) {
    renderElement(context, dynamicElement, renderParams);
  }
};

const renderElement = (
  context: CanvasRenderingContext2D,
  element: ECadBaseElement,
  renderParams: ElementRenderParams
) => {
  context.save();

  // context.beginPath();

  elementWorkerManager.render(element, context, renderParams);

  if (renderParams.selected) {
    const handles = getHandlesElement(element);
    handles.forEach((handle) => {
      renderHandle(
        context,
        handle.x,
        handle.y,
        renderParams.worldToScreenMatrix
      );
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
  worldToScreenMatrix: Matrix
) => {
  const { x: sx, y: sy } = transformPoint(x, y, worldToScreenMatrix);

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

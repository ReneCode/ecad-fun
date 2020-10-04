import React from "react";
import Toolbox from "./Toobox";
import Status from "./Status";
import SymbolList from "./SymbolList";
import { renderScene } from "../renderer";
import { ActionManager, EventType } from "../actions/actionManager";
import { AppState, getDefaultAppState, ECadBaseElement } from "../types";
import { loadFromLocalStorage } from "../state";
import { transformPoint, calcTransformationMatrix } from "../utils/geometric";
import { Project } from "multiplayer";
import { Socket } from "../data/Socket";
import { getElements } from "../elements";

type Props = {
  width: number;
  height: number;
  onChange: (appState: AppState, project: Project) => void;
  project: Project;
  socket: Socket;
};

class GraphicEditor extends React.Component<Props, AppState> {
  canvas: HTMLCanvasElement | null = null;
  actionMananger: ActionManager;

  state: AppState = getDefaultAppState();

  constructor(props: Props) {
    super(props);
    console.log("new ActionManager", this.props);
    this.actionMananger = new ActionManager(
      () => this.getState(),
      this.setStateValues,
      () => [],
      () => {},
      this.props.project,
      this.props.socket
      // () => this.project.getElements(),
      // (elements) => this.project.setElements(elements)
    );

    this.actionMananger.registerAll();

    // const symbolLibManager = new SymbolLibManager(this.projects);
    // this.actionMananger.registerAddin(
    //   "symbollib",
    //   symbolLibManager.applyResult
    // );
  }

  // getMainProject(): Project {
  //   return this.projects["main"];
  // }

  componentDidMount() {
    console.log("did mount");

    const { state, elements } = loadFromLocalStorage();
    const matrix = calcTransformationMatrix(
      state.screenOriginX,
      state.screenOriginY,
      state.zoom
    );
    this.setState({ ...state, ...matrix });
    // this.project.setElements(elements);
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  addEventListeners = () => {
    // window.addEventListener("resize", this.onResize);
    window.addEventListener("dragover", this.disableEvent, false);
    window.addEventListener("drop", this.disableEvent, false);
  };

  removeEventListeners = () => {
    // window.removeEventListener("resize", this.onResize);
    window.removeEventListener("dragover", this.disableEvent, false);
    window.removeEventListener("drop", this.disableEvent, false);
  };

  private disableEvent = (event: UIEvent) => {
    event.preventDefault();
  };

  setStateValues = (vals: AppState) => {
    if ("screenOriginX" in vals || "screenOriginY" in vals || "zoom" in vals) {
      // recalc transformation matrix if relevant state properties are changed
      const screenOriginX = ("screenOriginX" in vals
        ? vals.screenOriginX
        : this.state.screenOriginX) as number;
      const screenOriginY = ("screenOriginY" in vals
        ? vals.screenOriginY
        : this.state.screenOriginY) as number;
      const zoom = ("zoom" in vals ? vals.zoom : this.state.zoom) as number;

      const matrix = calcTransformationMatrix(
        screenOriginX,
        screenOriginY,
        zoom
      );
      this.setState({ ...vals, ...matrix });
    } else {
      this.setState(vals);
    }
  };

  getState = (): AppState => {
    return this.state;
  };

  componentDidUpdate() {
    if (this.canvas) {
      this.canvas.style.cursor = this.state.cursor;

      const elements = getElements(this.props.project);

      let dynamicElements: ECadBaseElement[] = [];
      if (this.state.editingElement) {
        dynamicElements.push(this.state.editingElement);
      }
      if (this.state.selectionBox) {
        dynamicElements.push(this.state.selectionBox);
      }
      renderScene(this.canvas, elements, dynamicElements, this.state);
      this.props.onChange(this.state, this.props.project);
    }
  }

  public render() {
    const canvasScale = 1.0;
    const canvasDOMWidth = this.props.width;
    const canvasDOMHeight = this.props.height;
    const canvasWidth = canvasDOMWidth * canvasScale;
    const canvasHeight = canvasDOMHeight * canvasScale;

    return (
      <div className="main">
        {/* <SymbolList
          state={this.state}
          project={this.project}
          actionManager={this.actionMananger}
        /> */}
        <Toolbox onClick={this.onToolboxClick} />
        <Status x={this.state.pointerX} y={this.state.pointerY} />
        <canvas
          ref={this.handleCanvasRef}
          style={{ width: canvasDOMWidth, height: canvasDOMHeight }}
          width={canvasWidth}
          height={canvasHeight}
          onPointerDown={this.onPointerDown}
          onPointerUp={this.onPointerUp}
          onPointerMove={this.onPointerMove}
          onDrop={this.onDrop}
        ></canvas>
      </div>
    );
  }

  private onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    this.dispatchPointerEvent("pointerMove", event);
  };
  private onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    this.dispatchPointerEvent("pointerUp", event);
  };
  private onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    this.dispatchPointerEvent("pointerDown", event);
  };
  private onDrop = (event: React.DragEvent<HTMLCanvasElement>) => {
    this.actionMananger.execute("importDocument", { params: event });
  };
  private onWheel = (event: WheelEvent) => {
    event.preventDefault();

    // note that event.ctrlKey is necessary to handle pinch zooming
    if (event.metaKey || event.ctrlKey) {
      this.actionMananger.execute("zoomPinch", {
        params: event,
      });
    } else {
      this.actionMananger.execute("panning", {
        params: event,
      });
    }
  };

  private onToolboxClick = (action: string) => {
    this.actionMananger.execute(action, { params: null });
  };

  private handleCanvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      this.canvas = canvas;

      this.canvas.addEventListener("wheel", this.onWheel, {
        passive: false,
      });
    } else {
      // unmount
      this.canvas?.removeEventListener("wheel", this.onWheel);
    }
  };

  private dispatchPointerEvent(
    eventType: EventType,
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    const { x, y } = transformPoint(
      event.clientX,
      event.clientY,
      this.state.screenToWorldMatrix
    );
    this.setState({
      pointerX: x,
      pointerY: y,
      pointerButtons: event.buttons,
    });
    this.actionMananger.dispatch(eventType, {});
  }
}

export default GraphicEditor;

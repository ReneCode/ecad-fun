import React from "react";

import "../actions";
import Toolbox from "./Toolbox";
import Status from "./Status";
import { renderScene } from "../renderer";
import { ActionManager, EventType } from "../actions/actionManager";
import { AppState, getDefaultAppState, ECadBaseElement } from "../types";
import { loadFromLocalStorage } from "../state";
import { transformPoint, calcTransformationMatrix } from "../utils/geometric";
import { Project } from "../share";
import { Socket } from "../data/Socket";
import { ProjectService } from "../data/ProjectService";

type Props = {
  width: number;
  height: number;
  onChange: (appState: AppState, project: Project) => void;
  projectId: string;
  pageId?: string;
};

class GraphicEditor extends React.Component<Props, AppState> {
  canvas: HTMLCanvasElement | null = null;
  actionMananger: ActionManager | undefined;
  socket: Socket = new Socket();
  projectService: ProjectService = (undefined as unknown) as ProjectService;

  state: AppState = getDefaultAppState();

  // init() {
  //   console.log("init ActionManager);

  // const symbolLibManager = new SymbolLibManager(this.projects);
  // this.actionMananger.registerAddin(
  //   "symbollib",
  //   symbolLibManager.applyResult
  // );
  // }

  componentDidUpdate() {
    if (this.canvas) {
      this.canvas.style.cursor = this.state.cursor;

      let dynamicElements: ECadBaseElement[] = [];
      if (this.state.editingElement) {
        dynamicElements.push(this.state.editingElement);
      }
      if (this.state.selectionBox) {
        dynamicElements.push(this.state.selectionBox);
      }

      const currentPage = this.projectService.getPage(this.state.currentPageId);
      // console.log("currentPage:", currentPage);
      const elements = (currentPage?._children
        ? currentPage._children
        : []) as ECadBaseElement[];

      const currentActionName = this.actionMananger?.getCurrentAction();
      renderScene(this.canvas, elements, dynamicElements, this.state);
      this.props.onChange(this.state, this.projectService.getProject());
    }
  }

  componentDidMount() {
    const project = new Project(this.props.projectId, { undoRedo: true });
    this.projectService = new ProjectService(project, this.socket);

    this.socket.init(
      project,
      // project open
      (project) => {
        // open page
        const pages = this.projectService.getPages(project);
        let currentPageId: string;
        if (pages.length === 0) {
          const newPage = this.projectService.createPage(project);
          currentPageId = newPage.id;
        } else {
          let page = pages.find((p) => p.id === this.props.pageId);
          if (page) {
            currentPageId = page.id;
          } else {
            // take first page
            currentPageId = pages[0].id;
          }
        }
        this.setState({ currentPageId: currentPageId });
      },
      // project change
      (project: Project) => {
        this.setState({});
      }
    );

    this.actionMananger = new ActionManager(
      () => this.getState(),
      this.setStateValues,
      () => [],
      () => {},
      project,
      this.socket
      // () => this.project.getElements(),
      // (elements) => this.project.setElements(elements)
    );

    const { state } = loadFromLocalStorage();
    const matrix = calcTransformationMatrix(
      state.screenOriginX,
      state.screenOriginY,
      state.zoom
    );
    this.setState({ ...state, ...matrix });
    // this.project.setElements(elements);

    this.setDebugging();

    this.addEventListeners();
  }

  componentWillUnmount() {
    this.socket.exit();
    this.removeEventListeners();
  }

  addEventListeners = () => {
    // window.addEventListener("resize", this.onResize);
    window.addEventListener("dragover", this.disableEvent, false);
    window.addEventListener("drop", this.disableEvent, false);

    window.addEventListener("keydown", this.onKeyDown, false);
  };

  removeEventListeners = () => {
    // window.removeEventListener("resize", this.onResize);
    window.removeEventListener("dragover", this.disableEvent, false);
    window.removeEventListener("drop", this.disableEvent, false);
    window.removeEventListener("keydown", this.onKeyDown, false);
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

  private setDebugging() {
    (window as any).h = {
      project: this.projectService.getProject(),
    };
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
        <Toolbox
          onClick={this.onToolboxClick}
          currentActionName={this.actionMananger?.getCurrentAction() || ""}
        />
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
  private onKeyDown = (event: KeyboardEvent) => {
    this.actionMananger?.keyDown(event);
  };

  private onDrop = (event: React.DragEvent<HTMLCanvasElement>) => {
    this.actionMananger?.execute("importDocument", event);
  };
  private onWheel = (event: WheelEvent) => {
    event.preventDefault();

    // note that event.ctrlKey is necessary to handle pinch zooming
    if (event.metaKey || event.ctrlKey) {
      this.actionMananger?.execute("zoomPinch", event);
    } else {
      this.actionMananger?.execute("panning", event);
    }
  };

  private onToolboxClick = (action: string) => {
    this.actionMananger?.execute(action, null);
    this.setState({});
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
    this.actionMananger?.dispatch(eventType, { shiftKey: event.shiftKey });
  }
}

export default GraphicEditor;

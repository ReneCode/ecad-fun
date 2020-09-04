import React from "react";
import { canvasState } from "../canvas";
import Toolbox from "./Toobox";
import Status from "./Status";
import { renderScene } from "../renderer";
import { ActionManager, EventType } from "../actions/actionManager";
import { screenCoordToWorldCoord } from "../utils/geometric";
import { AppState, getDefaultAppState } from "../types";
import { Gesture } from "../utils/Gesture";
import { loadFromLocalStorage } from "../state";

type Props = {
  width: number;
  height: number;
  onChange: (appState: AppState) => void;
};

class Project extends React.Component<Props> {
  canvas: HTMLCanvasElement | null = null;
  actionMananger: ActionManager;
  gesture = new Gesture();
  unsubscribe: (() => void)[] = [];

  state: AppState = getDefaultAppState();

  constructor(props: Props) {
    super(props);
    this.setState({
      width: props.width,
      height: props.height,
    });

    // this.updateScreenProjectMatrix()
    this.setState = this.setState.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.unsubscribe.push(
      canvasState.subscribe(() => {
        // this.setState({});
      })
    );

    this.actionMananger = new ActionManager({
      setState: this.setState.bind(this),
    });

    this.actionMananger.registerAll();
  }

  componentDidMount() {
    // if (this.canvas) {
    //   const elements = canvasState.getElements();
    //   renderScene(this.canvas, elements, this.state, window.devicePixelRatio);
    // }

    // this.actionMananger.execute("loadElements", this.state);

    window.addEventListener("resize", this.onResize);
    this.setState(loadFromLocalStorage());
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);

    this.unsubscribe.forEach((fn) => fn());
  }

  onResize() {
    this.setState({
      screenWidth: this.canvas?.width,
      screenHeight: this.canvas?.height,
    });
  }

  componentDidUpdate() {
    if (this.canvas) {
      this.canvas.style.cursor = this.state.cursor;
      let elements = [...this.state.elements];
      if (this.state.editingElement) {
        elements.push(this.state.editingElement);
      }
      if (this.state.selectionBox) {
        elements.push(this.state.selectionBox);
      }
      renderScene(this.canvas, elements, this.state);
    }
    this.props.onChange(this.state);
  }

  public render() {
    // window.devicePixelRatio will be used much more later
    const canvasScale = 1.0;
    const canvasDOMWidth = this.props.width;
    const canvasDOMHeight = this.props.height;
    const canvasWidth = canvasDOMWidth * canvasScale;
    const canvasHeight = canvasDOMHeight * canvasScale;

    return (
      <div className="main">
        <Toolbox onClick={this.onToolboxClick.bind(this)} />
        <Status x={this.state.pointerX} y={this.state.pointerY} />
        <canvas
          ref={this.handleCanvasRef}
          style={{ width: canvasDOMWidth, height: canvasDOMHeight }}
          width={canvasWidth}
          height={canvasHeight}
          onPointerDown={this.onPointerDown}
          onPointerUp={this.onPointerUp}
          onPointerMove={this.onPointerMove}
          // onWheel={this.onWheel}
        ></canvas>
      </div>
    );
  }

  private onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    this.dispatchPointerEvent("pointerMove", event);
  }
  private onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    this.dispatchPointerEvent("pointerUp", event);
  }
  private onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    this.dispatchPointerEvent("pointerDown", event);
  }
  private onWheel(event: WheelEvent) {
    event.preventDefault();

    // note that event.ctrlKey is necessary to handle pinch zooming
    if (event.metaKey || event.ctrlKey) {
      this.actionMananger.execute("zoomPinch", {
        state: this.state,
        params: event,
      });
    } else {
      this.actionMananger.execute("panning", {
        state: this.state,
        params: event,
      });
    }
  }

  private onToolboxClick(action: string) {
    this.actionMananger.execute(action, { state: this.state, params: null });
  }

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
    const { x, y } = screenCoordToWorldCoord(event, this.state);
    // console.log(">", event.button, event.buttons);
    if (false)
      console.log(
        event.clientX,
        event.clientY,
        "/",
        x,
        y,
        "/",
        window.devicePixelRatio,
        this.state.zoom,
        "/",
        this.state.screenWidth,
        this.state.screenHeight,
        "/",
        this.canvas?.width,
        this.canvas?.height
      );
    this.setState({
      pointerX: x,
      pointerY: y,
      pointerButtons: event.buttons,
    });
    this.actionMananger.dispatch(eventType, {
      state: this.state,
    });
  }
}

export default Project;

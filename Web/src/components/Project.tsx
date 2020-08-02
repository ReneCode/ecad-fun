import React from "react";
import { canvasState } from "../canvas";
import Toolbox from "./Toobox";
import Status from "./Status";
import { renderScene } from "../renderer";
import { ActionManager, EventType } from "../actions/manager";
import { AppState } from "../state/appState";
import { screenCoordToWorldCoord as screenCoordToProjectCoord } from "../utils/geometric";

type Props = {
  width: number;
  height: number;
};

class Project extends React.Component<Props> {
  canvas: HTMLCanvasElement | null = null;
  actionMananger: ActionManager;
  unsubscribe: (() => void)[] = [];

  state: AppState = {
    cursor: "default",
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    editingElement: null,
    elements: [],
    clientX: 0,
    clientY: 0,

    viewX: 0,
    viewY: 0,
    zoom: 1.0,

    pointerX: 0,
    pointerY: 0,
  };

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
    if (this.canvas) {
      const elements = canvasState.getElements();
      renderScene(this.canvas, elements, this.state);
    }
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);

    this.unsubscribe.forEach((fn) => fn());
  }

  onResize() {}

  componentDidUpdate() {
    if (this.canvas) {
      this.canvas.style.cursor = this.state.cursor;
      let elements = [...this.state.elements];
      if (this.state.editingElement) {
        elements.push(this.state.editingElement);
      }
      renderScene(this.canvas, elements, this.state);
    }
  }

  public render() {
    const canvasScale = window.devicePixelRatio;
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
        ></canvas>
      </div>
    );
  }

  private onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    this.executePointerEvent("pointerMove", event);
  }
  private onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    this.executePointerEvent("pointerUp", event);
  }
  private onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    this.executePointerEvent("pointerDown", event);
  }

  private onToolboxClick(action: string) {
    this.actionMananger.startAction(action, this.state);
  }

  private handleCanvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      this.canvas = canvas;
    }
  };

  private executePointerEvent(
    eventType: EventType,
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    const { x, y } = screenCoordToProjectCoord(
      event.clientX,
      event.clientY,
      this.state
    );
    this.setState({
      pointerX: x,
      pointerY: y,
    });
    this.actionMananger.execute(eventType, this.state);
    // this.setState({});
  }
}

export default Project;

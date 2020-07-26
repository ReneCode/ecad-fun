import React from "react";
// import { actions, state } from "../overmind";
import { canvasState } from "../canvas";
import { nanoid } from "nanoid";
import { ECadLineElement, ECadBaseElement } from "../element";
import { renderScene } from "../renderer";
import { ActionManager, EventType } from "../actions/manager";
import { AppState } from "../state/appState";

// type AppState = {
//   editingElement: ECadLineElement | null;
//   elements: ECadBaseElement[];
//   width: number;
//   height: number;
// };

type Props = {
  width: number;
  height: number;
};

class Project extends React.Component<Props> {
  canvas: HTMLCanvasElement | null = null;
  actionMananger: ActionManager;
  unsubscribe: (() => void)[] = [];

  state: AppState = {
    width: window.innerWidth,
    height: window.innerHeight,
    editingElement: null,
    elements: [],
    clientX: 0,
    clientY: 0,
    pointerX: 0,
    pointerY: 0,
  };

  constructor(props: Props) {
    super(props);
    this.setState({ width: props.width, height: props.height });
    this.setState = this.setState.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.unsubscribe.push(
      canvasState.subscribe(() => {
        // this.setState({});
      })
    );

    this.actionMananger = new ActionManager();

    this.actionMananger.registerAll();
  }

  componentDidMount() {
    if (this.canvas) {
      const elements = canvasState.getElements();
      renderScene(this.canvas, elements);
    }
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((fn) => fn());
  }

  componentDidUpdate() {
    if (this.canvas) {
      let elements = [...this.state.elements];
      if (this.state.editingElement) {
        elements.push(this.state.editingElement);
      }
      renderScene(this.canvas, elements);
    }
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

  public render() {
    const canvasScale = window.devicePixelRatio;
    const canvasDOMWidth = this.props.width;
    const canvasDOMHeight = this.props.height;
    const canvasWidth = canvasDOMWidth * canvasScale;
    const canvasHeight = canvasDOMHeight * canvasScale;

    return (
      <canvas
        ref={this.handleCanvasRef}
        style={{ width: canvasDOMWidth, height: canvasDOMHeight }}
        width={canvasWidth}
        height={canvasHeight}
        onPointerDown={this.onPointerDown}
        onPointerUp={this.onPointerUp}
        onPointerMove={this.onPointerMove}
      ></canvas>
    );
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
    const x = Math.floor(event.clientX);
    const y = Math.floor(event.clientY);
    this.setState({
      pointerX: x,
      pointerY: y,
    });
    this.actionMananger.execute(eventType, this.state);
    this.setState({});
  }
}

export default Project;

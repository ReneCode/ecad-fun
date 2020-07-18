import React from "react";
import Paper from "paper";
import { actions, state } from "../overmind";
import { canvasState, BaseElement } from "../canvas";
import { nanoid } from "nanoid";

class Project extends React.Component {
  canvas: HTMLCanvasElement | undefined = undefined;
  cleanupFn: any[] = [];

  constructor(props: any) {
    super(props);

    this.renderCanvas = this.renderCanvas.bind(this);
  }

  componentDidMount() {
    this.cleanupFn.push(canvasState.subscribe(this.renderCanvas));
  }

  componentWillUnmount() {
    this.cleanupFn.forEach((fn) => fn());
  }

  public render() {
    const canvasDOMWidth = window.innerWidth;
    const canvasDOMHeight = window.innerHeight;
    const canvasScale = window.devicePixelRatio;
    const canvasWidth = canvasDOMWidth * canvasScale;
    const canvasHeight = canvasDOMHeight * canvasScale;

    return (
      <div className="main">
        <canvas
          id="canvas"
          style={{
            width: canvasDOMWidth,
            height: canvasDOMHeight,
          }}
          width={canvasWidth}
          height={canvasHeight}
          ref={this.handleCanvasRef}
          onPointerDown={this.handlePointerDown}
        ></canvas>
      </div>
    );
  }

  private renderCanvas() {
    debugger;
    if (!this.canvas) {
      return;
    }
    const elements = canvasState.getElements();

    const context = this.canvas.getContext("2d");
    if (!context) {
      return;
    }

    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = "#eeb";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    /*
    const rc = rough.canvas(this.canvas, { options: { roughness: 0 } });
    const generator = rough.generator({ options: { roughness: 0 } });

    const drawings: Drawable[] = [];
    elements.forEach((e) => {
      drawings.push(generator.circle(e.x, e.y, 140));
    });

    const json = JSON.stringify(drawings, null, 2);
    console.log(">>", json);
    drawings.forEach((d) => {
      rc.draw(d);
    });
    */

    const paperScope = new Paper.PaperScope();
    paperScope.setup(this.canvas);

    const path = new paperScope.Path.Circle(new Paper.Point(40, 60), 30);
    path.strokeColor = new Paper.Color("red");
  }

  private handlePointerDown = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const name = state.canvas.name;
    actions.canvas.setName("A-" + name);

    const element: BaseElement = {
      id: nanoid(),
      x: 200,
      y: 300,
      strokeColor: "red",
      fillStyle: "yellow",
    };

    canvasState.addElement(element);
  };

  private handleCanvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      this.canvas = canvas;
    }
  };
}

export default Project;

import React from "react";
// import { actions, state } from "../overmind";
import { canvasState } from "../canvas";
import { nanoid } from "nanoid";
import { ECadLineElement, ECadBaseElement } from "../element";
import { renderScene } from "../renderer";

type AppState = {
  editingElement: ECadLineElement | null;
  elements: ECadBaseElement[];
  width: number;
  height: number;
};

type Props = {
  width: number;
  height: number;
};

class Project extends React.Component<Props> {
  canvas: HTMLCanvasElement | null = null;

  unsubscribe: (() => void)[] = [];

  state: AppState = {
    width: window.innerWidth,
    height: window.innerHeight,
    editingElement: null,
    elements: [],
  };

  constructor(props: Props) {
    super(props);
    this.setState({ width: props.width, height: props.height });
    this.setState = this.setState.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    console.log("AB");
    this.unsubscribe.push(
      canvasState.subscribe(() => {
        // this.setState({});
      })
    );
  }

  componentDidMount() {
    if (this.canvas) {
      const elements = canvasState.getElements();
      console.log("render");
      renderScene(this.canvas, elements);
    }
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((fn) => fn());
  }
  /*
  useEffect(() => {
    if (canvasRef.current) {
      const elements = canvasState.getElements();
      renderScene(canvasRef.current, elements);
    }
    const unsubscribeFn = canvasState.subscribe(() => {
      // if (canvasRef.current) {
      //   const elements = canvasState.getElements();
      //   renderScene(canvasRef.current, elements);
      // }
      console.log("change");
      setState(state + 1);
    });

    return () => unsubscribeFn();
  }, []);

  useEffect(() => {
    console.log("redraw");

    if (canvasRef.current) {
    }
  }, [state]);
*/

  componentDidUpdate() {
    if (this.canvas) {
      let elements = [...canvasState.getElements()];
      if (this.state.editingElement) {
        elements.push(this.state.editingElement);
      }
      renderScene(this.canvas, elements);
    }
  }

  private onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    console.log(event);
    const x = Math.floor(event.clientX);
    const y = Math.floor(event.clientY);

    if (this.state.editingElement) {
      const element = {
        ...this.state.editingElement,
        x2: x,
        y2: y,
      };
      this.setState({ editingElement: element });
    }
  }
  private onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    if (this.state.editingElement) {
      console.log(">> up");
      canvasState.addElement(this.state.editingElement);
      this.setState({ editingElement: null });
    }
  }

  private onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const x = Math.floor(event.clientX);
    const y = Math.floor(event.clientY);

    const element: ECadLineElement = {
      id: nanoid(),
      type: "line",
      x,
      y,
      x2: x,
      y2: y,
      color: "green",
    };
    this.setState({ editingElement: element });
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

  /*
  canvas: HTMLCanvasElement | undefined = undefined;
  cleanupFn: any[] = [];

  constructor(props: any) {
    super(props);

    this.renderCanvas = this.renderCanvas.bind(this);
  }

  componentDidMount() {
    this.cleanupFn.push(canvasState.subscribe(this.renderCanvas));

    document.addEventListener("resize", this.handleResize, false);
  }

  componentWillUnmount() {
    document.removeEventListener("resize", this.handleResize, false);

    this.cleanupFn.forEach((fn) => fn());
  }

  handleResize() {}

  public render() {
    if (!this.canvas) {
      return null;
    }
    const canvasScale = window.devicePixelRatio;
    const canvasDOMWidth = this.canvas.width;
    const canvasDOMHeight = this.canvas.height;
    const canvasWidth = canvasDOMWidth * canvasScale;
    const canvasHeight = canvasDOMHeight * canvasScale;

    return (
      <canvas
        ref={this.handleCanvasRef}
        style={{ width: canvasDOMWidth, height: canvasDOMHeight }}
        width={canvasWidth}
        height={canvasHeight}
        onPointerDown={this.handlePointerDown}
      ></canvas>
    );
  }

  private renderCanvas() {
    if (!this.canvas) {
      return;
    }

    const elements = canvasState.getElements();
    renderScene(this.canvas, elements);
  }




  */
}

export default Project;

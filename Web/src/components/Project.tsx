import React from "react";

class Main extends React.Component {
  constructor(props: any) {
    super(props);
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

  private handlePointerDown = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {};

  private handleCanvasRef = (canvas: HTMLCanvasElement) => {};
}

export default Main;

export type PointerCoords = Readonly<{
  x: number;
  y: number;
}>;

export class Gesture {
  pointers: Map<number, PointerCoords>;
  lastCenter: { x: number; y: number } | null;
  initialDistance: number | null;
  initialScale: number | null;

  constructor() {
    this.pointers = new Map();
    this.lastCenter = null;
    this.initialDistance = null;
    this.initialScale = null;
  }

  public onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    console.log("id:", event.pointerId);

    if (this.pointers.size === 2) {
      console.log("ABC");
      // this.lastCenter = getCenter(this.pointers);
      // this.initialScale = this.state.zoom;
      // this.initialDistance = getDistance(
      // Array.from(this.pointers.values()),
      // );
    }
  }

  public onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    this.pointers.delete(event.pointerId);
  }
}

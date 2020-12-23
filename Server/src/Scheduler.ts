export class Scheduler {
  intervalHandle: NodeJS.Timeout | undefined;

  constructor(
    private callback: (scheduler: Scheduler) => void,
    private ms: number
  ) {
    this.init();
  }

  public exit() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
  }

  public reset() {
    this.exit();
    this.init();
  }

  private init() {
    this.intervalHandle = setInterval(() => {
      this.callback(this);
    }, this.ms);
  }
}

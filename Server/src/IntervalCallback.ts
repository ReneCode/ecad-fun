export class IntervalCallback {
  intervalHandle: Map<
    string,
    { handle: NodeJS.Timeout; enable: boolean }
  > = new Map();

  init(
    key: string,
    callback: (id: string) => void,
    ms: number,
    enable: boolean = false
  ) {
    const value = this.intervalHandle.get(key);
    if (value && value.handle) {
      clearInterval(value.handle);
    }
    const newHandle = setInterval(() => {
      const v = this.intervalHandle.get(key);
      if (v) {
        if (v.enable) {
          callback(key);
          v.enable = false;
          this.intervalHandle.set(key, v);
        }
      }
    }, ms);
    this.intervalHandle.set(key, { handle: newHandle, enable: enable });
  }

  exit(key: string) {
    const value = this.intervalHandle.get(key);
    if (value && value.handle) {
      clearInterval(value.handle);
    }
    this.intervalHandle.delete(key);
  }

  enableCallback(key: string) {
    const value = this.intervalHandle.get(key);
    if (value) {
      if (!value.enable) {
        value.enable = true;
        this.intervalHandle.set(key, value);
      }
    }
  }
}

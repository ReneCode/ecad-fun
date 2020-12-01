//

export type EventHandler = (...params: any) => void;

export class Dispatcher {
  private eventHandlers: {
    type: string;
    handler: EventHandler;
  }[] = [];

  // returns function to unsubscribe
  subscribe(type: string, handler: EventHandler): () => void {
    this.eventHandlers.push({ type, handler });
    return () => {
      this.eventHandlers = this.eventHandlers.filter((eh) => {
        return !(eh.type === type && eh.handler === handler);
      });
    };
  }

  dispatch(type: string, ...params: any) {
    let handled = false;
    const eventHandlers = [...this.eventHandlers];
    for (let eh of eventHandlers) {
      if (eh.type === type) {
        try {
          handled = true;
          eh.handler(...params);
        } catch (ex) {
          // if DEBUG
          console.error(new Error(`Exception on dispatching event: ${type}`));
          throw ex;
          // if RELEASE
          // console.error(
          //   `Exception on dispatching Event: ${type} + ${payload} to ${
          //     eh.handler
          //   }`,
          // );
        }
      }
    }
    if (!handled) {
      // console.warn("no appEventHandler found for:", type);
    }
  }
}

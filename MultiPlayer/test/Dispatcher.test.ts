import { Dispatcher } from "../src/Dispatcher";

describe("Dispatcher", () => {
  it("basic", () => {
    const dispatcher = new Dispatcher();
    const fn = jest.fn();
    const unsubscribe = dispatcher.subscribe("ping", fn);
    dispatcher.dispatch("ping");
    dispatcher.dispatch("ping");
    expect(fn.mock.calls).toHaveLength(2);
    unsubscribe();
    dispatcher.dispatch("ping");
    expect(fn.mock.calls).toHaveLength(2);
  });

  it("multiple - with unsubscribe", () => {
    const dispatcher = new Dispatcher();
    const fnA = jest.fn();
    const fnB = jest.fn();
    const unsubscribeA = dispatcher.subscribe("A", fnA);
    const unsubscribeB = dispatcher.subscribe("B", fnB);

    dispatcher.dispatch("A");
    expect(fnA.mock.calls).toHaveLength(1);
    expect(fnB.mock.calls).toHaveLength(0);

    dispatcher.dispatch("B");
    expect(fnA.mock.calls).toHaveLength(1);
    expect(fnB.mock.calls).toHaveLength(1);

    // should not dispatch A
    unsubscribeA();
    dispatcher.dispatch("A");
    expect(fnA.mock.calls).toHaveLength(1);
    expect(fnB.mock.calls).toHaveLength(1);
    dispatcher.dispatch("B");
    expect(fnA.mock.calls).toHaveLength(1);
    expect(fnB.mock.calls).toHaveLength(2);

    unsubscribeB();
    dispatcher.dispatch("B");
    expect(fnA.mock.calls).toHaveLength(1);
    expect(fnB.mock.calls).toHaveLength(2);
  });
});

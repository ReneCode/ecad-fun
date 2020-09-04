import { Action, ECadSymbolElement } from "../types";
import { randomId } from "../utils/randomId";

export const actionCreateSymbol: Action = {
  name: "createSymbol",

  execute: ({ state }) => {
    if (state.selectedElementIds.length === 0) {
      return;
    }

    const children = state.elements.filter((element) =>
      state.selectedElementIds.includes(element.id)
    );
    const lastChildId = children[children.length - 1].id;
    const symbol: ECadSymbolElement = {
      id: randomId(),
      type: "symbol",
      color: "black",
      children: children,
      refX: 0,
      refY: 0,
    };

    // remove selected elements from state.element and put them into symbol.children
    //
    //  elements:  a, b, c, d, e, f, g
    //  selected:     b,    d, e
    //  result:    a,    c,    S, f, g
    //  symbol S:     b,    d, e
    return {
      state: {
        selectedElementIds: [symbol.id],
        elements: state.elements
          .filter(
            (element) =>
              !state.selectedElementIds.includes(element.id) ||
              lastChildId === element.id
          )
          .map((element) => {
            if (element.id === lastChildId) {
              return symbol;
            } else {
              return element;
            }
          }),
      },
    };
  },
};

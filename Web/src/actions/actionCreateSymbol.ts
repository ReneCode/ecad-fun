import { Action, ECadSymbolElement } from "../types";
import { randomId } from "../utils/randomId";
import elementWorkerManager from "../elements/ElementWorkerManager";

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

    // if there is no referencePoint-Element in the symbol then we
    // take the lower-left-corder of the bounding box as the referencePoint
    const bbox = elementWorkerManager.getBoundingBox(symbol);
    symbol.refX = bbox.x1;
    symbol.refY = bbox.y1;

    // remove selected elements from state.element and put them into symbol.children
    // symbol S will put at the position of the last symbol.children
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

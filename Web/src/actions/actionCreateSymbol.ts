import { Action, ECadSymbolElement } from "../types";
import { randomId } from "../utils/randomId";
import elementWorkerManager from "../elements/ElementWorkerManager";
import { getElements } from "../elements";

export const actionCreateSymbol: Action = {
  name: "createSymbol",

  execute: ({ state, project }) => {
    if (state.selectedElementIds.length === 0) {
      return;
    }

    const elements = getElements(project);
    const cntSymbols = elements.reduce((acc, e) => {
      if (e.type === "symbol") {
        acc++;
      }
      return acc;
    }, 0);

    const children = elements.filter((element) =>
      state.selectedElementIds.includes(element.id)
    );

    const lastChild = children[children.length - 1];
    const symbol: ECadSymbolElement = {
      id: project.createNewId(),
      _parent: lastChild._parent, // set symbol at same position as last child
      type: "symbol",
      name: `Symbol-${cntSymbols + 1}`,
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
      },
      createObjects: [symbol],
      deleteObjects: children.map((e) => e.id),
    };
  },
};

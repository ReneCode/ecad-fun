import { ECadSymbolRefElement, ECadSymbolElement } from "../types";
import { randomId } from "../utils/randomId";
import { registerAction } from "./registerAction";

// type MyActionState = {
//   symbol: ECadSymbolElement;
//   symbolRef: ECadSymbolRefElement;
// };

export const actionPlaceSymbol = registerAction({
  name: "placeSymbol",

  start: ({ state, elements, params }) => {
    // const symbolId: string = params;
    // const symbol = elements.find(
    //   (e) => e.type === "symbol" && e.id === symbolId
    // ) as ECadSymbolElement;
    const symbol = params as ECadSymbolElement;
    if (!symbol) {
      return;
    }
    const symbolRef: ECadSymbolRefElement = {
      id: randomId(),
      type: "symbolRef",
      x: 100,
      y: 50,
      symbolId: symbol.id,
      symbolName: symbol.name,
      symbol: symbol,
    };
    return {
      state: {
        editingElement: symbolRef,
      },
      actionState: {
        symbolRef,
        symbol,
      },
    };
  },

  pointerMove: ({ state, actionState }) => {
    // const myState: MyActionState = actionState;
    if (state.editingElement) {
      const x = state.pointerX;
      const y = state.pointerY;
      return {
        state: {
          editingElement: {
            ...state.editingElement,
            x,
            y,
          },
        },
      };
    }
  },

  pointerUp: ({ state, elements, actionState }) => {
    if (state.editingElement) {
      return {
        state: {
          editingElement: null,
        },
        elements: [...elements, state.editingElement],
        stopAction: true,
      };
    }
  },
});

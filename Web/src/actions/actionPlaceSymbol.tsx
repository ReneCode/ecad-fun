import { Action, ECadSymbolRefElement, ECadSymbolElement } from "../types";
import { randomId } from "../utils/randomId";

type MyActionState = {
  symbol: ECadSymbolElement;
  symbolRef: ECadSymbolRefElement;
};

export const actionPlaceSymbol: Action = {
  name: "placeSymbol",

  start: ({ state, params }) => {
    const symbolId: string = params;
    const symbol = state.elements.find(
      (e) => e.type === "symbol" && e.id === symbolId
    ) as ECadSymbolElement;
    if (!symbol) {
      return;
    }
    const symbolRef: ECadSymbolRefElement = {
      id: randomId(),
      type: "symbolRef",
      x: 100,
      y: 50,
      symbolId: symbolId,
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

  pointerUp: ({ state, actionState }) => {
    if (state.editingElement) {
      return {
        state: {
          elements: [...state.elements, state.editingElement],
          editingElement: null,
        },
        stopAction: true,
      };
    }
  },
};

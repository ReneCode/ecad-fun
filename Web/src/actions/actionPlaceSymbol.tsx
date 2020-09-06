import { Action, ECadSymbolRefElement, ECadSymbolElement } from "../types";
import { randomId } from "../utils/randomId";

type MyActionState = {
  symbolId: string;
  symbolRef: ECadSymbolRefElement;
};

export const actionPlaceSymbol: Action = {
  name: "placeSymbol",

  start: ({ state, params }) => {
    console.log("placeSymbol:", params);
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
      symbol: symbol,
    };
    return {
      state: {
        editingElement: symbolRef,
      },
      actionState: {
        symbolRef,
      },
    };
  },

  pointerMove: ({ state }) => {
    console.log("pointerMove place symbol");
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
    const as: MyActionState = actionState;

    console.log("pointerup place symbol", as.symbolId, as.symbolRef);

    return {
      state: {
        elements: [...state.elements, as.symbolRef],
      },
      stopAction: true,
    };
  },
};

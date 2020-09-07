import {
  AppState,
  getDefaultAppState,
  ECadBaseElement,
  ECadSymbolRefElement,
  ECadSymbolElement,
  ECadLineElement,
  ECadCircleElement,
} from "../types";
import { debounce } from "../utils";
import { randomId } from "../utils/randomId";

const DELAY_SAVE = 1000;
const LOCAL_STORAGE_STATE_KEY = "ecad-fun-state";

export const saveDebounced = debounce((appState: AppState) => {
  saveToLocalStorage(appState);
}, DELAY_SAVE);

const saveToLocalStorage = (appState: AppState) => {
  try {
    const state = {
      ...appState,
      elements: removeSymbolFromSymbolRef(appState.elements),
    };

    localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error(err);
  }
};

export const loadFromLocalStorage = (): AppState => {
  let state = getDefaultAppState();
  try {
    const json = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    if (json) {
      const state: AppState = JSON.parse(json);
      return {
        ...state,
        elements: addSymbolToSymbolRef(state.elements),
      };
    }
  } catch (err) {
    console.error(err);
  }
  return state;
};

const removeSymbolFromSymbolRef = (
  elements: readonly ECadBaseElement[]
): ECadBaseElement[] => {
  return elements.map((e) => {
    if (e.type === "symbolRef") {
      return {
        ...e,
        symbol: undefined,
      };
    } else {
      return e;
    }
  });
};

const getNotFoundSymbol = () => {
  const l1: ECadLineElement = {
    id: randomId(),
    type: "line",
    x1: -10,
    y1: -10,
    x2: 10,
    y2: 10,
    color: "orange",
  };
  const l2: ECadLineElement = {
    id: randomId(),
    type: "line",
    x1: -10,
    y1: 10,
    x2: 10,
    y2: -10,
    color: "orange",
  };
  const circle: ECadCircleElement = {
    id: randomId(),
    type: "circle",
    x: 0,
    y: 0,
    radius: 10,
    color: "red",
  };

  const symbol: ECadSymbolElement = {
    id: randomId(),
    type: "symbol",
    refX: -10,
    refY: -10,
    children: [l1, l2, circle],
  };
  return symbol;
};

const addSymbolToSymbolRef = (
  elements: readonly ECadBaseElement[]
): ECadBaseElement[] => {
  return elements.map((e) => {
    if (e.type === "symbolRef") {
      const symbolRef = e as ECadSymbolRefElement;
      let symbol = elements.find(
        (e) => e.type === "symbol" && e.id === symbolRef.symbolId
      );
      if (!symbol) {
        console.error(`symbol: ${symbolRef.symbolId} not found`);
      }
      return {
        ...symbolRef,
        symbol: symbol ? symbol : getNotFoundSymbol(),
      };
    } else {
      return e;
    }
  });
};

import {
  AppState,
  getDefaultAppState,
  ECadBaseElement,
  ECadSymbolRefElement,
} from "../types";
import { debounce } from "../utils";
import { getNotFoundSymbol } from "../elements/notFoundSymbol";

const DELAY_SAVE = 1000;
const LOCAL_STORAGE_STATE_KEY = "ecad-fun-state";

export const saveDebounced = debounce((appState: AppState) => {
  saveToLocalStorage(appState);
}, DELAY_SAVE);

const saveToLocalStorage = (appState: AppState) => {
  try {
    const state = cleanupAppStateForExport(appState);

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

export const cleanupAppStateForExport = (appState: AppState): AppState => {
  return {
    ...appState,
    elements: removeSymbolFromSymbolRef(appState.elements),
  };
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

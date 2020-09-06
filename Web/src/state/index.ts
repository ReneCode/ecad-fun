import {
  AppState,
  getDefaultAppState,
  ECadBaseElement,
  ECadSymbolRefElement,
} from "../types";
import { debounce } from "../utils";

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

const addSymbolToSymbolRef = (
  elements: readonly ECadBaseElement[]
): ECadBaseElement[] => {
  return elements.map((e) => {
    if (e.type === "symbolRef") {
      const symbolRef = e as ECadSymbolRefElement;
      return {
        ...symbolRef,
        symbol: elements.find(
          (e) => e.type === "symbol" && e.id === symbolRef.symbolId
        ),
      };
    } else {
      return e;
    }
  });
};

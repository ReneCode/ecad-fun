import {
  AppState,
  getDefaultAppState,
  ECadBaseElement,
  ECadSymbolRefElement,
} from "../types";
import { debounce } from "../utils";
import { getNotFoundSymbol } from "../elements/notFoundSymbol";

const DELAY_SAVE = 1000;
const LOCAL_STORAGE_STATE_KEY = "ecad-state";
const LOCAL_STORAGE_ELEMENTS_KEY = "ecad-elements";

export const saveDebounced = debounce(
  (state: AppState, elements: readonly ECadBaseElement[]) => {
    saveToLocalStorage(state, elements);
  },
  DELAY_SAVE
);

const saveToLocalStorage = (
  state: AppState,
  elements: readonly ECadBaseElement[]
) => {
  try {
    const cleanedElements = cleanupElementsForExport(elements);

    localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(state));
    localStorage.setItem(
      LOCAL_STORAGE_ELEMENTS_KEY,
      JSON.stringify(cleanedElements)
    );
  } catch (err) {
    console.error(err);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const jsonState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    const jsonElements = localStorage.getItem(LOCAL_STORAGE_ELEMENTS_KEY);

    let state: AppState = getDefaultAppState();
    if (jsonState) {
      state = JSON.parse(jsonState);
    }
    let elements = [];
    if (jsonElements) {
      elements = JSON.parse(jsonElements);
    }
    return {
      state,
      elements: addSymbolToSymbolRef(elements),
    };
  } catch (err) {
    console.error(err);
    return {
      state: getDefaultAppState(),
      elements: [],
    };
  }
};

export const cleanupElementsForExport = (
  elements: readonly ECadBaseElement[]
): readonly ECadBaseElement[] => {
  return removeSymbolFromSymbolRef(elements);
};

export const removeSymbolFromSymbolRef = (
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

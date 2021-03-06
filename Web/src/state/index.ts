import {
  AppState,
  getDefaultAppState,
  ECadBaseElement,
  ECadSymbolRefElement,
  ECadSymbolElement,
} from "../types";
import { debounce } from "../utils";
import { getNotFoundSymbol } from "../elements/notFoundSymbol";
import { Project } from "../share";

const DELAY_SAVE = 1000;
const LOCAL_STORAGE_STATE_KEY = "ecad-state";
const LOCAL_STORAGE_PROJECT_KEY = "ecad-project";

export const saveDebounced = debounce((state: AppState, project: Project) => {
  saveToLocalStorage(state, project);
}, DELAY_SAVE);

const saveToLocalStorage = (state: AppState, project: Project) => {
  try {
    // const cleanedElements = cleanupElementsForExport(project);

    localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(state));
    localStorage.setItem(
      LOCAL_STORAGE_PROJECT_KEY,
      JSON.stringify(project.save())
    );
  } catch (err) {
    console.error(err);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const jsonState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    const jsonObjects = localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY);

    let state: AppState = getDefaultAppState();
    if (jsonState) {
      state = JSON.parse(jsonState);
    }
    let elements = [];
    if (jsonObjects) {
      elements = JSON.parse(jsonObjects);
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

export const addSymbolToSymbolRef = (
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

export const fixElementData = (elements: readonly ECadBaseElement[]) => {
  return elements.map((e) => {
    if (e.type === "symbol") {
      const symbol = e as ECadSymbolElement;
      symbol.refX = symbol.refX ? symbol.refX : 0;
      symbol.refY = symbol.refY ? symbol.refY : 0;
    }
    return e;
  });
};

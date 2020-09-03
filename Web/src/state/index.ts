import { AppState, getDefaultAppState } from "../types";
import { debounce } from "../utils";

const DELAY_SAVE = 1000;
const LOCAL_STORAGE_STATE_KEY = "ecad-fun-state";

export const saveDebounced = debounce((appState: AppState) => {
  saveToLocalStorage(appState);
}, DELAY_SAVE);

const saveToLocalStorage = (appState: AppState) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(appState));
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
      return state;
    }
  } catch (err) {
    console.error(err);
  }
  return state;
};

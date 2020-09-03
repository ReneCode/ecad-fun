import { AppState } from "../types";
import { debounce } from "../utils";

const DELAY_SAVE = 1000;
const LOCAL_STORAGE_KEY = "ecad.fun";

export const saveDebounced = debounce((appState: AppState) => {
  saveToLocalStorage(appState);
}, DELAY_SAVE);

const saveToLocalStorage = (appState: AppState) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
  } catch (err) {
    console.error(err);
  }
};

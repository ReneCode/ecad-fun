import { Action } from "overmind";

export const setName: Action<string> = ({ state }, value) => {
  state.canvas.name = value;
};

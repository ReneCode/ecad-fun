import { ECadCircleElement, Action } from "../types";
import { distancePointToPoint } from "../utils/geometric";
import { randomId } from "../utils/randomId";

export const actionCreateSymbol: Action = {
  name: "createSymbol",

  execute: ({ state }) => {},
};

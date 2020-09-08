import {
  ECadLineElement,
  ECadCircleElement,
  ECadSymbolElement,
  ECadRectangleElement,
} from "../types";
import { randomId } from "../utils/randomId";

const createNotFoundSymbol = () => {
  const l1: ECadLineElement = {
    id: randomId(),
    type: "line",
    x1: -7,
    y1: -7,
    x2: 7,
    y2: 7,
    color: "white",
  };
  const l2: ECadLineElement = {
    id: randomId(),
    type: "line",
    x1: -7,
    y1: 7,
    x2: 7,
    y2: -7,
    color: "white",
  };
  const c1: ECadCircleElement = {
    id: randomId(),
    type: "circle",
    x: 0,
    y: 0,
    radius: 5,
    color: "red",
  };
  const r1: ECadRectangleElement = {
    id: randomId(),
    type: "rectangle",
    x1: -7,
    y1: -7,
    x2: 7,
    y2: 7,
    color: "red",
  };
  const symbol: ECadSymbolElement = {
    id: randomId(),
    type: "symbol",
    name: "not-found-symbol",
    refX: -10,
    refY: -10,
    children: [l1, l2, c1, r1],
  };
  return symbol;
};

let notFoundSymbol: ECadSymbolElement | undefined = undefined;

export const getNotFoundSymbol = () => {
  if (!notFoundSymbol) {
    notFoundSymbol = createNotFoundSymbol();
  }
  return notFoundSymbol;
};

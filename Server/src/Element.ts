import { BaseElement } from "./types";

const copyToNewElement = (data: BaseElement) => {
  switch (data.type) {
    case "project":
    case "page":
    case "line":
    case "arc":
      break;
    default:
      throw new Error(`bad element type:${data.type}`);
  }
  return {
    ...data,
  } as BaseElement;
};

const createElement = (data: BaseElement) => {
  const element = copyToNewElement(data);
  return element;
};

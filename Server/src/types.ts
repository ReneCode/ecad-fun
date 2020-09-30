export type ElementType = "project" | "page" | "device" | "line" | "arc";

export type BaseElement = {
  type?: ElementType;
  id: string;
  [index: string]: unknown;
};

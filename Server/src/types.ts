export type ElementType = "project" | "page" | "device" | "line" | "arc";

export type BaseElement = {
  type?: ElementType;
  id: string;
  [index: string]: unknown;
};

// export type ChangeElement = { id: string; [index: string]: unknown };
export type ChangeDataType = {
  type: "create" | "update" | "delete";
  element: BaseElement;
};

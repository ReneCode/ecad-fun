export type ObjectType = { id: string; [index: string]: unknown };

export type ChangeDataType = {
  type: "create" | "update" | "delete";
  obj: ObjectType;
};

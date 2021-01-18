export type ObjectType = Record<string, unknown> & {
  id: string;
  _parent?: string;
  _children?: readonly ObjectType[];
};

export type CUDType =
  | {
      type: "create";
      data: ObjectType[];
    }
  | {
      type: "update";
      data: ObjectType[];
      oldDataForUndo?: ObjectType[];
    }
  | {
      type: "delete";
      data: string[];
    };

// /**
//  * @description
//  *  c = create
//  *  u = update
//  *  d = delete
//  */
// export type ChangeObjectType = {
//   c?: ObjectType;
//   u?: ObjectType;
//   d?: string;
// };

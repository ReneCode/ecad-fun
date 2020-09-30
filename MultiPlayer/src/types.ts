export type ObjectType = Record<string, unknown> & {
  id: string;
  _parent?: string;
  _children?: readonly ObjectType[];
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

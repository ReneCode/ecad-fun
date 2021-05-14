import { EditLogType, INode } from "./ecadfun.d";

type addEditDataType = (data: EditLogType) => void;

const getHandler = <T extends INode>(addEditData: addEditDataType) => {
  return {
    get: (arc: T, prop: string | symbol, target: any) => {
      return Reflect.get(arc, prop, target);
    },
    set: (target: T, prop: string | symbol, value: any) => {
      if (prop === "id") {
        return false;
      }
      const updates: any = { id: target.id };
      // HACK cast symbol as string
      updates[prop as string] = value;
      addEditData({
        a: "u",
        n: updates,
      });
      return Reflect.set(target, prop, value);
    },
  };
};

class NodeProxy {
  public static create<T extends INode>(
    target: T,
    addEditData: addEditDataType
  ) {
    return new Proxy(target, getHandler<T>(addEditData));
  }
}

export { NodeProxy };

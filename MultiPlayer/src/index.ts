import { Project } from "./Project";
import { ObjectType } from "./types";

export { ObjectType, Project };

export const Greeter = (name: string) => `Hello ${name}`;

/*
import { findexAfter, findexBetween } from "./findex";

export type ObjectType = Record<string, unknown> & {
  id: string;
  _parent?: string;
  _children?: readonly ObjectType[];
};

type EventHandler = (...params: any) => void;

const splitParentProperty = (propValue: string) => {
  const [parentId, fIndex] = propValue.split("-");
  if (!parentId || !fIndex) {
    throw new Error(`splitParentProperty: bad propValue: ${propValue}`);
  }
  return [parentId, fIndex];
};

const combineParentProperty = (parentId: string, fIndex: string) => {
  if (!parentId || !fIndex) {
    throw new Error(
      `setParentProperty: bad parts: parentId: ${parentId} fIndex: ${fIndex}`
    );
  }
  const propValue = `${parentId}-${fIndex}`;
  return propValue;
};

const mergeIntoArray = (
  children: readonly ObjectType[] | undefined,
  obj: ObjectType,
  fIndex: string
): { arr: readonly ObjectType[]; fIndex: string } => {
  if (!children) {
    return { arr: [obj], fIndex };
  }

  // search where to insert me as a addition child
  const idx = children.findIndex((c) => {
    const [_, fidx] = splitParentProperty(c._parent as string);
    return fIndex <= fidx;
  });
  if (idx < 0) {
    // all children have lower fIndex
    return { arr: [...children, obj], fIndex };
  }

  const child = children[idx];
  const [_, childfIndex] = splitParentProperty(child._parent as string);

  if (childfIndex === fIndex) {
    // oops - fIndex allread used
    // apppend after the found child
    let newfIndex = "";
    if (idx + 1 === children.length) {
      // append to the end
      newfIndex = findexAfter(childfIndex);
      return { arr: [...children, obj], fIndex: newfIndex };
    } else {
      // in the middle
      const nextChild = children[idx + 1];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [__, nextChildfIndex] = splitParentProperty(
        nextChild._parent as string
      );
      newfIndex = findexBetween(fIndex, nextChildfIndex);
      return {
        arr: [...children.slice(0, idx + 1), obj, ...children.slice(idx + 1)],
        fIndex: newfIndex,
      };
    }
  } else {
    return {
      arr: [...children.slice(0, idx), obj, ...children.slice(idx)],
      fIndex,
    };
  }
};

class Dispatcher<T> {
  private eventHandlers: {
    type: T;
    handler: EventHandler;
  }[] = [];

  // returns function to unsubscribe
  subscribe(type: T, handler: EventHandler): () => void {
    this.eventHandlers.push({ type, handler });
    return () => {
      this.eventHandlers = this.eventHandlers.filter((eh) => {
        return !(eh.type === type && eh.handler === handler);
      });
    };
  }

  dispatch(type: T, ...params: any) {
    let handled = false;
    const eventHandlers = [...this.eventHandlers];
    for (let eh of eventHandlers) {
      if (eh.type === type) {
        try {
          handled = true;
          eh.handler(...params);
        } catch (ex) {
          // if DEBUG
          console.error(new Error(`Exception on dispatching event: ${type}`));
          throw ex;
          // if RELEASE
          // console.error(
          //   `Exception on dispatching Event: ${type} + ${payload} to ${
          //     eh.handler
          //   }`,
          // );
        }
      }
    }
    if (!handled) {
      // console.warn("no appEventHandler found for:", type);
    }
  }
}

export class Project {
  private id: string;
  private name: string;
  private objects: Record<string, ObjectType> = {};
  private root: ObjectType;
  private dispatcher = new Dispatcher<string>();

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;

    const root = { id: "0:0", _type: "project" };
    this.addObject(root);
    this.root = root;
  }

  public getRoot() {
    return this.root;
  }

  createObject(o: ObjectType) {
    const obj = this.cloneObject(o);
    this.applyParentProperty(obj);
    this.addObject(obj);

    const result = this.getObject(obj.id);
    this.dispatcher.dispatch("create-object", result);
    return result;
  }

  updateObject(o: ObjectType) {
    const currentObject = this.getObject(o.id);
    if (!currentObject) {
      throw new Error(`object with id ${o.id} does not exist`);
    }

    const obj = this.cloneObject(o);
    for (const key of Object.keys(obj)) {
      if (key === "_id") {
      } else if (key === "_parent") {
        this.removeFromCurrentParent(currentObject);
        (currentObject as any)[key] = (obj as any)[key];
        this.applyParentProperty(currentObject);
      } else {
        (currentObject as any)[key] = (obj as any)[key];
      }
    }

    const result = this.getObject(obj.id);
    this.dispatcher.dispatch("update-object", result);
    return result;
  }

  public deleteObject(id: string) {
    const currentObject = this.getObject(id);
    if (!currentObject) {
      return;
    }

    if (currentObject._parent) {
      this.removeFromCurrentParent(currentObject);
    }
    // delete also the children
    if (currentObject._children) {
      for (const child of currentObject._children) {
        this.deleteObject(child.id);
      }
    }
    delete this.objects[id];
    this.dispatcher.dispatch("delete-object", id);
  }

  public getObject(id: string) {
    return this.objects[id];
  }

  // public changeObject(changeObjects: ChangeObjectType[]) {
  //   // collect dispatch
  //   // apply each changeObject
  //   // dispatch collectedDispatch

  //   const results = [];
  //   for (const change of changeObjects) {
  //     if (change.c) {
  //       results.push({ c: this.createObject(change.c) });
  //     } else if (change.d) {
  //       results.push({ d: this.deleteObject(change.d) });
  //     } else if (change.u) {
  //       results.push({ u: this.updateObject(change.u) });
  //     }
  //   }

  //   this.dispatcher.dispatch("change-object", results);
  // }

  public subscribe(type: string, handler: (...params: any) => void) {
    this.dispatcher.subscribe(type, handler);
  }
  // -----------------------------------------------------

  private cloneObject(o: ObjectType): ObjectType {
    return { ...o };
  }

  private applyParentProperty(obj: ObjectType) {
    if (!obj._parent) {
      return;
    }
    const [parentId, fIndex] = splitParentProperty(obj._parent);
    const parent = this.getObject(parentId);
    if (!parent) {
      throw new Error(`parent with id:${parentId} does not exist`);
    }
    const { arr, fIndex: changedFIndex } = mergeIntoArray(
      parent._children,
      obj,
      fIndex
    );
    parent._children = arr;
    if (changedFIndex !== fIndex) {
      obj._parent = combineParentProperty(parentId, changedFIndex);
    }
  }

  private removeFromCurrentParent(obj: ObjectType) {
    if (!obj._parent) {
      throw new Error(
        `_parent property missing on object with id:${obj._parent} `
      );
    }
    const [parentId, _] = splitParentProperty(obj._parent);
    const currentParent = this.getObject(parentId);
    if (!currentParent) {
      throw new Error(`parent with id:${currentParent} does not exist`);
    }

    currentParent._children = currentParent._children?.filter(
      (c) => c.id !== obj.id
    );
  }

  private addObject(obj: ObjectType) {
    if (this.objects[obj.id]) {
      throw new Error(`object with id ${obj.id} allready exists`);
    }
    this.objects[obj.id] = obj;
  }
}
*/

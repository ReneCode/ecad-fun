import { deepCopy } from "./deepCopy";
import { Dispatcher } from "./Dispatcher";
import { ObjectType } from "./types";
import {
  combineParentProperty,
  makeArray,
  mergeIntoArray,
  splitParentProperty,
} from "./utils";

const DEFAULT_CLIENTID = "0";

export class Project {
  public readonly id: string;

  private objects: Record<string, ObjectType> = {};
  private root: ObjectType;
  private dispatcher = new Dispatcher();
  private clientId: string = DEFAULT_CLIENTID;
  private lastObjectIndex: number = 0;

  constructor(id: string) {
    this.id = id;

    const root = { id: "0:0", projectId: id, _type: "project" };
    this.clientId = DEFAULT_CLIENTID;
    this.lastObjectIndex = 0; // 0 is allready used
    this.addObject(root);
    this.root = root;
  }

  public setClientId(clientId: number) {
    if (this.clientId !== DEFAULT_CLIENTID) {
      throw new Error("clientId can only be set once");
    }
    this.clientId = `${clientId}`;
    this.lastObjectIndex = -1;
  }

  public traverse(o: ObjectType, callback: (o: ObjectType) => void) {
    callback(o);
    if (o._children) {
      for (const child of o._children) {
        this.traverse(child, callback);
      }
    }
  }

  public getRoot() {
    return this.root;
  }

  public setRoot(root: ObjectType) {
    this.root = deepCopy(root);

    // set objects-map
    this.objects = {};
    this.traverse(this.root, (o) => {
      this.addObject(o);
    });
  }

  public createNewId() {
    return `${this.clientId}:${++this.lastObjectIndex}`;
  }

  public createObjects(os: ObjectType[]): ObjectType[] {
    for (let o of os) {
      if (!o.id) {
        throw new Error("id missing");
      }
    }

    const results = [];
    for (let o of os) {
      const obj = this.cloneObject(o);
      delete obj._children;
      this.applyParentProperty(obj);
      this.addObject(obj);
      results.push(this.getObject(obj.id));
    }

    this.dispatcher.dispatch("create-object", results);
    return results;
  }

  public updateObjects(os: ObjectType[]) {
    const todos: { current: ObjectType; update: ObjectType }[] = [];
    for (let o of os) {
      if (!o.id) {
        throw new Error("id missing");
      }

      const currentObject = this.getObject(o.id);
      if (!currentObject) {
        throw new Error(`object with id ${o.id} does not exist`);
      }
      todos.push({
        current: currentObject,
        update: o,
      });
    }

    const results: ObjectType[] = [];
    for (let { current, update } of todos) {
      // apply changes
      const copyUpdate = this.cloneObject(update);
      for (const key of Object.keys(update)) {
        if (key === "id") {
          // id will stay unchanged
        } else if (key === "_parent") {
          this.removeFromCurrentParent(current);
          (current as any)[key] = (update as any)[key];
          this.applyParentProperty(current);
        } else {
          (current as any)[key] = (update as any)[key];
        }
      }
      results.push(copyUpdate);
    }

    this.dispatcher.dispatch("update-object", results);
    return results;
  }

  public deleteObjects(ids: string[]) {
    for (let id of ids) {
      const currentObject = this.getObject(id);
      if (currentObject) {
        this.traverse(currentObject, (o) => {
          if (o._parent) {
            this.removeFromCurrentParent(currentObject);
          }
          delete this.objects[o.id];
        });
      }
    }
    this.dispatcher.dispatch("delete-object", ids);
    return ids;
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

  validateCreateObjectId(id: string) {
    const [clientId, index] = id.split(":");
    if (this.clientId != DEFAULT_CLIENTID && this.clientId !== clientId) {
      return false;
    }
    return true;
  }

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
    // update lastObjectIndex on *my* clientId
    const [clientId, index] = obj.id.split(":");
    if (clientId === this.clientId) {
      const foundIndex = parseInt(index);
      this.lastObjectIndex = Math.max(this.lastObjectIndex, foundIndex);
    }

    this.objects[obj.id] = obj;
  }
}

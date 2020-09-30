import { deepCopy } from "./deepCopy";
import { Dispatcher } from "./Dispatcher";
import { ObjectType } from "./types";
import {
  combineParentProperty,
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

  public createObject(o: ObjectType) {
    if (!o.id) {
      throw new Error("id missing");
    }
    // if (!this.validateCreateObjectId(o.id)) {
    //   throw new Error(`bad objectId ${o.id}`);
    // }

    const obj = this.cloneObject(o);
    delete obj._children;
    this.applyParentProperty(obj);
    this.addObject(obj);

    const result = this.getObject(obj.id);
    this.dispatcher.dispatch("create-object", result);
    return result;
  }

  public updateObject(o: ObjectType) {
    if (!o.id) {
      throw new Error("id missing");
    }

    const currentObject = this.getObject(o.id);
    if (!currentObject) {
      throw new Error(`object with id ${o.id} does not exist`);
    }

    const obj = this.cloneObject(o);
    // apply changes
    for (const key of Object.keys(obj)) {
      if (key === "id") {
        // id will stay unchanged
      } else if (key === "_parent") {
        this.removeFromCurrentParent(currentObject);
        (currentObject as any)[key] = (obj as any)[key];
        this.applyParentProperty(currentObject);
      } else {
        (currentObject as any)[key] = (obj as any)[key];
      }
    }

    this.dispatcher.dispatch("update-object", obj);
    return obj;
  }

  public deleteObject(id: string) {
    if (!id) {
      throw new Error("id missing");
    }

    const currentObject = this.getObject(id);
    if (currentObject) {
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
    return id;
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

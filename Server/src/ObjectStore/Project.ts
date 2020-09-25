import { ChangeObjectType, ObjectType } from "./types";
import {
  combineParentProperty,
  mergeIntoArray,
  splitParentProperty,
} from "./utils";

export class Project {
  private id: string;
  private name: string;
  private objects: Record<string, ObjectType> = {};
  private root: ObjectType;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;

    const root = { _id: "0:0", _type: "project" };
    this.addObject(root);
    this.root = root;
  }

  public getRoot() {
    return this.root;
  }

  createObject(obj: ObjectType) {
    this.applyParentProperty(obj);
    this.addObject(obj);
    const createdObject = this.getObject(obj._id);
    this.dispatch("create-object", createdObject);
    return createdObject;
  }

  updateObject(obj: ObjectType) {
    const currentObject = this.getObject(obj._id);
    if (!currentObject) {
      throw new Error(`object with id ${obj._id} does not exist`);
    }

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

    const updatedObject = this.getObject(obj._id);
    this.dispatch("update-object", updatedObject);
    return updatedObject;
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
        this.deleteObject(child._id);
      }
    }
    delete this.objects[id];
    this.dispatch("delete-object", id);
  }

  public getObject(id: string) {
    return this.objects[id];
  }

  public changeObjects(changeObjects: ChangeObjectType[]) {
    // collect dispatch
    // apply each changeObject
    // dispatch collectedDispatch
  }

  // -----------------------------------------------------

  private dispatch(type: string, data: any) {
    // TODO dispatch to webSocket, so REST calls will be reflected to webSocket
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
      (c) => c._id !== obj._id
    );
  }

  private addObject(obj: ObjectType) {
    if (this.objects[obj._id]) {
      throw new Error(`object with id ${obj._id} allready exists`);
    }
    this.objects[obj._id] = obj;
  }
}

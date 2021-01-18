import { deepCopy } from "./deepCopy";
import { Dispatcher } from "./Dispatcher";
import { CUDType, ObjectType } from "./types";
import { UndoRedo } from "./UndoRedo";
import {
  appendToArray,
  combineParentProperty,
  mergeIntoArray,
  splitParentProperty,
} from "./utils";

const DEFAULT_CLIENTID = "0";
const ROOT_ID = "0:0";

export type CUROptions = {
  withUndo?: boolean;
  oldDataForUndo?: ObjectType[];
};

type QueryParams = {
  depth?: number;
  rootId?: string;
  rootObj?: ObjectType;
  q: { prop: string; value: any }[];
};

export class Project {
  public readonly id: string;

  private undoRedo?: UndoRedo;

  private dirty: boolean = false;
  private objects: Record<string, ObjectType> = {};
  private root: ObjectType;
  private dispatcher = new Dispatcher();
  private clientId: string = DEFAULT_CLIENTID;
  private lastObjectIndex: number = 0;

  constructor(id: string, options?: { undoRedo: boolean }) {
    this.id = id;
    if (options) {
      this.undoRedo = new UndoRedo();
    }

    const root = { id: ROOT_ID, projectId: id, _type: "project" };
    this.clientId = DEFAULT_CLIENTID;
    this.lastObjectIndex = 0; // 0 is allready used
    this.addObject(root);
    this.root = root;
  }

  public getAndClearDirty() {
    const dirty = this.dirty;
    this.dirty = false;
    return dirty;
  }

  public createNewId() {
    return `${this.clientId}:${++this.lastObjectIndex}`;
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

  public query(params: QueryParams) {
    let qObj = params.rootObj;
    if (!qObj) {
      const rootId = params.rootId ? params.rootId : ROOT_ID;
      qObj = this.getObject(rootId);
    }

    if (!qObj) {
      return [];
    }

    let valid = true;
    for (let qe of params.q) {
      if (qObj[qe.prop] !== qe.value) {
        valid = false;
        break;
      }
    }

    let result: ObjectType[] = [];
    if (valid) {
      result.push(qObj);
    }

    const depth = params.depth !== undefined ? params.depth : 1;
    if (depth > 0) {
      if (qObj._children) {
        result = qObj._children.reduce((acc, childObj) => {
          const childQueryResult = this.query({
            rootObj: childObj,
            q: params.q,
            depth: depth - 1,
          });
          return acc.concat(childQueryResult);
        }, result);
      }
    }

    return result;
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

  public doCUD(cud: CUDType[], options?: { withUndo: boolean }) {
    const withUndo = this.undoRedo && (options ? options.withUndo : true);
    cud.forEach((cud) => {
      switch (cud.type) {
        case "create":
          {
            const result = this.internalCreateObjects(cud.data);
            if (withUndo) {
              this.undoRedo?.createObjects(cud.data);
            }
          }
          break;

        case "update":
          {
            const result = this.internalUpdateObject(cud.data);
            if (withUndo) {
              if (cud.oldDataForUndo) {
                const oldIds = cud.oldDataForUndo.map((o) => o.id).sort();
                const updateIds = cud.data.map((o) => o.id).sort();
                let ok = true;
                if (oldIds.length != updateIds.length) {
                  ok = false;
                }
                for (let i = 0; i < updateIds.length; i++) {
                  if (updateIds[i] !== oldIds[i]) {
                    ok = false;
                  }
                }

                if (!ok) {
                  throw new Error("bad oldDataForUndo on update");
                }
                this.undoRedo?.updateObjects(cud.oldDataForUndo, cud.data);
              } else {
                this.undoRedo?.updateObjects(result, cud.data);
              }
            }
          }
          break;

        case "delete":
          {
            const result = this.internalDeleteObjects(cud.data);
            if (withUndo) {
              this.undoRedo?.deleteObjects(result);
            }
          }
          break;

        default:
          throw new Error(`bad cudType: ${(cud as any).type}`);
      }
    });
    return cud;
  }

  public createObjects(objects: ObjectType[]): ObjectType[] {
    const results = this.internalCreateObjects(objects);

    this.dispatcher.dispatch("create-object", results);

    if (this.undoRedo) {
      this.undoRedo.createObjects(results);
    }
    return results;
  }

  public updateObjects(
    newObjects: ObjectType[],
    options: CUROptions | undefined = { withUndo: true }
  ) {
    const oldObjects = this.internalUpdateObject(newObjects);
    this.dispatcher.dispatch("update-object", newObjects);

    if (options && options.withUndo && this.undoRedo) {
      if (options.oldDataForUndo) {
        // the old data is set by options (dynamic move action)
        // TODO check if oldData has the same .id
        this.undoRedo.updateObjects(options.oldDataForUndo, newObjects);
      } else {
        this.undoRedo.updateObjects(oldObjects, newObjects);
      }
    }
    return oldObjects;
  }

  public deleteObjects(ids: string[]) {
    const results = this.internalDeleteObjects(ids);
    if (this.undoRedo) {
      this.undoRedo.deleteObjects(results);
    }

    const deletedIds = results.map((o) => o.id);
    this.dispatcher.dispatch("delete-object", deletedIds);
    return deletedIds;
  }

  public getObject(id: string) {
    return this.objects[id];
  }

  public subscribe(type: string, handler: (...params: any) => void) {
    this.dispatcher.subscribe(type, handler);
  }

  public save(): readonly ObjectType[] {
    const result: ObjectType[] = [];
    for (let o of Object.values(this.objects)) {
      const clone = { ...o };
      delete clone._children;
      result.push(clone);
    }
    return result;
  }

  public load(objects: readonly ObjectType[]) {
    this.objects = {};
    for (let src of objects) {
      const obj = deepCopy(src);
      if (obj.id === ROOT_ID) {
        this.root = obj;
      }
      this.addObject(obj);
      if (obj._parent) {
        this.applyParentProperty(obj);
      }
    }
  }

  public undo() {
    if (!this.undoRedo) {
      throw new Error("undoRedo not activated");
    }
    const todos = this.undoRedo.undo();
    // todos.forEach((todo) => this.internalCUD(todo));
    return todos;
  }

  public redo() {
    if (!this.undoRedo) {
      throw new Error("undoRedo not activated");
    }
    const todos = this.undoRedo.redo();
    // todos.forEach((todo) => this.internalCUD(todo));
    return todos;
  }

  // -----------------------------------------------------

  private internalCUD({ type, data }: CUDType) {
    switch (type) {
      case "create":
        return this.internalCreateObjects(data as ObjectType[]);

      case "update":
        return this.internalUpdateObject(data as ObjectType[]);

      case "delete":
        return this.internalDeleteObjects(data as string[]);

      default:
        throw new Error(`internalCUD: bad type:${type}`);
    }
  }

  private internalCreateObjects(objects: ObjectType[]): ObjectType[] {
    for (let obj of objects) {
      if (!obj.id) {
        throw new Error("id missing");
      }
    }

    this.dirty = true;

    const results: ObjectType[] = [];
    for (let o of objects) {
      const obj = this.cloneObject(o);
      delete obj._children;
      this.applyParentProperty(obj);
      this.addObject(obj);
      results.push(this.getObject(obj.id));
    }
    return results;
  }

  public internalUpdateObject(os: ObjectType[]) {
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

    this.dirty = true;

    const results: ObjectType[] = [];
    for (let { current, update } of todos) {
      const oldChanges = { id: current.id };
      // const copyUpdate = this.cloneObject(update);
      for (const key of Object.keys(update)) {
        if (key === "id") {
          // id will stay unchanged
        } else if (key === "_parent") {
          this.removeFromCurrentParent(current);
          (oldChanges as any)[key] = (current as any)[key];
          (current as any)[key] = (update as any)[key];
          this.applyParentProperty(current);
        } else {
          (oldChanges as any)[key] = (current as any)[key];
          (current as any)[key] = (update as any)[key];
        }
      }
      // results.push(copyUpdate);
      results.push(oldChanges);
    }
    return results;
  }

  public internalDeleteObjects(ids: string[]) {
    this.dirty = true;
    const result = [];
    for (let id of ids) {
      const currentObject = this.getObject(id);
      if (currentObject) {
        result.push(currentObject);
        this.traverse(currentObject, (o) => {
          if (o._parent) {
            this.removeFromCurrentParent(currentObject);
          }
          delete this.objects[o.id];
        });
      }
    }
    return result;
  }

  private validateCreateObjectId(id: string) {
    const [clientId, index] = id.split(":");
    if (this.clientId !== DEFAULT_CLIENTID && this.clientId !== clientId) {
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

    if (!fIndex) {
      // without fIndex append add the end of parent._children
      const { arr, fIndex: newFIndex } = appendToArray(parent._children, obj);
      parent._children = arr;
      obj._parent = combineParentProperty(parentId, newFIndex);
    } else {
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

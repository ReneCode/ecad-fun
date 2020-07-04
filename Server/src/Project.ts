import { ChangeDataType, ObjectType } from "./types";
import debug from "debug";

const projectDebug = debug("project");

class Project {
  private id: string;
  private objects: Record<string, ObjectType> = {};

  constructor(id: string) {
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public getObjects() {
    return this.objects;
  }

  public async changeData(changes: ChangeDataType[]) {
    try {
      this.transactionStart();

      for (let change of changes) {
        switch (change.type) {
          case "create":
            this.objectCreate(change.obj);
            break;
          case "delete":
            this.objectDelete(change.obj);
            break;
          case "update":
            this.objectUpdate(change.obj);
            break;
          default:
            projectDebug(`bad change type:${change.type}`);
        }
      }

      this.transactionCommit();

      return true;
    } catch (err) {
      projectDebug(`Exception changeData:${err}`);
      return false;
    }
  }
  // ---------------------

  private objectCreate(obj: ObjectType) {
    if (this.objects[obj.id]) {
      throw new Error(`Object to create does already exists. id:${obj.id}`);
    }
    this.objects[obj.id] = this.copyObject(obj);
  }

  private objectDelete(obj: ObjectType) {
    if (!this.objects[obj.id]) {
      throw new Error(`Object to delete does not exist. id:${obj.id} `);
    }
    delete this.objects[obj.id];
  }

  private objectUpdate(src: ObjectType) {
    const obj = this.objects[src.id];
    if (!obj) {
      throw new Error(`Object to update does not exist. id:${src.id} `);
    }
    for (const key of Object.keys(src)) {
      obj[key] = src[key];
    }
  }

  private copyObject(src: ObjectType): any {
    const obj: Record<string, any> = {};
    for (const key of Object.keys(src)) {
      obj[key] = src[key];
    }
    return obj;
  }

  private transactionStart() {}

  private transactionCommit() {}
}

export default Project;

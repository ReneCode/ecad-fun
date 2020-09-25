import { ChangeDataType, BaseElement } from "../types";
import { randomId } from "../utils/randomId";

import debug from "debug";

const projectDebug = debug("project");

type transactionType = { changes: { old: BaseElement; new: BaseElement }[] };

class ProjectStore {
  private id: string;
  private elements: Record<string, BaseElement> = {};
  private root: BaseElement;

  constructor(name: string) {
    this.id = randomId();
    this.root = { type: "project", id: "0:0", name: name };
  }

  static load(projectId: string): ProjectStore {
    // load a file
    // re-organize the fIndex of children[]
    throw new Error("Project.load");
  }

  // public load(path: string) {
  //   this.elements = {};
  //   this.root = { id: "0:0" };
  // }

  // public save(path: string) {}

  public getElements() {
    return this.elements;
  }

  public async pull(
    filter: {
      type: string;
      [index: string]: any;
    } = { type: "project" }
  ) {
    return Object.values(this.elements).filter((ele) => {
      const takeElement = Object.keys(filter).reduce(
        (acc, key) => acc && filter[key] === ele[key],
        true
      );
      return takeElement;
    });
  }

  public async push(changes: ChangeDataType[]) {
    try {
      const transaction = this.transactionStart();

      // if (this.canChangeData(changes)) {
      for (let change of changes) {
        switch (change.type) {
          case "create":
            this.create(change.element);
            break;
          case "delete":
            this.delete(change.element);
            break;
          case "update":
            this.update(change.element);
            break;
          default:
            projectDebug(`bad change type:${change.type}`);
        }
      }
      // }

      this.transactionCommit();

      return true;
    } catch (err) {
      projectDebug(`Exception changeData:${err}`);
      return false;
    }
  }
  // ---------------------

  private getElement(id: string) {
    return this.elements[id];
  }

  private canChangeData(changes: ChangeDataType[]) {
    for (let change of changes) {
      const element = change.element;
      switch (change.type) {
        case "create":
          if (!element.id || this.getElement(element?.id)) {
            return false;
          }
          break;
        case "delete":
        case "update":
          if (!this.getElement(element?.id)) {
            return false;
          }
          break;
        default:
          projectDebug(`bad change type:${change.type}`);
          return false;
      }
    }
    return false;
  }

  private create(ele: BaseElement) {
    if (this.getElement(ele.id)) {
      throw new Error(`Element to create does already exists. id:${ele.id}`);
    }
    this.elements[ele.id] = this.copyElement(ele);
  }

  private delete(ele: BaseElement) {
    if (!this.getElement(ele.id)) {
      throw new Error(`Element to remove does not exist. id:${ele.id} `);
    }
    delete this.elements[ele.id];
  }

  private update(ele: BaseElement) {
    const existingElement = this.getElement(ele.id);
    if (!existingElement) {
      throw new Error(`Element to update does not exist. id:${ele.id} `);
    }
    // this.checkValidType(src);
    for (const key of Object.keys(ele)) {
      if (key != "id") {
        existingElement[key] = ele[key];
      }
    }
  }

  private copyElement(src: BaseElement): BaseElement {
    // const obj: Record<string, any> = {};
    // for (const key of Object.keys(src)) {
    //   obj[key] = src[key];
    // }
    // return obj;

    switch (src.type) {
      case "project":
      case "page":
      case "line":
      case "arc":
        break;
      default:
        throw new Error(`bad element type:${src.type}`);
    }
    return {
      ...src,
    } as BaseElement;
  }

  private transactionStart(): transactionType {
    return { changes: [] };
  }

  private transactionCommit() {}
}

export default ProjectStore;

import { CUDType, ObjectType } from "./types";

const TYPE_START = "---";
type EntryType = "---" | "create" | "update" | "delete";

type UREntry = {
  type: EntryType;
  old: undefined | ObjectType[];
  new: undefined | ObjectType[];
};

export class UndoRedo {
  canUndo: boolean = false;
  canRedo: boolean = false;
  currentIndex: number = -1;
  entryList: UREntry[] = [];

  public createObjects(objects: ObjectType[]) {
    this.addEntry(TYPE_START);
    this.addEntry("create", undefined, objects);
  }

  public updateObjects(oldObjects: ObjectType[], newObjects: ObjectType[]) {
    this.addEntry(TYPE_START);
    this.addEntry("update", oldObjects, newObjects);
  }

  public deleteObjects(objects: ObjectType[]) {
    this.addEntry(TYPE_START);
    this.addEntry("delete", objects, undefined);
  }

  public undo() {
    let index = this.currentIndex;
    let todos: CUDType[] = [];
    if (index < 0) {
      // nothing to undo
      return todos;
    }

    while (index >= 0 && this.entryList[index].type !== TYPE_START) {
      const urEntry = this.entryList[index];

      const todo = this.undoOneEntry(urEntry);
      todos = todos.concat(todo);
      index--;
    }

    if (this.entryList[index].type !== TYPE_START) {
      throw new Error("bad undo list");
    }
    index--;
    this.setIndex(index);

    return todos;
  }

  public redo() {
    let index = this.currentIndex;
    let todos: CUDType[] = [];
    if (index === this.entryList.length - 1) {
      // nothing to redo
      return todos;
    }

    index++;
    if (this.entryList[index].type !== TYPE_START) {
      throw new Error("bad redo list");
    }

    while (
      index + 1 < this.entryList.length &&
      this.entryList[index + 1].type !== TYPE_START
    ) {
      index++;
      const urEntry = this.entryList[index];
      const todo = this.redoOneEntry(urEntry);
      todos = todos.concat(todo);
    }
    this.setIndex(index);
    return todos;
  }

  // --------------------------------------------

  private addEntry(
    type: EntryType,
    oldObjects?: ObjectType[],
    newObjects?: ObjectType[]
  ) {
    this.entryList.splice(this.currentIndex + 1);
    this.entryList.push({
      type,
      old: oldObjects,
      new: newObjects,
    });

    const currentIndex = this.entryList.length - 1;
    let canUndo = false;
    let canRedo = false;
    if (currentIndex >= 0) {
      canUndo = true;
    }
    if (currentIndex < this.entryList.length - 1) {
      canRedo = true;
    }

    this.currentIndex = currentIndex;
  }

  private undoOneEntry(entry: UREntry): CUDType {
    switch (entry.type) {
      case "create":
        if (!entry.new) {
          throw new Error("bad UREntry");
        }
        return { type: "delete", data: entry.new.map((e) => e.id) };

      case "delete":
        if (!entry.old) {
          throw new Error("bad UREntry");
        }
        return { type: "create", data: entry.old };

      case "update":
        if (!entry.old) {
          throw new Error("bad UREntry");
        }
        return { type: "update", data: entry.old };

      default:
        throw new Error("bad call undoOneEntry");
    }
  }

  private redoOneEntry(entry: UREntry): CUDType {
    switch (entry.type) {
      case "create":
        if (!entry.new) {
          throw new Error("bad UREntry");
        }
        return { type: "create", data: entry.new };

      case "delete":
        if (!entry.old) {
          throw new Error("bad UREntry");
        }
        return { type: "delete", data: entry.old.map((o) => o.id) };

      case "update":
        if (!entry.new) {
          throw new Error("bad UREntry");
        }
        return {
          type: "update",
          data: entry.new,
        };

      default:
        throw new Error("bad call redoOneEntry");
    }
  }

  private setIndex(index: number) {
    this.currentIndex = index;
  }
}

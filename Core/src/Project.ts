import { FractionIndex } from "./FractionIndex";

type EditType = {
  a: "c" | "u";
  n: Record<string, unknown>;
};

class Node {
  project: Project;
  id: string;
  name: string;
  children: Node[] = [];
  parent: string = ""; //  <parentId>:<fIndex>

  constructor(project: Project, id: string, name: string) {
    this.project = project;
    this.id = id;
    this.name = name;
  }

  appendChild(child: Node) {
    let fIdx = "";
    const countChildren = this.children.length;
    const parentId = this.id;
    if (countChildren === 0) {
      fIdx = FractionIndex.start();
    } else {
      const lastChild = this.children[countChildren - 1];
      const [pId, parentFIndex] = lastChild.parent.split("/");
      if (pId !== parentId) {
        throw new Error("children panik. ${parentId}, ${pId}");
      }
      fIdx = FractionIndex.after(parentFIndex);
    }
    child.parent = `${parentId}/${fIdx}`;
    this.children.push(child);
    this.project.addEditData({
      a: "u",
      n: { id: child.id, parent: child.parent },
    });
  }

  insertChild(index: number, child: Node) {
    const countChildren = this.children.length;
    if (index < 0) {
      throw new Error(`index too low: ${index}`);
    }
    if (index > countChildren - 1) {
      throw new Error(`index too high: ${index}`);
    }
    let fIdx = "";
    if (index === 0) {
      // first position
      const [_p, idx] = this.children[0].parent.split("/");
      fIdx = FractionIndex.before(idx);
    } else {
      const [_p1, beforeIdx] = this.children[index - 1].parent.split("/");
      const [_p2, afterIdx] = this.children[index].parent.split("/");
      fIdx = FractionIndex.between(beforeIdx, afterIdx);
    }
    const parentId = this.id;
    child.parent = `${parentId}/${fIdx}`;
    this.children.splice(index, 0, child);
    this.project.addEditData({
      a: "u",
      n: { id: child.id, parent: child.parent },
    });
  }

  findAll(callback?: (node: Node) => boolean) {
    let result: Node[] = [];
    for (let child of this.children) {
      if (!callback || callback(child)) {
        result.push(child);
      }
      const r = child.findAll(callback);
      result = result.concat(r);
    }
    return result;
  }
}

class Project extends Node {
  key: string;
  clientId: string;
  lastIdCounter: number = 0;
  nodes: Record<string, Node> = {};
  flushEditsCallback: (data: EditType[]) => {};
  private editData: EditType[] = [];

  constructor(
    clientId: string,
    key: string,
    flushEditsCallback: (data: EditType[]) => {}
  ) {
    super(undefined as unknown as Project, "0:0", "root");
    // this can't set on super()
    this.project = this;
    this.addNode(this);
    this.clientId = clientId;
    this.key = key;
    this.flushEditsCallback = flushEditsCallback;
  }

  createNode(name: string) {
    const node = new Node(this, this.newId(), name);
    this.addEditData({
      a: "c",
      n: { id: node.id, name: node.name },
    });
    return node;
  }

  export() {
    return this.findAll().map((node: Node) => {
      const n: Partial<Node> = { ...node };
      delete n.project;
      delete n.children;
      return n;
    });
  }

  applyEditData(data: EditType[]) {}

  addEditData(data: EditType) {
    this.editData.push(data);
  }

  flushEdits() {
    this.flushEditsCallback(this.editData);
    this.editData = [];
  }

  private newId() {
    this.lastIdCounter++;
    return `${this.clientId}:${this.lastIdCounter}`;
  }

  private addNode(node: Node) {
    const id = node.id;
    if (this.nodes[id]) {
      throw new Error(`Node allready exists. id:${id}`);
    }
    this.nodes[id] = node;
  }

  private getNode(id: string) {
    const node = this.nodes[id];
    if (!node) {
      throw new Error(`Node not found. id:${id}`);
    }
    return node;
  }
}

export { Project, Node };
